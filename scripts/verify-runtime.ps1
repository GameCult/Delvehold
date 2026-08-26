[CmdletBinding()]
param(
    [string]$CultLibRoot = 'F:\Projects\CultLib-aetheria-authority',
    [string]$GodotRoot = 'F:\Applications\Godot_v4.7.2-stable_mono_win64'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path $PSScriptRoot -Parent
$godot = Join-Path $GodotRoot 'Godot_v4.7.2-stable_mono_win64_console.exe'
if (-not (Test-Path -LiteralPath $godot)) {
    throw "Godot 4.7.2 Mono console was not found at '$godot'."
}

& (Join-Path $PSScriptRoot 'control-flow.ps1') validate -CultLibRoot $CultLibRoot
if ($LASTEXITCODE -ne 0) { throw 'The typed control-flow map is stale or invalid.' }

dotnet build (Join-Path $repoRoot 'Delvehold.sln') -p:CultLibRoot=$CultLibRoot
if ($LASTEXITCODE -ne 0) { throw 'The focused .NET/Godot build failed.' }

$smokeRoot = Join-Path $repoRoot ('artifacts\runtime-smoke\' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $smokeRoot -Force | Out-Null
$statePath = Join-Path $smokeRoot 'world.cc'
$port = Get-Random -Minimum 41000 -Maximum 49000
$endpoint = "cultnet+tcp://127.0.0.1:$port"
$smokeId = 'runtime-smoke-enter-v0'
$clientId = 'delvehold.godot.smoke'
$hostProject = Join-Path $repoRoot 'src\Delvehold.WorldHost\Delvehold.WorldHost.csproj'
$clientProject = Join-Path $repoRoot 'client'

function Start-WorldHost([string]$suffix) {
    $stdout = Join-Path $smokeRoot "host-$suffix.out.log"
    $stderr = Join-Path $smokeRoot "host-$suffix.err.log"
    $process = Start-Process -FilePath 'dotnet' -PassThru -WindowStyle Hidden `
        -RedirectStandardOutput $stdout -RedirectStandardError $stderr `
        -ArgumentList @('run', '--no-build', '--project', $hostProject, '-p:CultLibRoot=' + $CultLibRoot, '--', '--state', $statePath, '--port', $port)
    $deadline = [DateTime]::UtcNow.AddSeconds(20)
    while ([DateTime]::UtcNow -lt $deadline) {
        if ($process.HasExited) {
            throw "World host exited before readiness. See '$stderr'."
        }
        if ((Test-Path -LiteralPath $stdout) -and (Select-String -Path $stdout -Pattern 'DELVEHOLD_HOST_READY' -Quiet)) {
            return $process
        }
        Start-Sleep -Milliseconds 100
    }
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    throw "World host did not become ready. See '$stdout' and '$stderr'."
}

function Invoke-GodotSmoke([string]$suffix, [string]$projection, [string]$expectedStatus, [string]$intentId = $smokeId) {
    $log = Join-Path $smokeRoot "godot-$suffix.log"
    & $godot --headless --path $clientProject --editor --quit-after 1 2>&1 | Set-Content -Path $log
    if ($LASTEXITCODE -ne 0) { throw "Godot import/build failed. See '$log'." }
    $runtimeOutput = & $godot --headless --path $clientProject -- --endpoint $endpoint --client-id $clientId --smoke-id $intentId --projection $projection --expect-status $expectedStatus 2>&1
    $runtimeOutput | Tee-Object -FilePath $log -Append | Write-Host
    if ($LASTEXITCODE -ne 0) { throw "Godot runtime smoke failed. See '$log'." }
    if (-not (Select-String -Path $log -Pattern "DELVEHOLD_SMOKE PASS $expectedStatus $intentId" -Quiet)) {
        throw "Godot did not report the expected '$expectedStatus' typed receipt. See '$log'."
    }
    return (Select-String -Path $log -Pattern "DELVEHOLD_SMOKE PASS $expectedStatus $intentId" | Select-Object -Last 1).Line
}

$forbiddenClientWriters = Select-String -Path (Join-Path $repoRoot 'client\*.cs') `
    -Pattern 'CultMesh\.CreateNodeAsync|\.Database\.PutAsync|\.Cache\.UpsertAsync'
if ($forbiddenClientWriters) {
    throw 'The Godot client contains a canonical CultCache/CultMesh write path.'
}

$hostProcess = $null
try {
    $hostProcess = Start-WorldHost 'first'
    $firstReceipt = Invoke-GodotSmoke 'first' 'hold' 'accepted'
    $null = Invoke-GodotSmoke 'collision' 'delve' 'rejected'
    $null = Invoke-GodotSmoke 'invalid-projection' 'banana' 'rejected' 'runtime-smoke-invalid-v0'
    Stop-Process -Id $hostProcess.Id -Force
    $hostProcess.WaitForExit()
    $hostProcess = Start-WorldHost 'restart'
    $restartReceipt = Invoke-GodotSmoke 'restart' 'hold' 'accepted'
}
finally {
    if ($null -ne $hostProcess -and -not $hostProcess.HasExited) {
        Stop-Process -Id $hostProcess.Id -Force -ErrorAction SilentlyContinue
    }
}

if (-not (Test-Path -LiteralPath $statePath)) {
    throw 'The host did not persist its CultCache state.'
}
if ($firstReceipt -ne $restartReceipt) {
    throw "The restarted host did not return the original persisted receipt.`nFirst: $firstReceipt`nRestart: $restartReceipt"
}

Write-Host "DELVEHOLD_RUNTIME_VERIFIED state=$statePath receipt=$smokeId"
