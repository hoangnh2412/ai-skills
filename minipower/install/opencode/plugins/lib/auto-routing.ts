/** Minipower auto-routing — port of install/cursor/hooks/minipower-auto-routing.py */

import { shouldBypass } from "./bypass.ts"

const PHASE_BY_DOC: Record<string, string> = {
  "01": "discovery",
  "02": "discovery",
  "03": "discovery",
  "04": "requirements",
  "05": "requirements",
  "06": "requirements",
  "07": "requirements",
  "08": "architecture",
  "09": "architecture",
  "10": "architecture",
  "11": "architecture",
  "12": "architecture",
  "13": "requirements",
  "14": "planning",
  "15": "planning",
  "16": "delivery",
  "17": "delivery",
  "18": "change-control",
}

const PHASE_LABEL: Record<string, string> = {
  discovery: "discovery (DOC-01–03)",
  requirements: "requirements (DOC-04–07, 13)",
  architecture: "architecture (DOC-08–12)",
  planning: "planning (DOC-14–15)",
  delivery: "delivery (DOC-16–17)",
  "change-control": "change-control (DOC-18)",
}

const DOC_IN_PROMPT = /DOC-(\d{2})-[\w-]+\.md/g
const DOC_BARE_IN_PROMPT = /DOC-(\d{2})(?![-\w])/g
const DOC_IN_NAME = /DOC-(\d{2})/
const EXPLICIT_PHASE =
  /Phase:\s*(discovery|requirements|architecture|planning|delivery|change-control)/i

export type RouteResult =
  | { action: "allow" }
  | { action: "warn"; message: string }
  | { action: "block"; message: string }
  | { action: "enrich"; prefix: string; context: string; phase: string }

function skillPath(phase: string): string {
  const root = (process.env.MINIPOWER_ROOT || "ai-skills/minipower").replace(/[/\\]+$/, "")
  return `${root}/skills/${phase}/SKILL.md`
}

function basename(path: string): string {
  const norm = path.replace(/\\/g, "/")
  const i = norm.lastIndexOf("/")
  return i >= 0 ? norm.slice(i + 1) : norm
}

function phaseForDoc(docNum: string): string | undefined {
  return PHASE_BY_DOC[docNum]
}

function addDocRef(
  byPhase: Record<string, string[]>,
  seen: Set<string>,
  docNum: string,
  label: string,
): void {
  if (!docNum || !label.trim() || seen.has(docNum)) return
  const phase = phaseForDoc(docNum)
  if (!phase) return
  seen.add(docNum)
  ;(byPhase[phase] ||= []).push(label)
}

function addEntry(byPhase: Record<string, string[]>, seen: Set<string>, path: string): void {
  if (!path?.trim()) return
  const match = basename(path).match(DOC_IN_NAME)
  if (!match) return
  addDocRef(byPhase, seen, match[1], path)
}

function collectByPhase(prompt: string, filePaths: string[]): Record<string, string[]> {
  const byPhase: Record<string, string[]> = {}
  const seen = new Set<string>()

  for (const path of filePaths) addEntry(byPhase, seen, path)

  for (const match of prompt.matchAll(DOC_IN_PROMPT)) {
    addEntry(byPhase, seen, match[0])
  }
  for (const match of prompt.matchAll(DOC_BARE_IN_PROMPT)) {
    addDocRef(byPhase, seen, match[1], `DOC-${match[1]}`)
  }

  return byPhase
}

function parseExplicitPhase(prompt: string): string | undefined {
  const match = prompt.match(EXPLICIT_PHASE)
  return match ? match[1].toLowerCase() : undefined
}

function buildRoutePrefix(prompt: string, phase: string, skill: string, docLabels: string[]): string {
  const lines: string[] = []
  if (!prompt.includes("/minipower")) lines.push("/minipower")
  if (!new RegExp(`Phase:\\s*${phase}\\b`, "i").test(prompt)) {
    lines.push(`Phase: ${phase}`)
  }
  if (!prompt.includes(skill)) lines.push(`@${skill}`)
  for (const doc of docLabels) {
    if (!doc || !/[/\\]DOC-\d{2}/.test(doc)) continue
    const docNorm = doc.replace(/\\/g, "/")
    if (!prompt.includes(docNorm)) lines.push(`@${docNorm}`)
  }
  return lines.join("\n")
}

function handleSinglePhase(
  byPhase: Record<string, string[]>,
  explicit: string | undefined,
  prompt: string,
): RouteResult {
  const detected = Object.keys(byPhase)[0]
  const files = byPhase[detected].join(", ")
  const label = PHASE_LABEL[detected] || detected

  if (explicit && explicit !== detected) {
    return {
      action: "block",
      message: [
        `Phase conflict: prompt ghi Phase: ${explicit} nhưng file DOC thuộc ${label}.`,
        "",
        `File: ${files}`,
        "",
        "Sửa prompt thành:",
        `Phase: ${detected}`,
        "/minipower",
        "@<file DOC>",
        "",
        `Hoặc bỏ dòng Phase: và chỉ tag file thuộc phase ${explicit}.`,
      ].join("\n"),
    }
  }

  if (!explicit) {
    const skill = skillPath(detected)
    const prefix = buildRoutePrefix(prompt, detected, skill, byPhase[detected])
    const context = [
      "Minipower auto-route (DOC -> phase).",
      `Phase: ${detected} Skill: @${skill}`,
      "Follow minipower-token-guard: one slice, read skill con for this phase only.",
    ].join(" ")
    return { action: "enrich", prefix, context, phase: detected }
  }

  return { action: "allow" }
}

function handleMultiPhase(
  byPhase: Record<string, string[]>,
  explicit: string | undefined,
): RouteResult {
  const lines = ["Conflict phase — các file DOC bạn tag thuộc nhiều phase khác nhau.", ""]

  for (const phase of Object.keys(byPhase).sort()) {
    lines.push(`• ${PHASE_LABEL[phase] || phase}:`)
    for (const path of byPhase[phase]) lines.push(`  - ${path}`)
    lines.push("")
  }

  lines.push("Gợi ý — tách thành từng prompt (mỗi prompt 1 phase):", "")

  Object.keys(byPhase)
    .sort()
    .forEach((phase, idx) => {
      const sample = byPhase[phase][0]
      lines.push(
        `${idx + 1}) Phase: ${phase}`,
        "   /minipower",
        `   @${sample}`,
        `   @${skillPath(phase)}`,
        "   <mô tả task cho phase này>",
        "",
      )
    })

  if (explicit) {
    lines.push(
      `Lưu ý: prompt hiện có Phase: ${explicit} — chỉ giữ file thuộc phase đó, bỏ tag file phase khác.`,
    )
  }

  return { action: "block", message: lines.join("\n") }
}

export function checkAutoRouting(prompt: string, filePaths: string[]): RouteResult {
  if (!prompt.trim() && filePaths.length === 0) return { action: "allow" }
  if (shouldBypass(prompt)) return { action: "allow" }

  const byPhase = collectByPhase(prompt, filePaths)
  const phases = Object.keys(byPhase)
  if (phases.length === 0) return { action: "allow" }

  const explicit = parseExplicitPhase(prompt)
  if (phases.length === 1) return handleSinglePhase(byPhase, explicit, prompt)
  return handleMultiPhase(byPhase, explicit)
}
