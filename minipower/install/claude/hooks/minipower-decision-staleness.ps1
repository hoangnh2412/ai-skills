# Minipower - decision-log staleness (Claude Code SessionStart / CLI).
# Delegates to Cursor SSOT scanner. Requires: git, python. Chạy từ root dự án.
$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
python "$ScriptDir\..\..\cursor\hooks\minipower-decision-staleness.py"
