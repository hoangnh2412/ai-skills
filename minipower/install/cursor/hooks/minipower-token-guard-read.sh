#!/usr/bin/env bash
# Minipower - beforeReadFile / token guard read limits (optional, macOS / Linux)
# Requires: python3 (stdlib json)
# Install: chmod +x; symlink to .cursor/hooks/; merge hooks.fragment.unix.json
set -euo pipefail

input=$(cat)
eval "$(printf '%s' "$input" | python3 -c '
import json, shlex, sys
d = json.load(sys.stdin)
path = (d.get("file_path") or d.get("path") or "").replace("\\", "/")
prompt = d.get("prompt") or ""
print("path=" + shlex.quote(path))
print("prompt=" + shlex.quote(prompt))
')"

allow() { printf '%s\n' '{"permission": "allow"}'; exit 0; }
deny() {
  local msg="$1"
  MP_DENY_MSG="$msg" python3 -c 'import json,os; m=os.environ["MP_DENY_MSG"]; print(json.dumps({"permission":"deny","user_message":m,"agent_message":m}, ensure_ascii=False))'
  exit 0
}

[[ -z "${path//[[:space:]]/}" ]] && allow

allow_legacy=false
if echo "$prompt" | grep -qE '_legacy|MIGRATION|migrate'; then
  allow_legacy=true
fi

if echo "$path" | grep -q 'docs/02-baseline'; then
  deny '02-baseline tốn token. Chỉ đọc khi user yêu cầu rõ migrate hoặc baseline.'
fi

if [[ "$allow_legacy" == false ]] && echo "$path" | grep -q 'docs/03-modules/_legacy'; then
  deny '_legacy tốn token. Chỉ đọc khi migrate — user cần nói _legacy hoặc MIGRATION.'
fi

allow
