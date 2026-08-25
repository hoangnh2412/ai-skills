import { unixToIso } from "./config.js";

/**
 * Normalize Prometheus query_range result for AI consumption.
 *
 * Input (Prometheus):
 *   { metric: { instance: "server01" }, values: [[1718200000, "23.4"], ...] }
 *
 * Output:
 *   { panel, unit, series: [{ instance, points: [{ time, value }] }] }
 */
export function normalizePanelMetrics(panel, queryData, options = {}) {
  const results = queryData?.result ?? [];

  const series = results.map((item) => {
    const labelKeys = Object.keys(item.metric ?? {});
    const points = (item.values ?? []).map(([ts, val]) => ({
      time: unixToIso(ts),
      value: parseFloat(val),
    }));

    const seriesEntry = { points };

    for (const key of labelKeys) {
      seriesEntry[key] = item.metric[key];
    }

    if (labelKeys.length === 1) {
      seriesEntry.label = item.metric[labelKeys[0]];
    } else if (labelKeys.length > 1) {
      seriesEntry.label = labelKeys
        .map((k) => `${k}=${item.metric[k]}`)
        .join(", ");
    }

    return seriesEntry;
  });

  return {
    panel: panel.title,
    panelId: panel.id,
    panelType: panel.type,
    parentTitle: panel.parentTitle,
    unit: panel.unit,
    expr: options.expr,
    refId: options.refId,
    series,
    summary: summarizeSeries(series),
  };
}

function summarizeSeries(series) {
  const allValues = series.flatMap((s) =>
    s.points.map((p) => p.value).filter((v) => Number.isFinite(v))
  );

  if (allValues.length === 0) {
    return { count: 0, min: null, max: null, avg: null, latest: null };
  }

  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const avg = allValues.reduce((a, b) => a + b, 0) / allValues.length;
  const latest = series
    .flatMap((s) => s.points.slice(-1))
    .map((p) => p.value)
    .filter((v) => Number.isFinite(v));

  return {
    seriesCount: series.length,
    pointCount: allValues.length,
    min: round(min),
    max: round(max),
    avg: round(avg),
    latest: latest.length ? round(latest[latest.length - 1]) : null,
  };
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}

/**
 * Build final report object for AI.
 */
export function buildReport({
  dashboardUid,
  dashboardTitle,
  timeRange,
  variables,
  panels,
}) {
  return {
    fetchedAt: new Date().toISOString(),
    dashboard: {
      uid: dashboardUid,
      title: dashboardTitle,
    },
    timeRange: {
      start: unixToIso(timeRange.start),
      end: unixToIso(timeRange.end),
      stepSeconds: timeRange.step,
      hours: Math.round((timeRange.end - timeRange.start) / 3600),
    },
    variables,
    panels,
    errors: panels
      .filter((p) => p.error)
      .map((p) => ({
        panel: p.panel ?? p.title,
        expr: p.expr,
        error: p.error,
      })),
  };
}
