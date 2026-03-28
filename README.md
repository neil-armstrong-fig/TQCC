# TQCC Website

Official website for Titanic Quarter Cycling Club.

## 🚀 Quick Start

**New to development?** See [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed setup instructions.

**Quick reference?** See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for a handy cheat sheet.

**Experienced developers:**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server will be available at [http://localhost:4321](http://localhost:4321)

## 🛠 Tech Stack

- **Framework**: [Astro 5](https://astro.build)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **CMS**: [Sveltia CMS](https://github.com/sveltia/sveltia-cms) (Git-based)
- **Hosting**: GitHub Pages
- **Language**: TypeScript

## 📝 Content Management

### Using Sveltia CMS (Recommended)

1. Start the dev server: `npm run dev`
2. Navigate to [http://localhost:4321/admin](http://localhost:4321/admin)
3. Log in with your GitHub account
4. Edit content using the visual editor

### Manual Editing

Content is stored as markdown files:

- **Blog Posts**: `src/content/posts/`
- **Events**: `src/content/events/`
- **Ride Schedules**: `src/content/rides/`

Content schemas are defined in `src/content.config.ts`

## 🎨 Brand Colors

- **TQCC Yellow**: `#FFD700` (tqcc-yellow)
- **TQCC Black**: `#1A1A1A` (tqcc-black)
- **TQCC Pink**: `#E91E8C` (tqcc-pink)

Colors are defined in `src/styles/global.css` using Tailwind v4's `@theme` directive.

## 📁 Project Structure

```
tqcc-website/
├── public/              # Static assets
│   └── admin/           # Sveltia CMS config
├── scripts/             # Setup and utility scripts
│   ├── setup.sh         # macOS/Linux setup script
│   ├── setup.ps1        # Windows setup script
│   ├── publish.sh       # macOS/Linux publish script
│   └── publish.ps1      # Windows publish script
├── src/
│   ├── components/      # Astro/UI components
│   ├── content/         # Markdown content files
│   ├── layouts/         # Page layouts
│   ├── pages/           # Site pages (file-based routing)
│   ├── styles/          # Global styles
│   └── content.config.ts # Content collection schemas
├── .vscode/             # VS Code settings & extensions
└── GETTING_STARTED.md   # Detailed setup guide
```

## 🤝 Contributing

### For Non-Technical Users

1. Make your edits using the CMS or by editing files
2. Test locally with `npm run dev`
3. **Publish your changes:**
   - macOS: `./scripts/publish.sh`
   - Windows: `.\scripts\publish.ps1`
4. Follow the prompts - the script handles everything!

### For Developers

1. Create a new branch for your changes
2. Make your edits
3. Test locally with `npm run dev`
4. Use standard Git workflow: `git add`, `git commit`, `git push`
5. Submit a pull request

**Important**: Always use **miles** for distances in events and rides, not kilometers.

## 📊 Analytics

- [Google Analytics (GA4)](https://analytics.google.com/analytics/web/?authuser=1#/a389021498p530277920/reports/intelligenthome)
- [Microsoft Clarity](https://clarity.microsoft.com/projects/view/w2v17wpdru/impressions?date=Last%203%20days)

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Sveltia CMS Documentation](https://github.com/sveltia/sveltia-cms)

## 🆘 Need Help?

- Check [GETTING_STARTED.md](./GETTING_STARTED.md) for troubleshooting
- Review error messages in the terminal
- Contact the TQCC website team
