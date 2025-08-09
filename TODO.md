# Minimize Dimmer Extension - Development Tasks

## Core Development
- [ ] Create extension metadata (metadata.json)
  - Define extension name, UUID, description
  - Set compatible GNOME Shell versions (46+)
  - Add author information

- [ ] Implement main extension logic (extension.js)
  - Create extension class with enable/disable methods
  - Hook into GNOME Shell's overview signals
  - Detect window minimize state
  - Apply CSS classes to minimized windows

- [ ] Create styling (stylesheet.css)
  - Define dimmed window opacity (0.4-0.6)
  - Add optional scaling transform (0.8-0.9)
  - Smooth transition animations
  - Consider dark/light theme compatibility

## Window Detection Logic
- [ ] Implement minimize state detection
  - Monitor window state changes
  - Track minimized windows list
  - Update on window restore/minimize events

- [ ] Overview integration
  - Hook into Activities Overview show/hide
  - Apply effects only in overview mode
  - Clean up on overview exit

## User Preferences (Optional Enhancement)
- [ ] Add preferences window
  - Opacity slider (0.1 - 1.0)
  - Scale factor slider (0.5 - 1.0)  
  - Animation duration setting
  - Enable/disable toggle

- [ ] Create prefs.js for settings UI
- [ ] Store settings using GSettings schema

## Testing & Installation
- [ ] Test with different window types
  - Regular application windows
  - Dialog windows
  - Multiple monitors setup

- [ ] Create installation script
  - Copy files to extensions directory
  - Compile GSettings schemas if needed
  - Restart GNOME Shell

- [ ] Test on GNOME 46
- [ ] Document any issues or limitations

## Polish & Distribution
- [ ] Add error handling and logging
- [ ] Optimize performance for many windows
- [ ] Create screenshots/demo GIF
- [ ] Package for extensions.gnome.org (optional)