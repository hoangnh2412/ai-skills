/** Đọc stdin, parse JSON. Dùng chung cho các CLI shim. Lỗi → object rỗng (fail-open). */

export async function readStdin() {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return Buffer.concat(chunks).toString("utf8")
}

export async function readJson() {
  const raw = (await readStdin()).trim()
  if (!raw) return {}
  try {
    const data = JSON.parse(raw)
    return data && typeof data === "object" ? data : {}
  } catch {
    return {}
  }
}

/** attachments:[{type:"file",file_path}] → ["path", ...] */
export function attachmentPaths(data) {
  const atts = Array.isArray(data.attachments) ? data.attachments : []
  return atts
    .filter((a) => a && typeof a === "object")
    .map((a) => a.file_path || a.path || "")
    .filter(Boolean)
}

export function out(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n")
}
