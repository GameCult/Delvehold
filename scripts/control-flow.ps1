[CmdletBinding()]
param(
    [ValidateSet('validate', 'view')]
    [string]$Command = 'validate',
    [string]$CultLibRoot = 'F:\Projects\CultLib-aetheria-authority'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path $PSScriptRoot -Parent
$NornRoot = Join-Path (Split-Path $repoRoot -Parent) 'Norn'
$viewerRoot = Join-Path $repoRoot 'modeling\control-flow'
$nornViewerRoot = Join-Path $NornRoot 'web\norn-viewer'
$graphSource = Get-Content (Join-Path $viewerRoot 'graph.ts') -Raw
if ($graphSource -notmatch 'nornRevision: "([0-9a-f]{40})"') {
    throw 'The typed graph does not declare one Norn revision.'
}
$expectedNornRevision = $Matches[1]
$git = (Get-Command git -ErrorAction Stop).Source
$npm = (Get-Command npm.cmd -ErrorAction Stop).Source
$node = (Get-Command node -ErrorAction Stop).Source
$env:PATH = (Split-Path $node -Parent) + ';' + $env:PATH
$env:npm_config_script_shell = (Get-Command pwsh -ErrorAction Stop).Source
$env:DELVEHOLD_NORN_ROOT = $NornRoot
$env:DELVEHOLD_CULTLIB_ROOT = $CultLibRoot
$env:DELVEHOLD_GIT = $git

if (-not (Test-Path -LiteralPath (Join-Path $nornViewerRoot 'package.json'))) {
    throw "Norn was not found at '$NornRoot'. Clone GameCult/Norn beside Delvehold."
}
$actualNornRevision = (& $git -C $NornRoot rev-parse HEAD).Trim()
if ($actualNornRevision -ne $expectedNornRevision) {
    throw "Norn must be revision $expectedNornRevision; found $actualNornRevision."
}
$nornStatus = (& $git -C $NornRoot status --porcelain --untracked-files=normal) -join "`n"
if ($nornStatus.Trim()) { throw 'Norn must be clean before Delvehold consumes it.' }

if (-not (Test-Path -LiteralPath (Join-Path $nornViewerRoot 'node_modules\.bin\tsup.cmd'))) {
    & $npm --prefix $nornViewerRoot ci
    if ($LASTEXITCODE -ne 0) { throw 'Norn dependency restore failed.' }
}
Push-Location $nornViewerRoot
try {
    & $node '.\node_modules\tsup\dist\cli-default.js' 'src\index.ts' '--format' 'esm,cjs' '--dts' '--external' 'react' '--external' 'react-dom' '--clean'
    if ($LASTEXITCODE -ne 0) { throw 'Norn library build failed.' }
} finally {
    Pop-Location
}

if (-not (Test-Path -LiteralPath (Join-Path $viewerRoot 'node_modules\.bin\vite.cmd'))) {
    & $npm --prefix $viewerRoot install
    if ($LASTEXITCODE -ne 0) { throw 'Delvehold control-flow viewer dependency restore failed.' }
}
& $npm --prefix $viewerRoot run build
if ($LASTEXITCODE -ne 0) { throw 'Typed control-flow validation or Norn viewer build failed.' }

if ($Command -eq 'validate') { return }

$runRoot = Join-Path $repoRoot 'artifacts\control-flow'
New-Item -ItemType Directory -Path $runRoot -Force | Out-Null
$logPath = Join-Path $runRoot 'norn-viewer.log'
$errorPath = Join-Path $runRoot 'norn-viewer.error.log'
$pidPath = Join-Path $runRoot 'norn-viewer.pid'
$existingPid = if (Test-Path -LiteralPath $pidPath) { [int](Get-Content $pidPath) } else { 0 }
$existing = if ($existingPid -gt 0) { Get-Process -Id $existingPid -ErrorAction SilentlyContinue } else { $null }
if (-not $existing) {
    $process = Start-Process -FilePath $npm -WindowStyle Hidden -PassThru `
        -WorkingDirectory $viewerRoot -ArgumentList @('run', 'dev') `
        -RedirectStandardOutput $logPath -RedirectStandardError $errorPath
    Set-Content -Path $pidPath -Value $process.Id
    $deadline = [DateTime]::UtcNow.AddSeconds(20)
    while ([DateTime]::UtcNow -lt $deadline) {
        if ($process.HasExited) { throw "Norn viewer exited. See '$errorPath'." }
        try {
            $null = Invoke-WebRequest -Uri 'http://127.0.0.1:4176' -UseBasicParsing -TimeoutSec 1
            break
        } catch {
            Start-Sleep -Milliseconds 150
        }
    }
    if ([DateTime]::UtcNow -ge $deadline) { throw "Norn viewer did not become ready. See '$logPath'." }
}

Write-Host "NORN_VIEWER_READY http://127.0.0.1:4176 log=$logPath pid=$(Get-Content $pidPath)"
Start-Process 'http://127.0.0.1:4176'
