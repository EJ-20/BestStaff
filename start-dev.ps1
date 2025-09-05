Set-ExecutionPolicy -Scope CurrentUser RemoteSigned


$ErrorActionPreference = "Stop"

# --- Helpers ---
function Resolve-RepoRoot {
  Split-Path -Parent $PSCommandPath
}

function Require-Cmd($name, $test) {
  if (-not (& $test)) {
    throw "Required command '$name' not found or not working. Please install/configure it."
  }
}

function Test-CmdExists($cmd) {
  $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)
}

function Wait-Port($host, $port, $timeoutSec = 60) {
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $timeoutSec) {
    try {
      $client = New-Object System.Net.Sockets.TcpClient
      $ar = $client.BeginConnect($host, $port, $null, $null)
      $ok = $ar.AsyncWaitHandle.WaitOne(750)
      if ($ok -and $client.Connected) { $client.Close(); return $true }
      $client.Close()
    } catch { }
    Start-Sleep -Milliseconds 500
  }
  return $false
}

function Start-Term($title, $command, $workdir) {
  # Use Windows Terminal (wt) if available; else fallback to PowerShell
  if (Test-CmdExists "wt.exe") {
    Start-Process wt.exe -ArgumentList @(
      "-w","0","nt","--title",$title,"pwsh","-NoExit","-Command",$command
    ) -WorkingDirectory $workdir
  } else {
    Start-Process pwsh -ArgumentList @("-NoExit","-Command",$command) -WorkingDirectory $workdir -WindowStyle Normal
  }
}

# --- Preconditions ---
$root = Resolve-RepoRoot
Set-Location $root

Require-Cmd "docker"     { Test-CmdExists "docker" }
Require-Cmd "npm"        { Test-CmdExists "npm" }
Require-Cmd "mvn"        { Test-CmdExists "mvn" }

# --- Docker: DB + Adminer ---
Write-Host "▶ Starting Docker services..." -ForegroundColor Cyan
Push-Location "$root/docker"
docker compose up -d
Pop-Location

# Optional: verify DB port (default 5432; change if you mapped differently)
$pgPort = 5432   # update if your compose maps another port
if (-not (Wait-Port "127.0.0.1" $pgPort 30)) {
  Write-Warning "Postgres didn't become reachable on port $pgPort within timeout. Continuing anyway…"
}

# --- Backend ---
Write-Host "▶ Launching Spring Boot (backend)..." -ForegroundColor Cyan
$backendCmd = "cd '$root/backend'; mvn spring-boot:run"
Start-Term "BestStaff Backend" $backendCmd $root

# Wait for backend to start (default 8080)
if (Wait-Port "127.0.0.1" 8080 120) {
  Write-Host "✔ Backend is up on http://localhost:8080" -ForegroundColor Green
} else {
  Write-Warning "Backend did not open port 8080 within timeout."
}

# --- Frontend ---
Write-Host "▶ Launching Vite (frontend)..." -ForegroundColor Cyan
$frontendCmd = "cd '$root/frontend'; npm run dev"
Start-Term "BestStaff Frontend" $frontendCmd $root

# Vite default port is 5173
if (Wait-Port "127.0.0.1" 5173 60)) {
  Write-Host "✔ Frontend is up on http://localhost:5173" -ForegroundColor Green
  Start-Process "http://localhost:5173"
} else {
  Write-Warning "Frontend did not open port 5173 within timeout."
}

Write-Host "`nAll set! Logs are in the two opened terminals." -ForegroundColor Green
