/** Extract prompt text and file paths from OpenCode message parts. */

type PartLike = {
  type?: string
  text?: string
  synthetic?: boolean
  ignored?: boolean
  filename?: string
  url?: string
}

export function promptText(parts: PartLike[]): string {
  return parts
    .filter((p) => p.type === "text" && !p.synthetic && !p.ignored)
    .map((p) => p.text || "")
    .join("\n")
}

export function filePaths(parts: PartLike[]): string[] {
  const paths: string[] = []
  for (const part of parts) {
    if (part.type !== "file") continue
    const path = part.filename || fileUrlPath(part.url || "")
    if (path) paths.push(path.replace(/\\/g, "/"))
  }
  return paths
}

function fileUrlPath(url: string): string {
  if (url.startsWith("file://")) {
    try {
      return decodeURIComponent(new URL(url).pathname)
    } catch {
      return url.replace(/^file:\/\//, "")
    }
  }
  return url
}

export function prependText(parts: PartLike[], prefix: string): void {
  if (!prefix) return
  const first = parts.find((p) => p.type === "text" && !p.synthetic && !p.ignored)
  if (first) {
    first.text = first.text ? `${prefix}\n\n${first.text}` : prefix
    return
  }
  parts.unshift({ type: "text", text: prefix })
}

export function pushContext(parts: PartLike[], text: string): void {
  parts.push({ type: "text", text, synthetic: true })
}

export function blockParts(parts: PartLike[], msg: string): void {
  parts.length = 0
  parts.push({ type: "text", text: msg, synthetic: true })
}
