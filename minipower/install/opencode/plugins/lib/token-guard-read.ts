/** Minipower read guard — port of install/cursor/hooks/minipower-token-guard-read.sh */

export type ReadGuardResult = { action: "allow" } | { action: "deny"; message: string }

export function checkReadGuard(filePath: string, prompt: string): ReadGuardResult {
  const path = (filePath || "").replace(/\\/g, "/")
  if (!path.trim()) return { action: "allow" }

  const allowLegacy = /_legacy|MIGRATION|migrate/i.test(prompt)

  if (path.includes("docs/02-baseline")) {
    return {
      action: "deny",
      message: "02-baseline tốn token. Chỉ đọc khi user yêu cầu rõ migrate hoặc baseline.",
    }
  }

  if (!allowLegacy && path.includes("docs/03-modules/_legacy")) {
    return {
      action: "deny",
      message: "_legacy tốn token. Chỉ đọc khi migrate — user cần nói _legacy hoặc MIGRATION.",
    }
  }

  return { action: "allow" }
}
