# Minipower - UserPromptSubmit: token guard (Claude Code / Windows).
$ErrorActionPreference = 'Stop'
$cursorHook = Join-Path $PSScriptRoot '..\..\cursor\hooks\minipower-token-guard.ps1'
& $cursorHook
exit $LASTEXITCODE
