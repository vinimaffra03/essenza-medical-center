# Start Ralph for WorkNow
$env:PATH += ";C:\Users\joaop\.local\bin;C:\Users\joaop\AppData\Local\Microsoft\WinGet\Packages\jqlang.jq_Microsoft.Winget.Source_8wekyb3d8bbwe"

Write-Host "Starting Ralph for WorkNow..." -ForegroundColor Cyan
Write-Host ""

# Run Ralph with bash
& bash -c "cd /c/Dev/WorkNow && ralph --verbose"
