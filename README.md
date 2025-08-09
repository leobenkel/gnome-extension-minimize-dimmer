# Minimize Dimmer - GNOME Shell Extension

A GNOME Shell extension that visually distinguishes minimized windows in the Activities Overview by dimming their opacity and optionally scaling them down.

## Features

- **Visual Differentiation**: Minimized windows appear dimmed in the Activities Overview
- **Customizable Opacity**: Adjust how transparent minimized windows appear
- **Optional Scaling**: Make minimized windows slightly smaller
- **Smooth Animations**: Transitions between states for better UX
- **Overview-Only**: Effects only apply in the Activities Overview (3-finger swipe down)

## Why This Extension?

When using GNOME's Activities Overview, all windows appear the same regardless of their state. This extension solves that by making minimized windows visually distinct, helping you quickly identify which windows are currently active vs minimized.

## Requirements

- GNOME Shell 46+
- Ubuntu 24.04 or compatible GNOME-based distribution

## Installation

### Development Installation
```bash
# Clone or copy to the extensions directory
cp -r /home/leo/repos/perso/minimize-dimmer ~/.local/share/gnome-shell/extensions/minimize-dimmer@local

# Restart GNOME Shell (X11)
Alt+F2, type 'r', press Enter

# Or logout/login for Wayland

# Enable the extension
gnome-extensions enable minimize-dimmer@local
```

### From Source
```bash
# From the project directory
./install.sh
```

## Configuration

The extension can be configured through:
- GNOME Extensions app
- Command line: `gnome-extensions prefs minimize-dimmer@local`

### Available Settings
- **Opacity Level**: How dimmed minimized windows appear (default: 0.5)
- **Scale Factor**: Size reduction for minimized windows (default: 0.9)
- **Animation Duration**: Transition speed in milliseconds (default: 200ms)

## Development

### Project Structure
```
minimize-dimmer/
├── README.md           # This file
├── TODO.md            # Development tasks
├── metadata.json      # Extension metadata
├── extension.js       # Main extension code
├── stylesheet.css     # Visual styling
├── prefs.js          # Preferences window (optional)
└── install.sh        # Installation script
```

### Testing Changes
1. Make your changes
2. Restart GNOME Shell (Alt+F2 → 'r' on X11)
3. Check logs: `journalctl -f -o cat /usr/bin/gnome-shell`

## Troubleshooting

- **Extension not showing**: Check `gnome-extensions list`
- **Not working on Wayland**: Logout and login required for changes
- **Errors**: View logs with `journalctl -xe | grep minimize-dimmer`

## License

MIT License - Feel free to modify and distribute

## Author

Created as a custom solution for personal use - GNOME Activities Overview enhancement