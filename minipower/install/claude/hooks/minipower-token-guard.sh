#!/usr/bin/env bash
# Minipower - UserPromptSubmit: token guard (Claude Code) — delegates to cursor hook logic.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "${SCRIPT_DIR}/../../cursor/hooks/minipower-token-guard.sh"
