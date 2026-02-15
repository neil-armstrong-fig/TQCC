# TQCC Website - Publish Changes Script for Windows
# This script helps you save and publish your changes to GitHub

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

function Write-Info {
    param([string]$Message)
    Write-ColorMessage "→ $Message" "Cyan"
}

# Welcome message
Clear-Host
Write-Header "Publish Your Changes to GitHub"
Write-ColorMessage "This script will help you save and publish your changes." "Blue"
Write-ColorMessage "Don't worry - we'll guide you through each step!" "Blue"
Write-Host ""

# Check if Git is installed
try {
    $null = git --version 2>$null
} catch {
    Write-Error-Message "Git is not installed on your computer"
    Write-Warning-Message "Please install Git first: https://git-scm.com/downloads"
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if we're in a Git repository
try {
    $null = git rev-parse --git-dir 2>$null
} catch {
    Write-Error-Message "This folder is not connected to Git"
    Write-Warning-Message "Please contact the website administrator for help"
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Git configuration
Write-Header "Step 1: Checking Your Identity"

$gitName = git config user.name
$gitEmail = git config user.email

if ([string]::IsNullOrWhiteSpace($gitName) -or [string]::IsNullOrWhiteSpace($gitEmail)) {
    Write-Warning-Message "Git needs to know who you are"
    Write-Host ""

    if ([string]::IsNullOrWhiteSpace($gitName)) {
        $gitName = Read-Host "Enter your full name"
        git config --global user.name "$gitName"
    }

    if ([string]::IsNullOrWhiteSpace($gitEmail)) {
        $gitEmail = Read-Host "Enter your email address"
        git config --global user.email "$gitEmail"
    }

    Write-Success "Your identity has been set"
} else {
    Write-Success "You are: $gitName <$gitEmail>"
}

# Check for changes
Write-Header "Step 2: Checking for Changes"

$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Warning-Message "No changes detected!"
    Write-Info "You haven't made any changes to publish."
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 0
}

# Show changed files
Write-ColorMessage "Files you've changed:" "Yellow"
Write-Host ""
git status --short
Write-Host ""

# Ask for confirmation
Write-Warning-Message "Review the files above carefully"
$confirm = Read-Host "Do these changes look correct? (y/n)"

if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Warning-Message "Publishing cancelled. No changes were saved."
    Read-Host "Press Enter to exit"
    exit 0
}

# Get commit message
Write-Header "Step 3: Describe Your Changes"
Write-ColorMessage "Write a short description of what you changed." "Cyan"
Write-ColorMessage "Examples:" "Cyan"
Write-Info "  'Updated ride schedule for March'"
Write-Info "  'Added new blog post about safety tips'"
Write-Info "  'Fixed typo in contact page'"
Write-Host ""

do {
    $commitMessage = Read-Host "Description"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        Write-Error-Message "Please enter a description"
    }
} while ([string]::IsNullOrWhiteSpace($commitMessage))

# Add all changes
Write-Header "Step 4: Saving Your Changes"
Write-ColorMessage "Saving all changes..." "Yellow"

git add -A

if ($LASTEXITCODE -ne 0) {
    Write-Error-Message "Failed to save changes"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Success "Changes saved locally"

# Commit changes
Write-ColorMessage "Creating a save point..." "Yellow"

git commit -m "$commitMessage"

if ($LASTEXITCODE -ne 0) {
    Write-Error-Message "Failed to create save point"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Success "Save point created"

# Check remote connection
Write-Header "Step 5: Preparing to Publish"

try {
    $remoteUrl = git remote get-url origin 2>$null
    if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
        throw "No remote URL"
    }
} catch {
    Write-Error-Message "This repository is not connected to GitHub"
    Write-Warning-Message "Please contact the website administrator for help"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Info "Publishing to: $remoteUrl"
Write-Host ""

# Get current branch
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Info "Publishing from branch: $currentBranch"
Write-Host ""

# Final confirmation
Write-Warning-Message "This will publish your changes to GitHub for everyone to see"
$finalConfirm = Read-Host "Are you ready to publish? (y/n)"

if ($finalConfirm -ne 'y' -and $finalConfirm -ne 'Y') {
    Write-Warning-Message "Publishing cancelled"
    Write-Info "Your changes are saved locally but not published yet"
    Write-Info "Run this script again when you're ready to publish"
    Read-Host "Press Enter to exit"
    exit 0
}

# Push changes
Write-Header "Step 6: Publishing to GitHub"
Write-ColorMessage "Uploading your changes..." "Yellow"

# Try to push
git push origin $currentBranch 2>&1 | ForEach-Object { Write-Host $_ }

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Error-Message "Failed to publish changes"
    Write-Host ""
    Write-Warning-Message "Common problems and solutions:"
    Write-Info "  1. Authentication failed:"
    Write-Info "     → Make sure you're logged in to GitHub"
    Write-Info "     → You may need a personal access token"
    Write-Host ""
    Write-Info "  2. Branch is behind remote:"
    Write-Info "     → Pull the latest changes first: git pull"
    Write-Info "     → Then run this script again"
    Write-Host ""
    Write-Info "  3. No permission to push:"
    Write-Info "     → Contact the website administrator"
    Write-Host ""
    Write-Warning-Message "Need help? Contact the TQCC website team"
    Read-Host "Press Enter to exit"
    exit 1
}

# Success!
Write-Header "Success! 🎉"
Write-Success "Your changes have been published to GitHub!"
Write-Host ""
Write-ColorMessage "What happens next:" "Cyan"
Write-Info "  1. Your changes are now on GitHub"
Write-Info "  2. GitHub Actions will automatically build and deploy the website"
Write-Info "  3. Your changes will be live in 2-3 minutes"
Write-Host ""
Write-ColorMessage "View your changes on GitHub:" "Green"
Write-Info "$remoteUrl"
Write-Host ""
Write-ColorMessage "Thank you for contributing to the TQCC website! 🚴‍♀️" "Green"
Write-Host ""

Read-Host "Press Enter to exit"
