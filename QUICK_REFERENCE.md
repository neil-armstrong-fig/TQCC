# TQCC Website - Quick Reference Card

A cheat sheet for common tasks. Keep this handy! 📋

## 🚀 Daily Workflow

### 1. Start Working

```bash
# macOS/Linux
npm run dev

# Windows
npm run dev
```

**Opens**: [http://localhost:4321](http://localhost:4321)

### 2. Make Your Changes

- Use CMS at `/admin` (easiest)
- Or edit files in `src/content/`

### 3. Publish Your Changes

```bash
# macOS/Linux
./scripts/publish.sh

# Windows
.\scripts\publish.ps1
```

### 4. Stop Working

Press `Ctrl+C` in the terminal

---

## 📁 Where Things Are

| Content Type | Location |
|--------------|----------|
| Blog Posts | `src/content/posts/` |
| Events | `src/content/events/` |
| Ride Schedules | `src/content/rides/` |
| Images | `public/images/` |
| Styles | `src/styles/global.css` |

---

## 🎨 Brand Colors

```
Yellow: #FFD700  (tqcc-yellow)
Black:  #1A1A1A  (tqcc-black)
Pink:   #E91E8C  (tqcc-pink)
```

---

## 🛠️ Common Commands

### Development

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

### Content Management

| Task | CMS | Manual |
|------|-----|--------|
| New Blog Post | `/admin` → Blog Posts → New | Create `.md` in `posts/` |
| New Event | `/admin` → Events → New | Create `.md` in `events/` |
| Edit Ride Schedule | `/admin` → Rides | Edit `.md` in `rides/` |

### Publishing

| Step | Command | What It Does |
|------|---------|--------------|
| 1. Save | `./scripts/publish.sh` or `.\scripts\publish.ps1` | Saves changes locally |
| 2. Describe | (prompted) | Describes what you changed |
| 3. Upload | (automatic) | Uploads to GitHub |
| 4. Deploy | (automatic) | GitHub Actions builds and deploys |

---

## ⌨️ Keyboard Shortcuts

### VS Code

| Action | macOS | Windows |
|--------|-------|---------|
| Open Terminal | `` Ctrl+` `` | `` Ctrl+` `` |
| Save File | `Cmd+S` | `Ctrl+S` |
| Find in File | `Cmd+F` | `Ctrl+F` |
| Find in All Files | `Cmd+Shift+F` | `Ctrl+Shift+F` |
| Command Palette | `Cmd+Shift+P` | `Ctrl+Shift+P` |
| Undo | `Cmd+Z` | `Ctrl+Z` |
| Redo | `Cmd+Shift+Z` | `Ctrl+Y` |

### Terminal

| Action | Shortcut |
|--------|----------|
| Stop server | `Ctrl+C` |
| Clear screen | `Ctrl+L` or `clear` |
| Previous command | `↑` arrow |

---

## ❗ Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Server won't start** | Stop it with `Ctrl+C`, then run `npm run dev` again |
| **Changes not visible** | Refresh browser (`Cmd+R` or `Ctrl+R`) |
| **"Command not found"** | Restart terminal/VS Code |
| **"Port already in use"** | Stop other instances with `Ctrl+C` |
| **Can't publish** | Make sure you're logged in to GitHub |
| **Git errors** | Run `git pull` first, then try again |

---

## 📝 Content Guidelines

### Blog Posts

- **Title**: Clear and descriptive
- **Category**: rides, events, news, tips
- **Tags**: 2-5 relevant tags
- **Image**: Optional featured image

### Events

- **Distance**: Always use **miles**, not km!
- **Date**: Format: `YYYY-MM-DD`
- **Location**: Include full address
- **Type**: social, training, competitive

### Rides

- **Difficulty**: beginner, intermediate, advanced
- **Time**: Use 12-hour format (e.g., "7:00 PM")
- **Day**: Full day name (e.g., "Tuesday")

---

## 🆘 Need Help?

1. **Check GETTING_STARTED.md** - Full setup and troubleshooting guide
2. **Check terminal messages** - Error messages often explain the problem
3. **Google the error** - Copy and paste error messages
4. **Ask the team** - Contact TQCC website administrators
5. **GitHub Issues** - Report bugs or request features

---

## 📚 Learn More

- **First time?** → [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Full docs** → [README.md](./README.md)
- **Astro docs** → [docs.astro.build](https://docs.astro.build)
- **Tailwind docs** → [tailwindcss.com](https://tailwindcss.com)

---

**Pro Tip**: Bookmark this page and keep it open while you work! 🔖

Made with ❤️ by TQCC
