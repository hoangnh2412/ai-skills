#!/usr/bin/env bash
# Minipower - beforeSubmitPrompt: decision-log staleness advisory (macOS / Linux).
# Keyword-gated (chỉ chạy khi prompt liên quan quyết định) — non-blocking, luôn continue.
# SSOT scanner: minipower-decision-staleness.py. Requires: git, python3.
set -euo pipefail

input=$(cat)
prompt=$(printf '%s' "$input" | python3 -c 'import json,sys
try: d=json.load(sys.stdin); print(d.get("prompt") or "")
except Exception: print("")' 2>/dev/null || printf '')

allow() { printf '%s\n' '{"continue": true}'; exit 0; }

[[ -z "${prompt//[[:space:]]/}" ]] && allow

# Gate: chỉ quét khi prompt bàn về quyết định / baseline (tránh chạy mỗi prompt).
printf '%s' "$prompt" | grep -qiE 'decision|deliberation|premise|quyết định|đánh giá lại|baseline|supersede|stale|lỗi thời' || allow

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
adv=$(MP_PROJECT_ROOT="$PWD" python3 "${SCRIPT_DIR}/minipower-decision-staleness.py" 2>/dev/null || printf '')

if [[ -n "${adv//[[:space:]]/}" ]]; then
  printf '%s\n' "$adv" >&2
  MP_ADV="$adv" python3 -c 'import json,os; print(json.dumps({"continue":True,"additional_context":os.environ["MP_ADV"]}, ensure_ascii=False))'
  exit 0
fi

allow
