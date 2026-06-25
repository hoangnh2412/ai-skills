/** Minipower hook bypass: skip guards when prompt uses BYPASS prefix. */

const BYPASS_RE = /(?:^\s*BYPASS(?:\s+|$)|@\S+\s+BYPASS(?:\s+|$))/im

export function shouldBypass(prompt: string): boolean {
  return BYPASS_RE.test(prompt || "")
}
