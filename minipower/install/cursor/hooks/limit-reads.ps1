# Minipower - beforeReadFile (optional, Windows / PowerShell)
# Install: symlink to .cursor/hooks/ and merge hooks.fragment.windows.json into .cursor/hooks.json
$inputJson = [Console]::In.ReadToEnd()
$data = $inputJson | ConvertFrom-Json
$path = ''
if ($null -ne $data.file_path) { $path = [string]$data.file_path }
elseif ($null -ne $data.path) { $path = [string]$data.path }
$prompt = if ($null -ne $data.prompt) { [string]$data.prompt } else { '' }

function Allow { '{"permission": "allow"}' | Write-Output; exit 0 }
function Deny($msg) {
  @{
    permission = 'deny'
    user_message = $msg
    agent_message = $msg
  } | ConvertTo-Json -Compress | Write-Output
  exit 0
}

if ([string]::IsNullOrWhiteSpace($path)) { Allow }

$normalized = $path -replace '\\', '/'
$allowLegacy = $prompt -match '_legacy|MIGRATION|migrate'

if ($normalized -match 'docs/02-baseline') {
  Deny '02-baseline ton token. Chi doc khi user yeu cau ro migrate hoac baseline.'
}

if (-not $allowLegacy -and $normalized -match 'docs/03-modules/_legacy') {
  Deny '_legacy ton token. Chi doc khi migrate - user can noi _legacy hoac MIGRATION.'
}

Allow
