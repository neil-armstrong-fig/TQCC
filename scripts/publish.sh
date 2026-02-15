#!/bin/bash

# TQCC Website - Publish Changes Script for macOS and Linux
# This script helps you save and publish your changes to GitHub

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${2}${1}${NC}"
}

print_header() {
    echo ""
    print_message "========================================" "$BLUE"
    print_message "$1" "$BLUE"
    print_message "========================================" "$BLUE"
    echo ""
}

print_success() {
    print_message "✓ $1" "$GREEN"
}

print_error() {
    print_message "✗ $1" "$RED"
}

print_warning() {
    print_message "! $1" "$YELLOW"
}

print_info() {
    print_message "→ $1" "$CYAN"
}

# Welcome message
clear
print_header "Publish Your Changes to GitHub"
print_message "This script will help you save and publish your changes." "$BLUE"
print_message "Don't worry - we'll guide you through each step!" "$BLUE"
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed on your computer"
    print_warning "Please install Git first: https://git-scm.com/downloads"
    exit 1
fi

# Check if we're in a Git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "This folder is not connected to Git"
    print_warning "Please contact the website administrator for help"
    exit 1
fi

# Check Git configuration
print_header "Step 1: Checking Your Identity"

GIT_NAME=$(git config user.name)
GIT_EMAIL=$(git config user.email)

if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
    print_warning "Git needs to know who you are"
    echo ""

    if [ -z "$GIT_NAME" ]; then
        read -p "Enter your full name: " GIT_NAME
        git config --global user.name "$GIT_NAME"
    fi

    if [ -z "$GIT_EMAIL" ]; then
        read -p "Enter your email address: " GIT_EMAIL
        git config --global user.email "$GIT_EMAIL"
    fi

    print_success "Your identity has been set"
else
    print_success "You are: $GIT_NAME <$GIT_EMAIL>"
fi

# Check for changes
print_header "Step 2: Checking for Changes"

# Check if there are any changes
if git diff-index --quiet HEAD -- 2>/dev/null && [ -z "$(git status --porcelain)" ]; then
    print_warning "No changes detected!"
    print_info "You haven't made any changes to publish."
    echo ""
    exit 0
fi

# Show changed files
print_message "Files you've changed:" "$YELLOW"
echo ""
git status --short
echo ""

# Ask for confirmation
print_warning "Review the files above carefully"
read -p "Do these changes look correct? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Publishing cancelled. No changes were saved."
    exit 0
fi

# Get commit message
print_header "Step 3: Describe Your Changes"
print_message "Write a short description of what you changed." "$CYAN"
print_message "Examples:" "$CYAN"
print_info "  'Updated ride schedule for March'"
print_info "  'Added new blog post about safety tips'"
print_info "  'Fixed typo in contact page'"
echo ""

while true; do
    read -p "Description: " COMMIT_MESSAGE

    if [ -z "$COMMIT_MESSAGE" ]; then
        print_error "Please enter a description"
    else
        break
    fi
done

# Add all changes
print_header "Step 4: Saving Your Changes"
print_message "Saving all changes..." "$YELLOW"

git add -A

if [ $? -ne 0 ]; then
    print_error "Failed to save changes"
    exit 1
fi

print_success "Changes saved locally"

# Commit changes
print_message "Creating a save point..." "$YELLOW"

git commit -m "$COMMIT_MESSAGE"

if [ $? -ne 0 ]; then
    print_error "Failed to create save point"
    exit 1
fi

print_success "Save point created"

# Check remote connection
print_header "Step 5: Preparing to Publish"

if ! git remote get-url origin > /dev/null 2>&1; then
    print_error "This repository is not connected to GitHub"
    print_warning "Please contact the website administrator for help"
    exit 1
fi

REMOTE_URL=$(git remote get-url origin)
print_info "Publishing to: $REMOTE_URL"
echo ""

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_info "Publishing from branch: $CURRENT_BRANCH"
echo ""

# Final confirmation
print_warning "This will publish your changes to GitHub for everyone to see"
read -p "Are you ready to publish? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Publishing cancelled"
    print_info "Your changes are saved locally but not published yet"
    print_info "Run this script again when you're ready to publish"
    exit 0
fi

# Push changes
print_header "Step 6: Publishing to GitHub"
print_message "Uploading your changes..." "$YELLOW"

# Try to push
git push origin "$CURRENT_BRANCH" 2>&1 | while IFS= read -r line; do
    echo "$line"
done

# Check if push was successful
if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo ""
    print_error "Failed to publish changes"
    echo ""
    print_warning "Common problems and solutions:"
    print_info "  1. Authentication failed:"
    print_info "     → Make sure you're logged in to GitHub"
    print_info "     → You may need a personal access token"
    echo ""
    print_info "  2. Branch is behind remote:"
    print_info "     → Pull the latest changes first: git pull"
    print_info "     → Then run this script again"
    echo ""
    print_info "  3. No permission to push:"
    print_info "     → Contact the website administrator"
    echo ""
    print_warning "Need help? Contact the TQCC website team"
    exit 1
fi

# Success!
print_header "Success! 🎉"
print_success "Your changes have been published to GitHub!"
echo ""
print_message "What happens next:" "$CYAN"
print_info "  1. Your changes are now on GitHub"
print_info "  2. GitHub Actions will automatically build and deploy the website"
print_info "  3. Your changes will be live in 2-3 minutes"
echo ""
print_message "View your changes on GitHub:" "$GREEN"
print_info "$REMOTE_URL"
echo ""
print_message "Thank you for contributing to the TQCC website! 🚴‍♀️" "$GREEN"
echo ""
