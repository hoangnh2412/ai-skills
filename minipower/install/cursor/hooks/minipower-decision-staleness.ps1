# Minipower - beforeSubmitPrompt: decision-log staleness advisory (Windows / PowerShell).
# Keyword-gated, non-blocking. SSOT scanner: minipower-decision-staleness.py. Requires: git, python.
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot/hook-stdin.ps1"

function Allow { '{"continue": true}' | Write-Output; exit 0 }

$raw = Read-MinipowerHookStdin
if ([string]::IsNullOrWhiteSpace($raw)) { Allow }

$data = ConvertFrom-MinipowerHookJson -Raw $raw
$prompt = if ($null -ne $data -and $null -ne $data.prompt) { [string]$data.prompt } else { Get-HookPromptFromRaw -Raw $raw }
if ([string]::IsNullOrWhiteSpace($prompt)) { Allow }

if ($prompt -notmatch '(?i)decision|deliberation|premise|quyết định|đánh giá lại|baseline|supersede|stale|lỗi thời') { Allow }

$env:MP_PROJECT_ROOT = (Get-Location).Path
$adv = & python "$PSScriptRoot/minipower-decision-staleness.py" 2>$null
if (-not [string]::IsNullOrWhiteSpace($adv)) {
  $text = ($adv -join "`n")
  [Console]::Error.WriteLine($text)
  Write-MinipowerHookJson @{ continue = $true; additional_context = $text }
  exit 0
}

Allow
