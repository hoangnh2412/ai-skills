# Minipower - beforeSubmitPrompt: token guard — block broad @docs, warn missing scope (Windows / PowerShell)
# SSOT: docs/token-guard.md
# Install: symlink to .cursor/hooks/; runs before check-doc-phase.ps1

$ErrorActionPreference = 'Stop'

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

function Test-BroadDocsPath([string]$Path) {
  if ([string]::IsNullOrWhiteSpace($Path)) { return $false }
  $p = $Path.Replace('\', '/').TrimEnd('/')
  if ($p -match 'DOC-\d{2}-[\w-]+\.md$') { return $false }
  if ($p -match '(?i)(^|/)docs/?$') { return $true }
  if ($p -match '(?i)(^|/)docs/03-modules/?$') { return $true }
  if ($p -match '(?i)@docs/?$') { return $true }
  if ($p -match '(?i)@docs/03-modules/?$') { return $true }
  return $false
}

function Test-BroadDocsInText([string]$Text) {
  if ([string]::IsNullOrWhiteSpace($Text)) { return $false }
  foreach ($m in [regex]::Matches($Text, '@docs[^\s@]*')) {
    if (Test-BroadDocsPath $m.Value) { return $true }
  }
  return $false
}

function Test-HasSpecificDoc([string]$Text, $attachments) {
  if ($Text -match 'DOC-\d{2}(-[\w-]+)?(\.md)?') { return $true }
  if ($null -eq $attachments) { return $false }
  foreach ($att in @($attachments)) {
    $fp = [string]$att.file_path
    if ($fp -match 'DOC-\d{2}-[\w-]+\.md') { return $true }
  }
  return $false
}

$raw = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($raw)) { Allow }

try { $data = $raw | ConvertFrom-Json } catch { Allow }

$prompt = [string]$data.prompt
$attachments = $data.attachments

if (Test-BroadDocsInText $prompt) {
  Block @"
@docs qua rong - chi @ mot file DOC cu the.

Vi du:
Phase: requirements - Module: billing, DOC-06
@docs/03-modules/billing/DOC-06-srs.md

Tranh: @docs/ hoac @docs/03-modules/
"@
}

if ($null -ne $attachments) {
  foreach ($att in @($attachments)) {
    $fp = [string]$att.file_path
    if (Test-BroadDocsPath $fp) {
      Block @"
File attach qua rong: $fp

Chi @ mot file DOC (vd. DOC-06-srs.md), khong @ ca thu muc docs/ hoac 03-modules/.
"@
    }
  }
}

$looksLikeEdit = $prompt -match '(?i)(/minipower|dong bo|sync|cap nhat|sua|update|viet|review|requirements|architecture|discovery)'
if (-not $looksLikeEdit) { Allow }

$hasPhase = $prompt -match '(?i)Phase:\s*(discovery|requirements|architecture|planning|delivery|change-control)'
$hasModule = $prompt -match '(?i)Module:\s*[\w-]+' -or $prompt -match '(?i)04-platform'
$hasDoc = Test-HasSpecificDoc $prompt $attachments

if ($hasPhase -and ($hasModule -or $hasDoc) -and $hasDoc) { Allow }
if (Test-HasSpecificDoc $prompt $attachments) { Allow }

if (-not $hasPhase -or -not $hasModule -or -not $hasDoc) {
  $missing = [System.Collections.Generic.List[string]]::new()
  if (-not $hasPhase) { [void]$missing.Add('Phase: requirements|architecture|...') }
  if (-not $hasModule) { [void]$missing.Add('Module: {module-id} hoac 04-platform') }
  if (-not $hasDoc) { [void]$missing.Add('DOC-06 (hoac @ file DOC cu the)') }
  $list = $missing -join '; '
  Warn "Prompt thieu scope ($list). Them vao prompt de tranh doc/sua lan man."
}

Allow
