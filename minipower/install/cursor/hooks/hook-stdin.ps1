# Minipower — hook stdin/stdout (UTF-8, no BOM) for Cursor hooks on Windows PowerShell 5.1+.
# Dot-source: . "$PSScriptRoot/hook-stdin.ps1"

function Initialize-MinipowerHookIo {
  $utf8 = New-Object System.Text.UTF8Encoding $false
  [Console]::InputEncoding = $utf8
  [Console]::OutputEncoding = $utf8
  $global:OutputEncoding = $utf8
}

function Write-MinipowerHookRaw {
  param([string]$Text)
  if ($null -eq $Text) { $Text = '' }
  $utf8 = New-Object System.Text.UTF8Encoding $false
  $bytes = $utf8.GetBytes($Text)
  $stdout = [Console]::OpenStandardOutput()
  $stdout.Write($bytes, 0, $bytes.Length)
  $stdout.Flush()
}

function Write-MinipowerHookJson {
  param(
    $Payload,
    [int]$Depth = 6
  )
  $json = $Payload | ConvertTo-Json -Compress -Depth $Depth
  Write-MinipowerHookRaw $json
}

function Read-MinipowerHookStdin {
  $stdin = [Console]::OpenStandardInput()
  $utf8 = New-Object System.Text.UTF8Encoding $false
  $reader = New-Object System.IO.StreamReader($stdin, $utf8, $true)
  try {
    $raw = $reader.ReadToEnd()
  } finally {
    $reader.Close()
  }
  if ($raw.Length -gt 0 -and [int][char]$raw[0] -eq 0xFEFF) {
    $raw = $raw.Substring(1)
  }
  return $raw.Trim()
}

function ConvertFrom-MinipowerHookJson {
  param([string]$Raw)
  if ([string]::IsNullOrWhiteSpace($Raw)) { return $null }
  try {
    return ($Raw | ConvertFrom-Json)
  } catch {
    [Console]::Error.WriteLine("[WARN] Minipower hook JSON parse: $_")
    return $null
  }
}

function Get-HookPromptFromRaw {
  param([string]$Raw)
  if ([string]::IsNullOrWhiteSpace($Raw)) { return '' }
  if ($Raw -match '"prompt"\s*:\s*"(?<p>(?:\\.|[^"\\])*)"') {
    return [regex]::Unescape($Matches['p'])
  }
  return ''
}

Initialize-MinipowerHookIo
