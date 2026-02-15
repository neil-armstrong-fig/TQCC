# Getting Started with TQCC Website Development

This guide will help you set up everything you need to make changes to the TQCC website, even if you're not familiar with coding.

## What You'll Need

- A computer (macOS or Windows)
- Internet connection
- About 15-30 minutes for initial setup

## Quick Setup (Recommended)

We've created automatic setup scripts that will install everything for you.

### For macOS Users

1. **Download this project** (if you haven't already)
   - Ask the project admin for access to the GitHub repository
   - Download as ZIP or use `git clone` if you know how

2. **Open Terminal**
   - Press `Cmd + Space` and type "Terminal", then press Enter

3. **Navigate to the project folder**
   ```bash
   cd path/to/tqcc-website
   ```

4. **Run the setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

5. **Follow the prompts** - the script will:
   - Install Homebrew (if needed)
   - Install Node.js
   - Install Visual Studio Code
   - Install all VS Code extensions
   - Install project dependencies

### For Windows Users

1. **Download this project** (if you haven't already)
   - Ask the project admin for access to the GitHub repository
   - Download as ZIP and extract it

2. **Open PowerShell as Administrator**
   - Press `Win + X` and select "Windows PowerShell (Admin)" or "Terminal (Admin)"

3. **Navigate to the project folder**
   ```powershell
   cd C:\path\to\tqcc-website
   ```

4. **Run the setup script**
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\scripts\setup.ps1
   ```

5. **Follow the prompts** - the script will:
   - Install Chocolatey (if needed)
   - Install Node.js
   - Install Visual Studio Code
   - Install all VS Code extensions
   - Install project dependencies

## Manual Setup (Alternative)

If the automatic script doesn't work, follow these steps:

### Step 1: Install Visual Studio Code

1. Go to [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Download for your operating system
3. Install following the prompts
4. Open Visual Studio Code

### Step 2: Install Node.js

1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (Long Term Support)
3. Run the installer and follow the prompts
4. Verify installation:
   - Open Terminal (macOS) or Command Prompt (Windows)
   - Type: `node --version`
   - You should see a version number like `v20.x.x`

### Step 3: Install VS Code Extensions

Open Visual Studio Code, then:

1. Click the Extensions icon (four squares) in the left sidebar, or press `Ctrl+Shift+X` (Windows) / `Cmd+Shift+X` (macOS)
2. Search for and install each of these:
   - **Astro** (by Astro)
   - **Tailwind CSS IntelliSense** (by Tailwind Labs)
   - **Prettier - Code formatter** (by Prettier)
   - **ESLint** (by Microsoft)
   - **GitLens** (by GitKraken) - optional but helpful

### Step 4: Install Project Dependencies

1. Open Visual Studio Code
2. Click **File → Open Folder** and select the `tqcc-website` folder
3. Open the integrated terminal: **View → Terminal** or press `` Ctrl+` ``
4. Type: `npm install` and press Enter
5. Wait for it to finish (may take a few minutes)

## Running the Website Locally

Once setup is complete:

1. **Open the project in VS Code**
   - File → Open Folder → select `tqcc-website`

2. **Start the development server**
   - Open Terminal in VS Code (View → Terminal or `` Ctrl+` ``)
   - Type: `npm run dev`
   - Press Enter

3. **View the website**
   - Open your browser and go to: [http://localhost:4321](http://localhost:4321)
   - The website will automatically refresh when you make changes!

4. **Stop the server**
   - Press `Ctrl+C` in the terminal when done

## Making Content Changes

### Using Sveltia CMS (Easiest)

1. **Start the development server** (see above)
2. **Go to** [http://localhost:4321/admin](http://localhost:4321/admin)
3. **Log in with GitHub** (you'll need editor access)
4. **Edit content** using the visual editor:
   - Blog posts
   - Events
   - Weekly ride schedules
5. **Save and publish** your changes

### Editing Files Directly

Content is stored in markdown files in the `src/content/` folder:

- **Blog posts**: `src/content/posts/`
- **Events**: `src/content/events/`
- **Ride schedules**: `src/content/rides/`

To edit:
1. Open the file in VS Code
2. Make your changes
3. Save the file (`Ctrl+S` / `Cmd+S`)
4. Check the preview in your browser

## Publishing Your Changes

Once you've made changes to the website, you need to publish them so everyone can see them. We've made this super easy with a publish script!

### Quick Publish (Easiest Way)

#### For macOS Users

1. **Open Terminal** in VS Code (View → Terminal or `` Ctrl+` ``)
2. **Run the publish script:**
   ```bash
   ./scripts/publish.sh
   ```
3. **Follow the prompts** - the script will:
   - Show you what files changed
   - Ask you to describe your changes
   - Save and upload your changes to GitHub
   - Automatically trigger the website to update

#### For Windows Users

1. **Open Terminal** in VS Code (View → Terminal or `` Ctrl+` ``)
2. **Run the publish script:**
   ```powershell
   .\scripts\publish.ps1
   ```
3. **Follow the prompts** - the script will:
   - Show you what files changed
   - Ask you to describe your changes
   - Save and upload your changes to GitHub
   - Automatically trigger the website to update

### What Happens When You Publish?

1. **Your changes are saved** to your local computer
2. **Changes are uploaded** to GitHub (the project's cloud storage)
3. **GitHub Actions automatically builds and deploys** the new website
4. **Your changes go live** in about 2-3 minutes!

### Important Notes

- **Review your changes** before publishing - the script will show you what's changed
- **Write clear descriptions** - explain what you changed in simple terms
- **Wait for confirmation** - you'll see a success message when it's done
- **Check the live site** - visit the website after a few minutes to see your changes

### Manual Git Commands (Advanced)

If you're comfortable with Git, you can also use these commands:

```bash
# See what changed
git status

# Save your changes
git add -A
git commit -m "Your description here"

# Publish to GitHub
git push
```

But for most users, the publish script is much easier!

## Common Tasks

### Adding a New Blog Post

**Option 1: Using CMS**
1. Go to `/admin`
2. Click "Blog Posts" → "New Post"
3. Fill in the details
4. Click "Save"

**Option 2: Manual**
1. Create a new `.md` file in `src/content/posts/`
2. Copy the structure from an existing post
3. Fill in your content

### Adding a New Event

**Option 1: Using CMS**
1. Go to `/admin`
2. Click "Events" → "New Event"
3. Fill in the details (remember: use miles, not km!)
4. Click "Save"

**Option 2: Manual**
1. Create a new `.md` file in `src/content/events/`
2. Follow the existing event structure

### Updating Colors or Styles

Global styles are in `src/styles/global.css`. The brand colors are:
- Yellow: `#FFD700` (tqcc-yellow)
- Black: `#1A1A1A` (tqcc-black)
- Pink: `#E91E8C` (tqcc-pink)

## Getting Help

### Common Issues

**"Command not found"**
- Make sure you completed the setup steps
- Restart your terminal/VS Code
- Check that Node.js is installed: `node --version`

**"Port 4321 already in use"**
- Stop any other instances of the dev server
- Or change the port in the terminal

**"Permission denied"**
- On macOS: Try adding `sudo` before the command
- On Windows: Run PowerShell as Administrator

**Changes not showing up**
- Make sure the dev server is running
- Try refreshing your browser
- Check the terminal for any error messages

**"Permission denied" when publishing**
- Make sure you have access to the GitHub repository
- You may need to set up authentication (ask your team lead)
- Check that you're logged in to GitHub

**"Failed to push" error**
- Run `git pull` first to get the latest changes
- Then try the publish script again
- If still stuck, contact the team for help

### Need More Help?

1. **Check the terminal** - error messages usually explain what's wrong
2. **Search online** - Copy error messages into Google
3. **Ask the team** - Contact other TQCC website maintainers
4. **GitHub Issues** - Check the project's GitHub page

## Next Steps

Once you're comfortable with the basics:

1. Learn about [Astro](https://docs.astro.build/)
2. Explore [Tailwind CSS](https://tailwindcss.com/docs)
3. Read about [Git workflows](https://docs.github.com/en/get-started/quickstart/hello-world) for version control
4. Check out the project structure in the `src/` folder

## Tips for Non-Technical Users

- **Save often** - Press `Ctrl+S` / `Cmd+S` regularly
- **Preview before publishing** - Always check your changes locally first
- **Use the CMS** - It's easier than editing files directly
- **Don't be afraid to experiment** - You can always undo changes (Ctrl+Z / Cmd+Z)
- **Ask for help** - Everyone was a beginner once!

---

Welcome to the TQCC website team! 🚴‍♀️
