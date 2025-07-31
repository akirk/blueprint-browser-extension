# Blueprint Playground Launcher Extension

A browser extension that detects `blueprint.json` files on web pages and adds a "Launch in Playground" button next to them.

## Features

- ✅ Detects links to files named `blueprint.json`
- ✅ Adds a "▶️ Launch in Playground" button next to each link
- ✅ Automatically transforms GitHub URLs to `raw.githubusercontent.com` format
- ✅ Opens blueprints in WordPress Playground with the correct URL format
- ✅ Compatible with both Chrome and Firefox (Manifest V3)
- ✅ Works with dynamically loaded content
- ✅ Responsive design with dark mode support

## Installation

### Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this extension folder

### Firefox
1. Open Firefox and go to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file

## How it works

1. The extension scans web pages for links ending in `blueprint.json`
2. For each detected link, it adds a blue "Launch in Playground" button
3. When clicked, the button:
   - Transforms GitHub URLs from `github.com/user/repo/blob/branch/path` to `raw.githubusercontent.com/user/repo/branch/path`
   - Creates a playground URL: `https://playground.wordpress.net/?blueprint-url=<encoded-url>`
   - Opens the playground in a new tab

## URL Transformation Examples

- **GitHub**: `https://github.com/user/repo/blob/main/blueprint.json` → `https://raw.githubusercontent.com/user/repo/main/blueprint.json`
- **Other sites**: URLs are used as-is

## File Structure

```
├── manifest.json          # Extension manifest (Manifest V3)
├── content.js            # Main content script
├── styles.css            # Button styling
├── icons/                # Extension icons (add your own)
└── README.md            # This file
```

## Development

The extension uses:
- **Manifest V3** for modern browser compatibility
- **Content Scripts** to scan and modify web pages
- **MutationObserver** to detect dynamically loaded content
- **CSS** for responsive button styling with dark mode support

## Notes

- The extension requires no special permissions beyond `activeTab`
- Buttons are only added once per link (prevents duplicates)
- Works with both static and dynamic content loading
- Styled to integrate well with GitHub and other common sites