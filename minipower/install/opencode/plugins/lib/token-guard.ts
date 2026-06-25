/** Minipower token guard — port of install/cursor/hooks/minipower-token-guard.sh */

import { shouldBypass } from "./bypass.ts"

export type GuardResult =
  | { action: "allow" }
  | { action: "warn"; message: string }
  | { action: "block"; message: string }

export function checkTokenGuard(prompt: string): GuardResult {
  if (!prompt.trim()) return { action: "allow" }
  if (shouldBypass(prompt)) return { action: "allow" }

  const lower = prompt.toLowerCase()

  const hasPhase = /Phase:\s*(discovery|requirements|architecture|planning|delivery|change-control)/i.test(
    prompt,
  )

  let hasModule = /module:\s*[a-z0-9_-]+/i.test(lower)
  if (!hasModule && /@docs[/\\]03-modules[/\\][^_/\\[\s:]][^/\\\s:]*/.test(prompt)) {
    hasModule = true
  }
  if (!hasModule && /(^|\s)03-modules[/\\][^_/\\[\s:]][^/\\\s:]*/.test(prompt)) {
    hasModule = true
  }
  if (!hasModule && /\b[A-Z][A-Z0-9]{1,5}-(FR|UC|BR|AC|NFR|ADR)-[0-9]{2,}\b/.test(prompt)) {
    hasModule = true
  }

  const hasPlatform = lower.includes("04-platform") || /@docs[/\\]04-platform/.test(prompt)
  const hasDoc = /DOC-0[0-9]/.test(prompt)
  const hasAtFile =
    /@docs[/\\]03-modules[/\\][^/\\\s]+[/\\]DOC-/.test(prompt) ||
    /@docs[/\\]04-platform[/\\]DOC-/.test(prompt)

  if (/@docs[/\\]?\s*$/.test(prompt) || /@docs[/\\]03-modules[/\\]?\s*$/.test(prompt)) {
    return {
      action: "block",
      message:
        "Bạn đang @ cả thư mục docs/modules. Hãy @ 1 file, vd: @docs/03-modules/{module-id}/DOC-06-srs.md",
    }
  }

  if (
    /@docs[/\\]02-baseline/.test(prompt) ||
    /@docs[/\\]03-modules[/\\]_legacy/.test(prompt)
  ) {
    return {
      action: "block",
      message:
        "02-baseline và _legacy tốn token. Chỉ dùng khi migrate — @ file MIGRATION.md hoặc 1 DOC cụ thể.",
    }
  }

  const looksLikeMinipower = lower.includes("minipower") || hasPhase
  const looksLikeEdit = /sửa|cập nhật|viết|thêm|sync|đồng bộ|review/i.test(lower)

  if (looksLikeMinipower && looksLikeEdit && !hasAtFile) {
    const hasScopeTarget = hasModule || hasPlatform
    if (!hasPhase || !hasDoc || !hasScopeTarget) {
      return {
        action: "warn",
        message:
          "Thiếu scope: thêm Phase + Module (hoặc 04-platform) + DOC-XX, hoặc @ 1 file đích. Ví dụ: Phase: requirements — Module: {module-id}, DOC-06 §2",
      }
    }
  }

  if (/toàn bộ|all modules|sync everything|đồng bộ hết|review all/i.test(lower)) {
    return {
      action: "warn",
      message: "Prompt quá rộng — tách theo 1 module/DOC mỗi phiên để tiết kiệm token.",
    }
  }

  return { action: "allow" }
}
