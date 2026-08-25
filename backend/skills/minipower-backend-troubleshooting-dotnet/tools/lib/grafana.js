import { fetchJson, grafanaAuthHeader } from "./config.js";

/**
 * GET /api/dashboards/uid/{uid}
 */
export async function fetchDashboard(config, uid) {
  const url = `${config.grafanaUrl}/api/dashboards/uid/${encodeURIComponent(uid)}`;
  return fetchJson(url, {
    headers: {
      Accept: "application/json",
      ...grafanaAuthHeader(config.grafanaUser, config.grafanaPassword),
    },
  });
}

/**
 * GET /api/search — list dashboards (optional helper).
 */
export async function searchDashboards(config, query = "") {
  const params = new URLSearchParams({ type: "dash-db" });
  if (query) params.set("query", query);

  const url = `${config.grafanaUrl}/api/search?${params}`;
  return fetchJson(url, {
    headers: {
      Accept: "application/json",
      ...grafanaAuthHeader(config.grafanaUser, config.grafanaPassword),
    },
  });
}

/**
 * Collect all panels including nested row panels.
 */
export function collectPanels(panels, parentTitle = "") {
  const result = [];

  for (const panel of panels ?? []) {
    if (panel.type === "row" && Array.isArray(panel.panels)) {
      result.push(...collectPanels(panel.panels, panel.title ?? parentTitle));
      continue;
    }

    if (panel.hidden === true) continue;

    result.push({
      id: panel.id,
      title: panel.title ?? `Panel ${panel.id ?? "?"}`,
      parentTitle: parentTitle || undefined,
      type: panel.type,
      unit: extractPanelUnit(panel),
      targets: extractTargets(panel),
    });
  }

  return result;
}

function extractTargets(panel) {
  const targets = [];

  for (const target of panel.targets ?? []) {
    const expr = target.expr ?? target.query ?? target.rawQuery;
    if (typeof expr === "string" && expr.trim()) {
      targets.push({
        refId: target.refId,
        expr: expr.trim(),
        legendFormat: target.legendFormat,
      });
    }
  }

  return targets;
}

function extractPanelUnit(panel) {
  const unit =
    panel.fieldConfig?.defaults?.unit ??
    panel.options?.unit ??
    panel.yaxes?.[0]?.format ??
    panel.yaxes?.[0]?.unit;

  return unit && unit !== "none" ? unit : undefined;
}

/**
 * Build variable map from dashboard.templating.list
 */
export function extractTemplateVariables(dashboard) {
  const list = dashboard?.templating?.list ?? [];
  const variables = {};

  for (const item of list) {
    if (!item.name || item.hide === 2) continue;

    const value = resolveVariableValue(item);
    if (value !== undefined && value !== "") {
      variables[item.name] = value;
    }
  }

  return variables;
}

function resolveVariableValue(item) {
  const current = item.current;

  if (current?.value !== undefined && current?.value !== null) {
    if (Array.isArray(current.value)) {
      return current.value.filter(Boolean).join("|");
    }
    return String(current.value);
  }

  if (Array.isArray(item.options) && item.options.length > 0) {
    const selected = item.options.find((o) => o.selected) ?? item.options[0];
    if (selected?.value !== undefined) {
      return String(selected.value);
    }
  }

  if (item.query !== undefined && typeof item.query === "string") {
    return item.query;
  }

  return undefined;
}

/**
 * Metadata of dashboard template variables (for list-dashboard-vars).
 */
export function describeTemplateVariables(dashboard) {
  const list = dashboard?.templating?.list ?? [];

  return list
    .filter((item) => item.name && item.hide !== 2)
    .map((item) => ({
      name: item.name,
      label: item.label ?? item.name,
      type: item.type,
      multi: !!item.multi,
      includeAll: !!item.includeAll,
      allValue: item.allValue,
      current: formatCurrentValue(item.current),
      options: (item.options ?? [])
        .slice(0, 20)
        .map((o) => o.value ?? o.text)
        .filter(Boolean),
    }));
}

function formatCurrentValue(current) {
  if (!current || current.value === undefined || current.value === null) {
    return undefined;
  }

  if (Array.isArray(current.value)) {
    return current.value.join("|");
  }

  return String(current.value);
}
