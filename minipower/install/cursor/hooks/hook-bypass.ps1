# Minipower — BYPASS prefix check for hook scripts (Windows PowerShell).
# Dot-source: . "$PSScriptRoot/hook-bypass.ps1"

function Test-MinipowerHookBypass {
  param([string]$Prompt)
  return $Prompt -match '(?im)(?:^\s*BYPASS(?:\s+|$)|@\S+\s+BYPASS(?:\s+|$))'
}
