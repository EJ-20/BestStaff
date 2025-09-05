<# Stop helper for BestStaff dev:
   - Closes any terminals titled "BestStaff Backend"/"BestStaff Frontend"
   - Leaves Docker DB running by default
   - Pass -down to also stop the docker compose stack
#>
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

param(
  [switch]$down
)

# Close Windows Terminal tabs first (if wt was used)
Get-Process -ErrorAction SilentlyContinue | Where-Object {
  $_.MainWindowTitle -match "BestStaff Backend|BestStaff Frontend"
} | ForEach-Object {
  try { $_.CloseMainWindow() | Out-Null; Start-Sleep -Milliseconds 300; if (!$_.HasExited) { $_.Kill() } } catch {}
}

# Also close any stray PowerShell windows started for these tasks
Get-Process pwsh -ErrorAction SilentlyContinue | Where-Object {
  $_.MainWindowTitle -match "BestStaff Backend|BestStaff Frontend"
} | ForEach-Object {
  try { $_.CloseMainWindow() | Out-Null; Start-Sleep -Milliseconds 300; if (!$_.HasExited) { $_.Kill() } } catch {}
}

if ($down) {
  Write-Host "Stopping docker compose services..." -ForegroundColor Yellow
  Push-Location "$PSScriptRoot/docker"
  docker compose down
  Pop-Location
  Write-Host "Docker services stopped." -ForegroundColor Green
} else {
  Write-Host "Left docker services running. Use 'stop-dev.ps1 -down' to stop them as well." -ForegroundColor Yellow
}
