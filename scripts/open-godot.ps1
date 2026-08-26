[CmdletBinding()]
param(
    [string]$GodotRoot = 'F:\Applications\Godot_v4.7.2-stable_mono_win64',
    [string]$CultLibRoot = 'F:\Projects\CultLib-aetheria-authority'
)

$godot = Join-Path $GodotRoot 'Godot_v4.7.2-stable_mono_win64.exe'
if (-not (Test-Path -LiteralPath $godot)) {
    throw "Godot 4.7.2 Mono was not found at '$godot'."
}

$env:CULTLIB_ROOT = $CultLibRoot
Start-Process -FilePath $godot -ArgumentList @('--editor', '--path', (Join-Path $PSScriptRoot '..\client'))
