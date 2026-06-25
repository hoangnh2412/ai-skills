# Minipower - UserPromptSubmit: DOC -> phase auto-routing (Claude Code / Windows).
$ErrorActionPreference = 'Stop'
$cursorHook = Join-Path $PSScriptRoot '..\..\cursor\hooks\minipower-auto-routing.ps1'
& $cursorHook
exit $LASTEXITCODE
