import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class MinimizeDimmerPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        // Create settings
        const settings = this.getSettings();
        
        // Create a preferences page
        const page = new Adw.PreferencesPage({
            title: 'General',
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);
        
        // Create a preferences group
        const group = new Adw.PreferencesGroup({
            title: 'Dimming Settings',
            description: 'Configure how minimized windows appear',
        });
        page.add(group);
        
        // Opacity setting
        const opacityRow = new Adw.SpinRow({
            title: 'Dimmed Opacity',
            subtitle: 'Opacity for minimized windows (0 = transparent, 100 = opaque)',
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 100,
                step_increment: 5,
                page_increment: 10,
                value: settings.get_int('dimmed-opacity'),
            }),
        });
        
        opacityRow.adjustment.connect('value-changed', (adjustment) => {
            settings.set_int('dimmed-opacity', adjustment.get_value());
        });
        
        group.add(opacityRow);
        
        // Scale factor setting
        const scaleRow = new Adw.SpinRow({
            title: 'Scale Factor',
            subtitle: 'Size of minimized windows (0.5 = 50%, 1.0 = 100%)',
            adjustment: new Gtk.Adjustment({
                lower: 0.5,
                upper: 1.0,
                step_increment: 0.05,
                page_increment: 0.1,
                value: settings.get_double('scale-factor'),
            }),
            digits: 2,
        });

        scaleRow.adjustment.connect('value-changed', (adjustment) => {
            settings.set_double('scale-factor', adjustment.get_value());
        });

        group.add(scaleRow);

        // Animation duration setting
        const animationRow = new Adw.SpinRow({
            title: 'Animation Duration',
            subtitle: 'Duration of fade animation in milliseconds',
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 1000,
                step_increment: 50,
                page_increment: 100,
                value: settings.get_int('animation-duration'),
            }),
        });
        
        animationRow.adjustment.connect('value-changed', (adjustment) => {
            settings.set_int('animation-duration', adjustment.get_value());
        });
        
        group.add(animationRow);
        
        // Enable/disable switch
        const enableRow = new Adw.SwitchRow({
            title: 'Enable Dimming',
            subtitle: 'Turn the dimming effect on or off',
            active: settings.get_boolean('enable-dimming'),
        });
        
        enableRow.connect('notify::active', (widget) => {
            settings.set_boolean('enable-dimming', widget.get_active());
        });
        
        group.add(enableRow);
        
        // Add a second group for behavior settings
        const behaviorGroup = new Adw.PreferencesGroup({
            title: 'Behavior',
            description: 'Additional options',
        });
        page.add(behaviorGroup);
        
        // Affect all windows or just applications
        const allWindowsRow = new Adw.SwitchRow({
            title: 'Affect All Windows',
            subtitle: 'Apply dimming to all window types (dialogs, popups, etc.)',
            active: settings.get_boolean('affect-all-windows'),
        });
        
        allWindowsRow.connect('notify::active', (widget) => {
            settings.set_boolean('affect-all-windows', widget.get_active());
        });
        
        behaviorGroup.add(allWindowsRow);
    }
}