$ErrorActionPreference = "Stop"

Write-Host "Locating Git..."
$GitPath = "git"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    $PossiblePaths = @(
        "C:\Program Files\Git\cmd\git.exe",
        "C:\Program Files\Git\bin\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
    )
    
    foreach ($path in $PossiblePaths) {
        if (Test-Path $path) {
            $GitPath = $path
            Write-Host "Found Git at $GitPath"
            break
        }
    }
    
    if ($GitPath -eq "git") {
        Write-Error "Git is not found in PATH or standard locations. Please restart your terminal if you just installed it."
    }
}

# Function to run git commands
function Run-Git {
    param([string]$Arguments)
    $ProcessInfo = New-Object System.Diagnostics.ProcessStartInfo
    $ProcessInfo.FileName = $GitPath
    $ProcessInfo.Arguments = $Arguments
    $ProcessInfo.RedirectStandardOutput = $true
    $ProcessInfo.RedirectStandardError = $true
    $ProcessInfo.UseShellExecute = $false
    $ProcessInfo.CreateNoWindow = $true
    
    $Process = New-Object System.Diagnostics.Process
    $Process.StartInfo = $ProcessInfo
    $Process.Start() | Out-Null
    $Process.WaitForExit()
    
    $Output = $Process.StandardOutput.ReadToEnd()
    $Error = $Process.StandardError.ReadToEnd()
    
    if ($Output) { Write-Host $Output }
    if ($Error) { Write-Host $Error }
}

Write-Host "Initializing Git repository..."
if (-not (Test-Path .git)) {
    & $GitPath init
}

Write-Host "Adding files..."
& $GitPath add .

Write-Host "Configuring generic git user (local)..."
& $GitPath config user.email "srivi@example.com"
& $GitPath config user.name "Srivi"

Write-Host "Committing..."
& $GitPath commit -m "Initial commit - ISP Site Survey Tool"

Write-Host "Renaming branch to main..."
& $GitPath branch -M main

Write-Host "Adding remote origin..."
$RemoteUrl = "https://github.com/sri111105/SITE_SERVER_PROJECT"
# Check if remote exists
$Remotes = & $GitPath remote
if ($Remotes -match "origin") {
    & $GitPath remote set-url origin $RemoteUrl
}
else {
    & $GitPath remote add origin $RemoteUrl
}

Write-Host "Pushing to GitHub..."
Write-Host "NOTE: A browser window or credential prompt may appear to sign in to GitHub."
& $GitPath push -u origin main
