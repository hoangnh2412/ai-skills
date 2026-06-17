#!/usr/bin/env bash
# Minipower - beforeSubmitPrompt: DOC file -> phase, block on conflict (macOS / Linux)
# SSOT map: agents/auto-routing.md
# Requires: python3 (stdlib only)
# Install: chmod +x; symlink to .cursor/hooks/; merge hooks.fragment.unix.json
# Runs after check-prompt-scope.sh in the same event chain.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec python3 "${SCRIPT_DIR}/check-doc-phase.py"
