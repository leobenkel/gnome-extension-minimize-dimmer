# Testing the Extension Safely

## Safe Testing Methods

### 1. **Nested GNOME Shell Session** (Recommended)
Run GNOME Shell in a window for testing:
```bash
dbus-run-session -- gnome-shell --nested --wayland
```
This creates an isolated GNOME session in a window where you can test extensions without affecting your main session.

### 2. **Looking Glass** (Built-in Debugger)
- Press `Alt+F2`, type `lg` and press Enter
- This opens GNOME Shell's built-in debugger
- You can inspect extensions, see errors, and test JavaScript code
- Use the "Extensions" tab to reload extensions

### 3. **Extension Development Mode**
Instead of installing system-wide, symlink the extension:
```bash
ln -s /home/leo/repos/perso/minimize-dimmer ~/.local/share/gnome-shell/extensions/minimize-dimmer@leobenkel.com
```
This allows you to:
- Easily remove the extension by deleting the symlink
- Make changes and reload without reinstalling
- Test without root permissions

### 4. **Reload Without Logout**
After making changes to the extension:
- **On X11**: Press `Alt+F2`, type `r`, press Enter (restarts GNOME Shell)
- **On Wayland**: You need to logout/login (or use nested session)

## Development Workflow

1. Develop in this directory
2. Create symlink to extensions folder
3. Test in nested session first
4. If working, reload main session to test
5. Use Looking Glass to debug issues

## Monitoring Logs
```bash
# Watch for extension errors
journalctl -f -o cat /usr/bin/gnome-shell

# Or filter for your extension
journalctl -f -o cat /usr/bin/gnome-shell | grep -i dimmer
```

## Quick Disable if Issues Occur
If the extension causes problems:
```bash
# Disable via command line
gnome-extensions disable minimize-dimmer@leobenkel.com

# Or remove the symlink
rm ~/.local/share/gnome-shell/extensions/minimize-dimmer@leobenkel.com
```