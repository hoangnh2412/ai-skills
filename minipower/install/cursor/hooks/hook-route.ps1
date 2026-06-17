# Minipower — build auto-route prefix and hook JSON output (beforeSubmitPrompt).
# Dot-source: . "$PSScriptRoot/hook-route.ps1"

function Test-PromptContains {
  param([string]$Prompt, [string]$Needle)
  if ([string]::IsNullOrWhiteSpace($Needle)) { return $true }
  return $Prompt -match [regex]::Escape($Needle)
}

function Build-MinipowerRoutePrefix {
  param(
    [string]$Prompt,
    [string]$Phase,
    [string]$SkillPath,
    [string[]]$DocLabels
  )

  $lines = [System.Collections.Generic.List[string]]::new()

  if (-not (Test-PromptContains $Prompt '/minipower')) {
    [void]$lines.Add('/minipower')
  }
  if ($Prompt -notmatch '(?i)Phase:\s*' + [regex]::Escape($Phase)) {
    [void]$lines.Add("Phase: $Phase")
  }
  if (-not (Test-PromptContains $Prompt $SkillPath)) {
    [void]$lines.Add("@$SkillPath")
  }
  foreach ($doc in @($DocLabels)) {
    if ([string]::IsNullOrWhiteSpace($doc)) { continue }
    if ($doc -notmatch '[/\\]DOC-\d{2}') { continue }
    $docNorm = $doc.Replace('\', '/')
    if (-not (Test-PromptContains $Prompt $docNorm)) {
      [void]$lines.Add("@$docNorm")
    }
  }

  if ($lines.Count -eq 0) { return '' }
  return ($lines -join [Environment]::NewLine)
}

function Build-MinipowerEnrichedPrompt {
  param(
    [string]$OriginalPrompt,
    [string]$Prefix
  )
  if ([string]::IsNullOrWhiteSpace($Prefix)) { return $OriginalPrompt }
  if ([string]::IsNullOrWhiteSpace($OriginalPrompt)) { return $Prefix }
  return ($Prefix + [Environment]::NewLine + [Environment]::NewLine + $OriginalPrompt)
}

function Write-MinipowerHookContinue {
  param(
    [string]$OriginalPrompt,
    [string]$EnrichedPrompt,
    [string]$Phase,
    [string]$SkillPath,
    [string]$InfoMessage = ''
  )

  if (-not [string]::IsNullOrWhiteSpace($InfoMessage)) {
    [Console]::Error.WriteLine("[INFO] Minipower auto-routing: $InfoMessage")
  }

  $context = @(
    "Minipower auto-route (DOC -> phase)."
    "Phase: $Phase"
    "Skill: @$SkillPath"
    "Follow minipower-token-guard: one slice, read skill con for this phase only."
  ) -join ' '

  $payload = [ordered]@{
    continue            = $true
    updated_input       = @{ prompt = $EnrichedPrompt }
    additional_context  = $context
    hookSpecificOutput  = @{
      hookEventName      = 'UserPromptSubmit'
      additionalContext  = $context
      updatedInput       = @{ prompt = $EnrichedPrompt }
    }
  }

  $payload | ConvertTo-Json -Compress -Depth 6 | Write-Output
  exit 0
}
