#!/usr/bin/env bash
# Minipower - beforeSubmitPrompt (macOS / Linux)
# Requires: python3 (stdlib json)
# Install: chmod +x; symlink to .cursor/hooks/; merge hooks.fragment.unix.json
set -euo pipefail

input=$(cat)
prompt=$(printf '%s' "$input" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("prompt") or "")')

allow() { printf '%s\n' '{"continue": true}'; exit 0; }
warn() {
  printf '[WARN] Minipower token guard: %s\n' "$1" >&2
  printf '%s\n' '{"continue": true}'
  exit 0
}
block() {
  local msg="$1"
  printf '[BLOCK] %s\n' "$msg" >&2
  MP_BLOCK_MSG="$msg" python3 -c 'import json,os; print(json.dumps({"continue":False,"user_message":os.environ["MP_BLOCK_MSG"]}, ensure_ascii=False))'
  exit 2
}

[[ -z "${prompt//[[:space:]]/}" ]] && allow

lower=$(printf '%s' "$prompt" | tr '[:upper:]' '[:lower:]')

has_phase=false
has_module=false
has_platform=false
has_doc=false
has_at_file=false

echo "$prompt" | grep -qE 'Phase:[[:space:]]*(discovery|requirements|architecture|planning|delivery|change-control)' && has_phase=true

if echo "$lower" | grep -qE 'module:[[:space:]]*[a-z0-9_-]+'; then
  has_module=true
elif echo "$prompt" | grep -qE '@docs[/\\]03-modules[/\\][^_/\\[:space:]][^/\\[:space:]]*'; then
  has_module=true
elif echo "$prompt" | grep -qE '(^|[[:space:]])03-modules[/\\][^_/\\[:space:]][^/\\[:space:]]*'; then
  has_module=true
elif echo "$prompt" | grep -qE '\b[A-Z][A-Z0-9]{1,5}-(FR|UC|BR|AC|NFR|ADR)-[0-9]{2,}\b'; then
  has_module=true
fi

if echo "$lower" | grep -q '04-platform' || echo "$prompt" | grep -qE '@docs[/\\]04-platform'; then
  has_platform=true
fi

echo "$prompt" | grep -qE 'DOC-0[0-9]' && has_doc=true

if echo "$prompt" | grep -qE '@docs[/\\]03-modules[/\\][^/\\[:space:]]+[/\\]DOC-' \
  || echo "$prompt" | grep -qE '@docs[/\\]04-platform[/\\]DOC-'; then
  has_at_file=true
fi

if echo "$prompt" | grep -qE '@docs[/\\]?[[:space:]]*$' \
  || echo "$prompt" | grep -qE '@docs[/\\]03-modules[/\\]?[[:space:]]*$'; then
  block 'Bạn đang @ cả thư mục docs/modules. Hãy @ 1 file, vd: @docs/03-modules/{module-id}/DOC-06-srs.md'
fi

if echo "$prompt" | grep -qE '@docs[/\\]02-baseline' \
  || echo "$prompt" | grep -qE '@docs[/\\]03-modules[/\\]_legacy'; then
  block '02-baseline và _legacy tốn token. Chỉ dùng khi migrate — @ file MIGRATION.md hoặc 1 DOC cụ thể.'
fi

looks_like_minipower=false
looks_like_edit=false

if echo "$lower" | grep -q 'minipower' || [[ "$has_phase" == true ]]; then
  looks_like_minipower=true
fi

if echo "$lower" | grep -qE 'sửa|cập nhật|viết|thêm|sync|đồng bộ|review'; then
  looks_like_edit=true
fi

if [[ "$looks_like_minipower" == true && "$looks_like_edit" == true && "$has_at_file" == false ]]; then
  has_scope_target=false
  [[ "$has_module" == true || "$has_platform" == true ]] && has_scope_target=true
  if [[ "$has_phase" == false || "$has_doc" == false || "$has_scope_target" == false ]]; then
    warn 'Thiếu scope: thêm Phase + Module (hoặc 04-platform) + DOC-XX, hoặc @ 1 file đích. Ví dụ: Phase: requirements — Module: {module-id}, DOC-06 §2'
  fi
fi

if echo "$lower" | grep -qE 'toàn bộ|all modules|sync everything|đồng bộ hết|review all'; then
  warn 'Prompt quá rộng — tách theo 1 module/DOC mỗi phiên để tiết kiệm token.'
fi

allow
