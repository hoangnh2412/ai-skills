# Minipower - beforeSubmitPrompt: DOC file -> phase, block on conflict (Windows / PowerShell)
# SSOT map: agents/auto-routing.md
# Install: symlink to .cursor/hooks/; merge hooks.fragment.windows.json into .cursor/hooks.json
# Runs after check-prompt-scope.ps1 in the same event chain.

$ErrorActionPreference = 'Stop'

function Allow { '{"continue": true}' | Write-Output; exit 0 }
function Warn($msg) {
  [Console]::Error.WriteLine("[WARN] Minipower auto-routing: $msg")
  '{"continue": true}' | Write-Output
  exit 0
}
function Block($msg) {
  [Console]::Error.WriteLine("[BLOCK] $msg")
  @{ continue = $false; user_message = $msg } | ConvertTo-Json -Compress | Write-Output
  exit 2
}

function Get-PhaseForDoc([string]$DocNum) {
  switch ($DocNum) {
    '01' { return 'discovery' }
    '02' { return 'discovery' }
    '03' { return 'discovery' }
    '04' { return 'requirements' }
    '05' { return 'requirements' }
    '06' { return 'requirements' }
    '07' { return 'requirements' }
    '08' { return 'architecture' }
    '09' { return 'architecture' }
    '10' { return 'architecture' }
    '11' { return 'architecture' }
    '12' { return 'architecture' }
    '13' { return 'requirements' }
    '14' { return 'planning' }
    '15' { return 'planning' }
    '16' { return 'delivery' }
    '17' { return 'delivery' }
    '18' { return 'change-control' }
    default { return $null }
  }
}

function Get-PhaseLabel([string]$Phase) {
  switch ($Phase) {
    'discovery'       { return 'discovery (DOC-01-03)' }
    'requirements'    { return 'requirements (DOC-04-07, 13)' }
    'architecture'    { return 'architecture (DOC-08-12)' }
    'planning'        { return 'planning (DOC-14-15)' }
    'delivery'        { return 'delivery (DOC-16-17)' }
    'change-control'  { return 'change-control (DOC-18)' }
    default           { return $Phase }
  }
}

function Get-SkillRelPath([string]$Phase) {
  $root = if ($env:MINIPOWER_ROOT) { $env:MINIPOWER_ROOT.TrimEnd('\', '/') } else { 'ai-skills/minipower' }
  switch ($Phase) {
    'discovery'       { return "$root/skills/discovery/SKILL.md" }
    'requirements'    { return "$root/skills/requirements/SKILL.md" }
    'architecture'    { return "$root/skills/architecture/SKILL.md" }
    'planning'        { return "$root/skills/planning/SKILL.md" }
    'delivery'        { return "$root/skills/delivery/SKILL.md" }
    'change-control'  { return "$root/skills/change-control/SKILL.md" }
    default           { return "$root/SKILL.md" }
  }
}

function Add-DocRef([hashtable]$Map, [System.Collections.Generic.HashSet[string]]$Seen, [string]$DocNum, [string]$Label) {
  if ([string]::IsNullOrWhiteSpace($DocNum) -or [string]::IsNullOrWhiteSpace($Label)) { return }
  if ($Seen.Contains($DocNum)) { return }
  $phase = Get-PhaseForDoc $DocNum
  if (-not $phase) { return }
  if (-not $Map.ContainsKey($phase)) {
    $Map[$phase] = [System.Collections.Generic.List[string]]::new()
  }
  [void]$Seen.Add($DocNum)
  [void]$Map[$phase].Add($Label)
}

function Add-DocEntry([hashtable]$Map, [System.Collections.Generic.HashSet[string]]$Seen, [string]$Path) {
  if ([string]::IsNullOrWhiteSpace($Path)) { return }
  $name = [System.IO.Path]::GetFileName($Path)
  if ($name -notmatch 'DOC-(\d{2})') { return }
  Add-DocRef -Map $Map -Seen $Seen -DocNum $Matches[1] -Label $Path
}

$raw = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($raw)) { Allow }

try { $data = $raw | ConvertFrom-Json } catch { Allow }

$prompt = [string]$data.prompt
$byPhase = @{}
$seenDocs = [System.Collections.Generic.HashSet[string]]::new()

if ($null -ne $data.attachments) {
  foreach ($att in @($data.attachments)) {
    Add-DocEntry -Map $byPhase -Seen $seenDocs -Path ([string]$att.file_path)
  }
}

foreach ($m in [regex]::Matches($prompt, 'DOC-(\d{2})-[\w-]+\.md')) {
  Add-DocEntry -Map $byPhase -Seen $seenDocs -Path $m.Value
}

foreach ($m in [regex]::Matches($prompt, 'DOC-(\d{2})(?![-\w])')) {
  Add-DocRef -Map $byPhase -Seen $seenDocs -DocNum $m.Groups[1].Value -Label ("DOC-{0}" -f $m.Groups[1].Value)
}

if ($byPhase.Count -eq 0) { Allow }

$explicitPhase = $null
if ($prompt -match '(?i)Phase:\s*(discovery|requirements|architecture|planning|delivery|change-control)') {
  $explicitPhase = $Matches[1].ToLowerInvariant()
}

if ($byPhase.Count -eq 1) {
  $detected = ($byPhase.Keys | Select-Object -First 1)
  $files = $byPhase[$detected] -join ', '
  $label = Get-PhaseLabel $detected

  if ($explicitPhase -and $explicitPhase -ne $detected) {
    Block @"
Phase conflict: prompt co Phase: $explicitPhase nhung file DOC thuoc $label.

File: $files

Sua prompt thanh:
Phase: $detected
/minipower
@<file DOC>

Hoac bo dong Phase: va chi tag file thuoc phase $explicitPhase.
"@
  }

  if (-not $explicitPhase) {
    $skill = Get-SkillRelPath $detected
    Warn "Phat hien phase: $detected. Them vao prompt: Phase: $detected (+ /minipower, @$skill neu can)."
  }

  Allow
}

$lines = [System.Collections.Generic.List[string]]::new()
[void]$lines.Add('Conflict phase - cac file DOC ban tag thuoc nhieu phase khac nhau.')
[void]$lines.Add('')

foreach ($phase in ($byPhase.Keys | Sort-Object)) {
  [void]$lines.Add("- $(Get-PhaseLabel $phase):")
  foreach ($f in $byPhase[$phase]) { [void]$lines.Add("    $f") }
  [void]$lines.Add('')
}

[void]$lines.Add('Goi y - tach thanh tung prompt (moi prompt 1 phase):')
[void]$lines.Add('')

$idx = 1
foreach ($phase in ($byPhase.Keys | Sort-Object)) {
  $sample = $byPhase[$phase][0]
  $skill = Get-SkillRelPath $phase
  [void]$lines.Add("$idx) Phase: $phase")
  [void]$lines.Add('   /minipower')
  [void]$lines.Add("   @$sample")
  [void]$lines.Add("   @$skill")
  [void]$lines.Add('   <mo ta task cho phase nay>')
  [void]$lines.Add('')
  $idx++
}

if ($explicitPhase) {
  [void]$lines.Add("Luu y: prompt hien co Phase: $explicitPhase - chi giu file thuoc phase do, bo tag file phase khac.")
}

Block ($lines -join [Environment]::NewLine)
