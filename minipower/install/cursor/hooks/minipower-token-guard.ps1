# Minipower - beforeSubmitPrompt (Windows / PowerShell)
# Install: symlink to .cursor/hooks/ and merge hooks.fragment.windows.json into .cursor/hooks.json

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot/hook-stdin.ps1"
. "$PSScriptRoot/hook-bypass.ps1"

function Allow { '{"continue": true}' | Write-Output; exit 0 }
function Warn($msg) {
  [Console]::Error.WriteLine("[WARN] Minipower token guard: $msg")
  '{"continue": true}' | Write-Output
  exit 0
}
function Block($msg) {
  [Console]::Error.WriteLine("[BLOCK] $msg")
  @{ continue = $false; user_message = $msg } | ConvertTo-Json -Compress | Write-Output
  exit 2
}

$raw = Read-MinipowerHookStdin
if ([string]::IsNullOrWhiteSpace($raw)) { Allow }

$data = ConvertFrom-MinipowerHookJson -Raw $raw
$prompt = if ($null -ne $data -and $null -ne $data.prompt) { [string]$data.prompt } else { Get-HookPromptFromRaw -Raw $raw }

if ([string]::IsNullOrWhiteSpace($prompt)) { Allow }

if (Test-MinipowerHookBypass $prompt) { Allow }

$lower = $prompt.ToLowerInvariant()
$hasPhase = $prompt -match 'Phase:\s*(discovery|requirements|architecture|planning|delivery|change-control)'
$hasModule = $prompt -match '(?i)\bModule:\s*[\w-]+' `
  -or $prompt -match '@docs[/\\]03-modules[/\\](?!_)[^/\\\s]+' `
  -or $prompt -match '\b03-modules[/\\](?!_)[^/\\\s]+' `
  -or $prompt -match '\b[A-Z][A-Z0-9]{1,5}-(FR|UC|BR|AC|NFR|ADR)-\d{2,}\b'
$hasPlatform = $prompt -match '(?i)\b04-platform\b' -or $prompt -match '@docs[/\\]04-platform'
$hasDoc = $prompt -match 'DOC-0[0-9]'
$hasAtFile = $prompt -match '@docs[/\\]03-modules[/\\][^/\\\s]+[/\\]DOC-' -or $prompt -match '@docs[/\\]04-platform[/\\]DOC-'

if ($prompt -match '@docs[/\\]?(\s|$)' -or $prompt -match '@docs[/\\]03-modules[/\\]?(\s|$)') {
  Block 'Ban dang @ ca thu muc docs/modules. Hay @ 1 file, vd: @docs/03-modules/{module-id}/DOC-06-srs.md'
}

if ($prompt -match '@docs/02-baseline' -or $prompt -match '@docs/03-modules/_legacy') {
  Block '02-baseline va _legacy ton token. Chi dung khi migrate - @ file MIGRATION.md hoac 1 DOC cu the.'
}

$looksLikeMinipower = $lower -match 'minipower' -or $hasPhase
$looksLikeEdit = $lower -match 'sua|cap nhat|viet|them|sync|dong bo|review|update|write|edit'

if ($looksLikeMinipower -and $looksLikeEdit -and -not $hasAtFile) {
  $hasScopeTarget = $hasModule -or $hasPlatform
  if (-not ($hasPhase -and $hasDoc -and $hasScopeTarget)) {
    Warn 'Thieu scope: them Phase + Module (hoac 04-platform) + DOC-XX, hoac @ 1 file dich. Vi du: Phase: requirements - Module: {module-id}, DOC-06'
  }
}

if ($lower -match 'toan bo|all modules|sync everything|dong bo het|review all') {
  Warn 'Prompt qua rong - tach theo 1 module/DOC moi phien de tiet kiem token.'
}

Allow
