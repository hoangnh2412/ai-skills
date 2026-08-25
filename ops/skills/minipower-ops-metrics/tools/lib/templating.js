/**
 * Replace Grafana dashboard variables in PromQL before querying Prometheus.
 *
 * Handles:
 *   $instance, ${instance}
 *   instance="$instance", instance=~"$instance"
 *   $__interval, $__rate_interval, $__range
 */
export function substituteVariables(expr, variables, options = {}) {
  let result = expr;
  const stepSeconds = options.stepSeconds ?? 300;
  const rangeSeconds =
    options.rangeSeconds ??
    (options.end && options.start ? options.end - options.start : 86400);

  result = substituteBuiltIns(result, stepSeconds, rangeSeconds);

  const sortedNames = Object.keys(variables).sort(
    (a, b) => b.length - a.length
  );

  for (const name of sortedNames) {
    const value = variables[name];
    if (value === undefined || value === "") continue;

    result = substituteVariable(result, name, value);
  }

  return result;
}

function substituteBuiltIns(expr, stepSeconds, rangeSeconds) {
  const interval = `${stepSeconds}s`;
  const rateInterval = `${Math.max(stepSeconds * 4, 60)}s`;
  const range = `${rangeSeconds}s`;

  return expr
    .replace(/\$__interval/g, interval)
    .replace(/\$__rate_interval/g, rateInterval)
    .replace(/\$__range/g, range)
    .replace(/\$\{__interval\}/g, interval)
    .replace(/\$\{__rate_interval\}/g, rateInterval)
    .replace(/\$\{__range\}/g, range);
}

function substituteVariable(expr, name, value) {
  const escapedName = escapeRegExp(name);
  const patterns = [
    new RegExp(`\\$\\{${escapedName}\\}`, "g"),
    new RegExp(`\\$${escapedName}(?![a-zA-Z0-9_])`, "g"),
  ];

  let result = expr;
  for (const pattern of patterns) {
    result = result.replace(pattern, value);
  }

  return result;
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Validate that no unresolved $variables remain (except $__all).
 */
export function findUnresolvedVariables(expr) {
  const matches = expr.match(/\$(?:\{[a-zA-Z0-9_]+\}|[a-zA-Z0-9_]+)/g) ?? [];
  return matches.filter((m) => m !== "$__all" && !m.startsWith("$__"));
}
