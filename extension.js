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
        this._overviewShowingId = null;
        this._overviewHidingId = null;
        this._overviewVisible = false;
        this._stylesheet = null;
    }

    enable() {
        console.log('MinimizeDimmer: Enabling extension');
        
        this._settings = this.getSettings();
        
        // Load and apply stylesheet
        this._stylesheet = this.pathToFileURL('stylesheet.css').get_path();
        St.ThemeContext.get_for_stage(global.stage).get_theme().load_stylesheet(this._stylesheet);
        this._updateStyle();

        this._settingsChangedId = this._settings.connect('changed', () => this._updateStyle());
        
        this._overviewShowingId = Main.overview.connect('showing', this._onOverviewShowing.bind(this));
        this._overviewHidingId = Main.overview.connect('hiding', this._onOverviewHiding.bind(this));

        const windows = global.get_window_actors();
        windows.forEach(windowActor => {
            this._connectWindowSignals(windowActor);
            if (windowActor.meta_window.minimized) {
                this._addMinimizedWindow(windowActor);
            }
        });
        
        this._signalIds.push(
            global.window_manager.connect('map', (wm, windowActor) => {
                this._connectWindowSignals(windowActor);
            })
        );
        
        this._signalIds.push(
            global.window_manager.connect('minimize', (wm, windowActor) => {
                this._addMinimizedWindow(windowActor);
            })
        );
        
        this._signalIds.push(
            global.window_manager.connect('unminimize', (wm, windowActor) => {
                this._removeMinimizedWindow(windowActor);
            })
        );
        
        this._signalIds.push(
            global.window_manager.connect('destroy', (wm, windowActor) => {
                this._disconnectWindowSignals(windowActor);
            })
        );

        if (Main.overview.visible) {
            this._onOverviewShowing();
        }
    }

    _connectWindowSignals(windowActor) {
        const metaWindow = windowActor.meta_window;
        if (!metaWindow || this._windowActors.has(windowActor)) return;
        
        const signalIds = [];
        signalIds.push(
            metaWindow.connect('notify::minimized', () => {
                if (metaWindow.minimized) {
                    this._addMinimizedWindow(windowActor);
                } else {
                    this._removeMinimizedWindow(windowActor);
                }
            })
        );
        this._windowActors.set(windowActor, signalIds);
    }

    _disconnectWindowSignals(windowActor) {
        const signalIds = this._windowActors.get(windowActor);
        if (signalIds) {
            const metaWindow = windowActor.meta_window;
            if (metaWindow) {
                signalIds.forEach(id => metaWindow.disconnect(id));
            }
            this._windowActors.delete(windowActor);
        }
        this._removeMinimizedWindow(windowActor);
    }

    _addMinimizedWindow(windowActor) {
        if (!windowActor || this._minimizedWindows.has(windowActor)) return;
        this._minimizedWindows.add(windowActor);
        if (this._overviewVisible) {
            this._applyEffect(windowActor);
        }
    }

    _removeMinimizedWindow(windowActor) {
        if (!windowActor || !this._minimizedWindows.has(windowActor)) return;
        this._removeEffect(windowActor);
        this._minimizedWindows.delete(windowActor);
    }

    _onOverviewShowing() {
        this._overviewVisible = true;
        this._minimizedWindows.forEach(windowActor => this._applyEffect(windowActor));
    }

    _onOverviewHiding() {
        this._overviewVisible = false;
        this._minimizedWindows.forEach(windowActor => this._removeEffect(windowActor));
    }

    _applyEffect(windowActor) {
        if (!this._settings.get_boolean('enable-dimming')) return;
        
        if (!this._settings.get_boolean('affect-all-windows')) {
            const metaWindow = windowActor.meta_window;
            if (metaWindow && metaWindow.get_window_type() !== Meta.WindowType.NORMAL) {
                return;
            }
        }
        windowActor.add_style_class_name('minimized-dimmed');
    }

    _removeEffect(windowActor) {
        windowActor.remove_style_class_name('minimized-dimmed');
    }

    _updateStyle() {
        const opacity = this._settings.get_int('dimmed-opacity') / 100.0;
        const duration = this._settings.get_int('animation-duration');
        const scale = this._settings.get_double('scale-factor');

        const style = `
            --minimized-dimmed-opacity: ${opacity};
            --minimized-dimmed-scale: ${scale};
            --minimized-dimmed-duration: ${duration}ms;
        `;
        // Applying style to uiGroup ensures it's available globally for window actors
        Main.uiGroup.style = style;
    }

    disable() {
        console.log('MinimizeDimmer: Disabling extension');
        
        // Restore all windows
        this._minimizedWindows.forEach(windowActor => this._removeEffect(windowActor));

        if (this._settingsChangedId) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }

        if (this._overviewShowingId) {
            Main.overview.disconnect(this._overviewShowingId);
            this._overviewShowingId = null;
        }
        if (this._overviewHidingId) {
            Main.overview.disconnect(this._overviewHidingId);
            this._overviewHidingId = null;
        }
        
        this._signalIds.forEach(id => global.window_manager.disconnect(id));
        this._signalIds = [];
        
        this._windowActors.forEach((signalIds, windowActor) => {
            const metaWindow = windowActor.meta_window;
            if (metaWindow) {
                signalIds.forEach(id => metaWindow.disconnect(id));
            }
        });
        
        this._windowActors.clear();
        this._minimizedWindows.clear();

        // Unload stylesheet and clear style
        if (this._stylesheet) {
            St.ThemeContext.get_for_stage(global.stage).get_theme().unload_stylesheet(this._stylesheet);
            this._stylesheet = null;
        }
        Main.uiGroup.style = '';
    }
}