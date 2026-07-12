#!/usr/bin/env bash
# Minipower - decision-log staleness (Claude Code SessionStart / CLI).
# Delegates to Cursor SSOT scanner. Requires: git, python3. Chạy từ root dự án.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec python3 "${SCRIPT_DIR}/../../cursor/hooks/minipower-decision-staleness.py"
