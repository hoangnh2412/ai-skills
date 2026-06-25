/**
 * Tempo trace query via Grafana datasource proxy.
 */
import { fetchJson, grafanaAuthHeader } from "./config.js";

function resolveUid(config, datasourceUid) {
  const uid = datasourceUid || config.tempoDatasourceUid;
  if (!uid) {
    throw new Error(
      "Tempo datasource UID is required (--datasource-uid or TEMPO_DATASOURCE_UID)"
    );
  }
  return uid;
}

function proxyBase(config, datasourceUid) {
  const uid = resolveUid(config, datasourceUid);
  return `${config.grafanaUrl}/api/datasources/proxy/uid/${encodeURIComponent(uid)}`;
}

function authHeaders(config) {
  return {
    Accept: "application/json",
    ...grafanaAuthHeader(config.grafanaUser, config.grafanaPassword),
  };
}

/**
 * GET /api/traces/{traceId}
 */
export async function getTraceById(config, { traceId, datasourceUid }) {
  if (!traceId?.trim()) {
    throw new Error("traceId is required");
  }

  const url = `${proxyBase(config, datasourceUid)}/api/traces/${encodeURIComponent(traceId.trim())}`;
  return fetchJson(url, { headers: authHeaders(config) });
}

/**
 * GET /api/search — tags (logfmt) hoặc TraceQL (q).
 */
export async function searchTraces(
  config,
  { tags, traceql, start, end, limit, minDuration, maxDuration, datasourceUid }
) {
  if (!tags?.trim() && !traceql?.trim()) {
    throw new Error("tags or traceql is required for trace search");
  }

  const params = new URLSearchParams({
    start: String(Number(start)),
    end: String(Number(end)),
    limit: String(limit ?? 20),
  });

  if (traceql?.trim()) {
    params.set("q", traceql.trim());
  } else {
    params.set("tags", tags.trim());
  }

  if (minDuration) params.set("minDuration", minDuration);
  if (maxDuration) params.set("maxDuration", maxDuration);

  const url = `${proxyBase(config, datasourceUid)}/api/search?${params}`;
  return fetchJson(url, { headers: authHeaders(config) });
}

/**
 * Build logfmt tags string từ --tag key=value (lặp được).
 */
export function buildTagsLogfmt(tagEntries) {
  const list = Array.isArray(tagEntries) ? tagEntries : [tagEntries];

  return list
    .map((entry) => {
      const trimmed = String(entry).trim();
      const eq = trimmed.indexOf("=");
      if (eq <= 0) {
        throw new Error(`Invalid tag format (use key=value): ${trimmed}`);
      }

      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      const needsQuotes = /[\s=]/.test(value);
      return needsQuotes
        ? `${key}="${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
        : `${key}=${value}`;
    })
    .join(" ");
}

/**
 * Normalize Tempo search response.
 */
export function normalizeSearchResponse(raw, meta = {}) {
  const traces = (raw?.traces ?? []).map((t) => ({
    traceId: t.traceID ?? t.traceId,
    rootServiceName: t.rootServiceName,
    rootTraceName: t.rootTraceName,
    startTime: nsToIso(t.startTimeUnixNano),
    durationMs: t.durationMs,
  }));

  return {
    ...meta,
    mode: "search",
    traces,
    summary: {
      traceCount: traces.length,
    },
    metrics: raw?.metrics,
  };
}

/**
 * Normalize OTLP JSON trace (batches → flat spans).
 */
export function normalizeTraceResponse(raw, meta = {}) {
  const spans = [];
  const services = new Set();

  for (const batch of raw?.batches ?? []) {
    const resourceAttrs = attributesToMap(batch.resource?.attributes);
    const serviceName =
      resourceAttrs["service.name"] ??
      resourceAttrs.service_name ??
      resourceAttrs.service;

    if (serviceName) services.add(String(serviceName));

    for (const scopeSpan of batch.scopeSpans ?? []) {
      for (const span of scopeSpan.spans ?? []) {
        const attrs = attributesToMap(span.attributes);
        const startNs = Number(span.startTimeUnixNano ?? 0);
        const endNs = Number(span.endTimeUnixNano ?? 0);
        const durationMs =
          startNs && endNs ? Math.round((endNs - startNs) / 1_000_000) : undefined;

        spans.push({
          traceId: span.traceId,
          spanId: span.spanId,
          parentSpanId: span.parentSpanId || undefined,
          name: span.name,
          service: serviceName,
          kind: span.kind,
          startTime: nsToIso(startNs),
          durationMs,
          status: span.status?.code ?? span.status?.message,
          attributes: attrs,
        });
      }
    }
  }

  spans.sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)));

  const traceId = spans[0]?.traceId ?? meta.request?.traceId;
  const totalDurationMs = spans.reduce(
    (max, s) => Math.max(max, s.durationMs ?? 0),
    0
  );

  return {
    ...meta,
    mode: "trace",
    trace: {
      traceId,
      spans,
      summary: {
        spanCount: spans.length,
        services: [...services],
        durationMs: totalDurationMs,
      },
    },
  };
}

function attributesToMap(attributes) {
  const map = {};
  for (const attr of attributes ?? []) {
    const key = attr.key;
    if (!key) continue;
    map[key] = attributeValue(attr.value);
  }
  return map;
}

function attributeValue(value) {
  if (!value || typeof value !== "object") return value;
  if ("stringValue" in value) return value.stringValue;
  if ("intValue" in value) return Number(value.intValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("boolValue" in value) return value.boolValue;
  if ("arrayValue" in value) {
    return (value.arrayValue?.values ?? []).map(attributeValue);
  }
  return JSON.stringify(value);
}

function nsToIso(ns) {
  if (!ns) return undefined;
  const ms = Math.floor(Number(ns) / 1_000_000);
  if (!Number.isFinite(ms) || ms <= 0) return undefined;
  return new Date(ms).toISOString();
}
