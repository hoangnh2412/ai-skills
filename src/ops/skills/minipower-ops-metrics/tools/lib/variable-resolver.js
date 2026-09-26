import { fetchJson } from "./config.js";
import { substituteVariables } from "./templating.js";

/**
 * Resolve all dashboard template variables, querying Prometheus when needed.
 * `overrides` take precedence (CLI --exported-job, --exported-instance, --var).
 */
export async function resolveTemplateVariables(
  config,
  dashboard,
  timeRange,
  overrides = {}
) {
  const list = dashboard?.templating?.list ?? [];
  const resolved = { ...overrides };

  for (const item of list) {
    if (!item.name || item.hide === 2) continue;
    if (overrides[item.name] !== undefined) continue;

    const value = await resolveVariable(config, item, resolved, timeRange);
    if (value !== undefined && value !== "") {
      resolved[item.name] = value;
    }
  }

  return resolved;
}

async function resolveVariable(config, item, alreadyResolved, timeRange) {
  const fromCurrent = valueFromCurrent(item);
  if (fromCurrent !== undefined) return fromCurrent;

  if (item.includeAll && item.allValue !== undefined) {
    const fromProm = await queryVariableValues(
      config,
      item,
      alreadyResolved,
      timeRange
    );
    if (fromProm.length === 0) {
      return String(item.allValue);
    }

    if (item.multi) {
      return item.includeAll ? String(item.allValue) : fromProm.join("|");
    }

    return fromProm[0];
  }

  const fromProm = await queryVariableValues(
    config,
    item,
    alreadyResolved,
    timeRange
  );
  if (fromProm.length > 0) {
    return item.multi ? fromProm.join("|") : fromProm[0];
  }

  return undefined;
}

function valueFromCurrent(item) {
  const current = item.current;
  if (!current || Object.keys(current).length === 0) return undefined;

  if (current.value !== undefined && current.value !== null && current.value !== "") {
    if (current.value === "$__all" && item.allValue !== undefined) {
      return String(item.allValue);
    }
    if (Array.isArray(current.value)) {
      if (current.value.includes("$__all") && item.allValue !== undefined) {
        return String(item.allValue);
      }
      return current.value.filter(Boolean).join("|");
    }
    return String(current.value);
  }

  if (Array.isArray(item.options) && item.options.length > 0) {
    const selected = item.options.filter((o) => o.selected);
    const values = (selected.length ? selected : [item.options[0]])
      .map((o) => o.value)
      .filter((v) => v !== undefined && v !== "");

    if (values.length) {
      return item.multi ? values.join("|") : String(values[0]);
    }
  }

  return undefined;
}

/**
 * Parse Grafana label_values(...) and fetch from Prometheus /api/v1/label/{name}/values
 */
async function queryVariableValues(config, item, alreadyResolved, timeRange) {
  const queryText = extractVariableQuery(item);
  if (!queryText) return [];

  const parsed = parseLabelValuesQuery(queryText);
  if (!parsed) return [];

  const match = substituteVariables(parsed.selector, alreadyResolved, {
    stepSeconds: timeRange?.step ?? 300,
    rangeSeconds: timeRange ? timeRange.end - timeRange.start : 86400,
    start: timeRange?.start,
    end: timeRange?.end,
  });

  const params = new URLSearchParams();
  params.append("match[]", match);

  const url = `${config.prometheusUrl}/api/v1/label/${encodeURIComponent(parsed.label)}/values?${params}`;

  try {
    const body = await fetchJson(url, { headers: { Accept: "application/json" } });
    if (body.status !== "success") return [];
    return (body.data ?? []).filter(Boolean).sort();
  } catch {
    return [];
  }
}

function extractVariableQuery(item) {
  if (typeof item.definition === "string" && item.definition.trim()) {
    return item.definition.trim();
  }
  if (typeof item.query === "string" && item.query.trim()) {
    return item.query.trim();
  }
  if (item.query?.query && typeof item.query.query === "string") {
    return item.query.query.trim();
  }
  return undefined;
}

/**
 * label_values({selector}, labelName)
 */
function parseLabelValuesQuery(queryText) {
  const match = queryText.match(/^label_values\s*\(\s*(.+)\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)\s*$/);
  if (!match) return null;

  return {
    selector: match[1].trim(),
    label: match[2].trim(),
  };
}
