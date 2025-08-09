# Publishing to extensions.gnome.org

## Prerequisites

1. **Create an account** on https://extensions.gnome.org/
2. **Test thoroughly** in multiple GNOME versions (if supporting multiple)
3. **Ensure compliance** with GNOME Extensions review guidelines

## Submission Process

### Step 1: Prepare the Extension

```bash
# Ensure schemas are compiled
glib-compile-schemas ./schemas/

# Create the submission package
./package-for-ego.sh
```

### Step 2: Initial Submission

1. Go to https://extensions.gnome.org/upload/
2. Upload the `minimize-dimmer@leobenkel.com.zip` file
3. Fill in the form:
   - **Name**: Minimize Dimmer
   - **Description**: Dims minimized windows to visually distinguish them
   - **Homepage**: https://github.com/leobenkel/gnome-extension-minimize-dimmer
   - **GNOME Shell Versions**: 46
   - **License**: GPL-3.0 (required for e.g.o)
   - **Screenshot**: Upload a screenshot showing the effect

### Step 3: Review Process

The extension will go through review by GNOME maintainers. Common review feedback:

1. **No console.log() in production** - Use them sparingly or remove
2. **Proper cleanup in disable()** - Must restore all modified state
3. **No deprecated APIs** - Use current GNOME Shell APIs
4. **Follow GJS style guide** - 4-space indentation, etc.
5. **Translations support** - Optional but recommended

### Step 4: Updates

After initial approval, updates are easier:
1. Increment version in metadata.json
2. Upload new zip at https://extensions.gnome.org/upload/
3. Wait for review (usually faster for updates)

## Review Guidelines Compliance

### ✅ Current Status

- [x] Uses ES6 modules (required for GNOME 46+)
- [x] Proper enable/disable lifecycle
- [x] Settings through GSettings with schema
- [x] No global namespace pollution
- [x] Cleans up all connections on disable

### ⚠️ Needs Adjustment for e.g.o

- [ ] Remove or guard console.log statements
- [ ] Add GPL-3.0 license (required by e.g.o)
- [ ] Add screenshot for submission
- [ ] Consider adding translations support

## Automated Submission (Future)

You can automate submissions using the e.g.o API:

```bash
# Get your API credentials from https://extensions.gnome.org/accounts/profile/
EGO_USERNAME="your-username"
EGO_PASSWORD="your-password"

# Submit extension (example)
curl -F "source=@minimize-dimmer@leobenkel.com.zip" \
     -u "$EGO_USERNAME:$EGO_PASSWORD" \
     https://extensions.gnome.org/api/v1/extensions/
```

## Version Support Strategy

### Single Version (Current)
- Supporting only GNOME 46
- Simpler maintenance
- Uses latest APIs

### Multi-Version (Future)
To support multiple GNOME versions:
```json
"shell-version": ["45", "46", "47"]
```

You may need version-specific code:
```javascript
const shellVersion = Config.PACKAGE_VERSION;
if (shellVersion.startsWith('45')) {
    // GNOME 45 specific code
} else {
    // GNOME 46+ code
}
```

## Marketing Your Extension

Once published:

1. **Add e.g.o badge** to README:
```markdown
[![Get it on GNOME Extensions](https://img.shields.io/badge/GNOME%20Extensions-Minimize%20Dimmer-4a86cf?logo=gnome&logoColor=white)](https://extensions.gnome.org/extension/YOUR_ID/)
```

2. **Share on social media**:
   - Mastodon: #GNOME #GNOMEExtensions
   - Reddit: r/gnome
   - GNOME Discourse

3. **Respond to user reviews** on e.g.o

## Monitoring

After publication:
- Check reviews regularly
- Monitor error reports
- Update for new GNOME versions
- Respond to user feedback

## FAQ

**Q: How long does review take?**
A: Initial review: 1-7 days. Updates: 1-3 days typically.

**Q: Can I use MIT license?**
A: No, e.g.o requires GPL-2.0+ or GPL-3.0+.

**Q: Do I need to support all GNOME versions?**
A: No, you can choose which versions to support.

**Q: Can I include binary files?**
A: No, only JavaScript, CSS, and resource files.

**Q: How do I handle rejection?**
A: Address the feedback, fix issues, and resubmit. Reviewers are helpful!