import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class MinimizeDimmerExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this._windowActors = new Map();
        this._minimizedWindows = new Set();
        this._signalIds = [];
        this._settings = null;
        this._settingsChangedId = null;
    }

    enable() {
        console.log('MinimizeDimmer: Enabling extension');
        
        // Initialize settings
        this._settings = this.getSettings();
        
        // Watch for settings changes
        this._settingsChangedId = this._settings.connect('changed', () => {
            this._updateAllWindows();
        });
        
        // Connect to window manager signals
        const display = global.display;
        const windowTracker = Shell.WindowTracker.get_default();
        
        // Monitor existing windows
        const windows = global.get_window_actors();
        windows.forEach(windowActor => {
            this._connectWindowSignals(windowActor);
            this._checkWindowState(windowActor);
        });
        
        // Monitor new windows
        this._signalIds.push(
            global.window_manager.connect('map', (wm, windowActor) => {
                this._connectWindowSignals(windowActor);
            })
        );
        
        // Monitor window minimize/unminimize
        this._signalIds.push(
            global.window_manager.connect('minimize', (wm, windowActor) => {
                this._onWindowMinimized(windowActor);
            })
        );
        
        this._signalIds.push(
            global.window_manager.connect('unminimize', (wm, windowActor) => {
                this._onWindowUnminimized(windowActor);
            })
        );
        
        // Monitor window destruction
        this._signalIds.push(
            global.window_manager.connect('destroy', (wm, windowActor) => {
                this._disconnectWindowSignals(windowActor);
            })
        );
    }

    _connectWindowSignals(windowActor) {
        const metaWindow = windowActor.meta_window;
        if (!metaWindow) return;
        
        // Skip if already connected
        if (this._windowActors.has(windowActor)) return;
        
        const signalIds = [];
        
        // Monitor minimize state changes
        signalIds.push(
            metaWindow.connect('notify::minimized', () => {
                this._checkWindowState(windowActor);
            })
        );
        
        this._windowActors.set(windowActor, signalIds);
        
        // Check initial state
        if (metaWindow.minimized) {
            this._onWindowMinimized(windowActor);
        }
    }

    _disconnectWindowSignals(windowActor) {
        const signalIds = this._windowActors.get(windowActor);
        if (!signalIds) return;
        
        const metaWindow = windowActor.meta_window;
        if (metaWindow) {
            signalIds.forEach(id => metaWindow.disconnect(id));
        }
        
        this._windowActors.delete(windowActor);
        this._minimizedWindows.delete(windowActor);
    }

    _checkWindowState(windowActor) {
        const metaWindow = windowActor.meta_window;
        if (!metaWindow) return;
        
        if (metaWindow.minimized) {
            this._onWindowMinimized(windowActor);
        } else {
            this._onWindowUnminimized(windowActor);
        }
    }

    _onWindowMinimized(windowActor) {
        if (!windowActor || this._minimizedWindows.has(windowActor)) return;
        
        // Check if dimming is enabled
        if (!this._settings.get_boolean('enable-dimming')) return;
        
        // Check window type if needed
        if (!this._settings.get_boolean('affect-all-windows')) {
            const metaWindow = windowActor.meta_window;
            if (metaWindow && metaWindow.get_window_type() !== Meta.WindowType.NORMAL) {
                return;
            }
        }
        
        console.log('MinimizeDimmer: Window minimized, applying dim effect');
        this._minimizedWindows.add(windowActor);
        
        // Get settings values
        const opacity = Math.round(this._settings.get_int('dimmed-opacity') * 255 / 100);
        const duration = this._settings.get_int('animation-duration');
        
        // Apply dimming effect
        windowActor.ease({
            opacity: opacity,
            duration: duration,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD
        });
    }

    _onWindowUnminimized(windowActor) {
        if (!windowActor || !this._minimizedWindows.has(windowActor)) return;
        
        console.log('MinimizeDimmer: Window unminimized, removing dim effect');
        this._minimizedWindows.delete(windowActor);
        
        const duration = this._settings.get_int('animation-duration');
        
        // Remove dimming effect
        windowActor.ease({
            opacity: 255,
            duration: duration,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD
        });
    }

    _updateAllWindows() {
        // Update all minimized windows with new settings
        this._minimizedWindows.forEach(windowActor => {
            if (!this._settings.get_boolean('enable-dimming')) {
                // If dimming is disabled, restore all windows
                windowActor.opacity = 255;
            } else {
                // Update with new opacity
                const opacity = Math.round(this._settings.get_int('dimmed-opacity') * 255 / 100);
                windowActor.opacity = opacity;
            }
        });
    }

    disable() {
        console.log('MinimizeDimmer: Disabling extension');
        
        // Disconnect settings
        if (this._settingsChangedId) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }
        
        // Disconnect global signals
        this._signalIds.forEach(id => {
            global.window_manager.disconnect(id);
        });
        this._signalIds = [];
        
        // Restore all windows and disconnect signals
        this._windowActors.forEach((signalIds, windowActor) => {
            // Restore opacity
            if (this._minimizedWindows.has(windowActor)) {
                windowActor.opacity = 255;
            }
            
            // Disconnect window signals
            const metaWindow = windowActor.meta_window;
            if (metaWindow) {
                signalIds.forEach(id => metaWindow.disconnect(id));
            }
        });
        
        this._windowActors.clear();
        this._minimizedWindows.clear();
    }
}