# TQCC Website - Setup Script for Windows
# This script automates the installation of all required tools
# Run this in PowerShell as Administrator

# Requires -RunAsAdministrator

# Function to print colored messages
function Write-ColorMessage {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-ColorMessage "========================================" "Blue"
    Write-ColorMessage $Message "Blue"
    Write-ColorMessage "========================================" "Blue"
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-ColorMessage "✓ $Message" "Green"
}

function Write-Error-Message {
    param([string]$Message)
    Write-ColorMessage "✗ $Message" "Red"
}

function Write-Warning-Message {
    param([string]$Message)
    Write-ColorMessage "! $Message" "Yellow"
}

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Error-Message "This script must be run as Administrator"
    Write-ColorMessage "Right-click PowerShell and select 'Run as Administrator'" "Yellow"
    Read-Host "Press Enter to exit"
    exit 1
}

# Welcome message
Clear-Host
Write-Header "TQCC Website Setup"
Write-ColorMessage "This script will install everything you need to work on the TQCC website." "Blue"
Write-Host ""
Write-ColorMessage "This includes:" "Blue"
Write-ColorMessage "  • Chocolatey (Windows package manager)" "Blue"
Write-ColorMessage "  • Node.js (JavaScript runtime)" "Blue"
Write-ColorMessage "  • Visual Studio Code (code editor)" "Blue"
Write-ColorMessage "  • VS Code extensions (Astro, Tailwind, etc.)" "Blue"
Write-ColorMessage "  • Project dependencies" "Blue"
Write-Host ""
Read-Host "Press Enter to continue or Ctrl+C to cancel"

# 1. Install Chocolatey
Write-Header "Step 1: Chocolatey Package Manager"

if (Get-Command choco -ErrorAction SilentlyContinue) {
    Write-Success "Chocolatey is already installed"
} else {
    Write-ColorMessage "Installing Chocolatey..." "Yellow"
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

    Write-Success "Chocolatey installed successfully"
}

# 2. Install Node.js
Write-Header "Step 2: Node.js"

if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Success "Node.js is already installed: $nodeVersion"

    # Check if version is acceptable (v18 or higher)
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -lt 18) {
        Write-Warning-Message "Node.js version is old. Recommend upgrading to v20 or higher."
        $upgrade = Read-Host "Would you like to upgrade Node.js? (y/n)"
        if ($upgrade -eq 'y' -or $upgrade -eq 'Y') {
            choco upgrade nodejs -y
        }
    }
} else {
    Write-ColorMessage "Installing Node.js..." "Yellow"
    choco install nodejs -y

    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

    Write-Success "Node.js installed successfully"
}

# 3. Install Visual Studio Code
Write-Header "Step 3: Visual Studio Code"

if (Get-Command code -ErrorAction SilentlyContinue) {
    Write-Success "Visual Studio Code is already installed"
} else {
    Write-ColorMessage "Installing Visual Studio Code..." "Yellow"
    choco install vscode -y

    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

    Write-Success "Visual Studio Code installed successfully"
    Write-Warning-Message "You may need to restart your terminal for the 'code' command to work"
}

# 4. Install VS Code Extensions
Write-Header "Step 4: VS Code Extensions"

# Wait a moment for VS Code to be available
Start-Sleep -Seconds 2

if (Get-Command code -ErrorAction SilentlyContinue) {
    Write-ColorMessage "Installing VS Code extensions..." "Yellow"

    # List of extensions to install
    $extensions = @(
        "astro-build.astro-vscode",
        "bradlc.vscode-tailwindcss",
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "eamodio.gitlens"
    )

    foreach ($extension in $extensions) {
        $installed = code --list-extensions
        if ($installed -contains $extension) {
            Write-Success "$extension is already installed"
        } else {
            code --install-extension $extension --force
            Write-Success "Installed $extension"
        }
    }
} else {
    Write-Warning-Message "Could not find 'code' command. Please restart PowerShell and run this script again."
    Write-ColorMessage "Or install extensions manually:" "Yellow"
    Write-ColorMessage "  1. Open VS Code" "Yellow"
    Write-ColorMessage "  2. Press Ctrl+Shift+P" "Yellow"
    Write-ColorMessage "  3. Type 'Install Extensions' and select the command" "Yellow"
    Write-ColorMessage "  4. The recommended extensions will appear" "Yellow"
}

# 5. Install Project Dependencies
Write-Header "Step 5: Project Dependencies"

if (Test-Path "package.json") {
    Write-ColorMessage "Installing project dependencies..." "Yellow"
    npm install
    Write-Success "Dependencies installed successfully"
} else {
    Write-Error-Message "package.json not found. Are you in the correct directory?"
    Read-Host "Press Enter to exit"
    exit 1
}

# 6. Final Instructions
Write-Header "Setup Complete!"

Write-Success "All tools have been installed successfully!"
Write-Host ""
Write-ColorMessage "Next Steps:" "Green"
Write-ColorMessage "  1. Open VS Code: code ." "Blue"
Write-ColorMessage "  2. Start the dev server: npm run dev" "Blue"
Write-ColorMessage "  3. Open browser: http://localhost:4321" "Blue"
Write-Host ""
Write-ColorMessage "For more information, see GETTING_STARTED.md" "Yellow"
Write-Host ""
Write-ColorMessage "Happy coding! 🚴‍♀️" "Green"
Write-Host ""

# Ask if user wants to open VS Code now
$openVSCode = Read-Host "Would you like to open VS Code now? (y/n)"
if ($openVSCode -eq 'y' -or $openVSCode -eq 'Y') {
    code .
}

Read-Host "Press Enter to exit"
