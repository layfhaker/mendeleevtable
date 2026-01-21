# Qwen Code Context File

## Project Overview

**Chemical Assistant** is an interactive periodic table of elements application built with pure HTML, CSS, and JavaScript. It features an extensive database of chemical elements with detailed information, including physical properties, history, applications, and interesting facts. The project also includes advanced features like a solubility table, molecular mass calculator, and a unique "nodemap" visualization system for code architecture.

The application is designed as a Progressive Web App (PWA) with offline capabilities and also has a desktop version built with Electron that includes special features like Windows wallpaper integration.

### Key Features

- **Interactive Periodic Table**: Complete Mendeleev table with 118 elements, color-coded by categories
- **Element Information**: Detailed data for each element including atomic properties, discovery history, applications, and facts
- **Alloytrope Support**: Information about different forms of elements (e.g., diamond/graphite for carbon)
- **Solubility Table**: Comprehensive 24×16 table showing solubility of compounds with realistic colors
- **Molecular Mass Calculator**: Drag-and-drop calculator for determining compound masses
- **Search & Filters**: Smart search functionality and category filtering
- **Dark/Light Themes**: With wave animations and particle effects
- **LaTeX Export**: Generate `.tex` files with element data and reactions
- **PWA Support**: Works offline with service worker caching
- **Electron Desktop App**: Windows/Linux builds with Windows wallpaper integration
- **Large Screen Optimization**: Adaptive sizing for wide displays
- **Nodemap Visualization**: Interactive graph visualization of code architecture and dependencies

### Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **No Frameworks**: Built without external frameworks for maximum performance
- **Canvas API**: Used for particle animations and 3D atom visualization
- **SVG**: Vector icons and graphics
- **PWA**: Service workers, manifest for offline functionality
- **Electron**: Desktop application wrapper with native API integration

## Project Structure

```
mendeleevtable/
├── index.html                 # Main HTML structure
├── manifest.json              # PWA manifest
├── sw.js                     # Service worker for offline functionality
├── css/                      # Stylesheets (modular system)
│   ├── style.css             # Main import file
│   ├── base.css              # Base styles and canvas
│   ├── table.css             # Periodic table styling
│   ├── modal.css             # Element modal window
│   ├── theme.css             # Dark theme and animations
│   ├── fab.css               # Floating action button menu
│   ├── calculator.css        # Molecular mass calculator
│   ├── filters.css           # Search and filter panel
│   ├── solubility.css        # Solubility table styling
│   ├── advanced-modal.css    # Advanced substance modal
│   ├── nodemap.css           # Nodemap visualization
│   └── scroll-collapse.css   # Scroll-collapse system
├── js/                       # JavaScript modules
│   ├── scrypt.js             # Module loader (entry point)
│   ├── icons.js              # SVG icon sprite
│   ├── elements.js           # Elements database (118 elements)
│   ├── particles.js          # Canvas animations and 3D atoms
│   ├── scroll-collapse.js    # Virtual scroll and collapse system
│   ├── wallpaper-handler.js  # Wallpaper functionality (Electron)
│   ├── download-link-updater.js # Dynamic download links
│   ├── modules/              # Core modules
│   │   ├── modal.js          # Element modal functionality
│   │   ├── theme.js          # Theme switching
│   │   ├── calculator.js     # Molecular mass calculator
│   │   ├── balancer.js       # Reaction balancer
│   │   ├── latex-export.js   # LaTeX export
│   │   ├── search-filters.js # Search and filtering
│   │   ├── ui.js             # FAB menu and UI interactions
│   │   └── mobile-layout.js  # Mobile responsiveness
│   ├── solubility/           # Solubility table modules
│   │   ├── data.js           # Cation/anion matrix data
│   │   ├── colors.js         # Substance color mapping
│   │   ├── solubility-table.js # Table rendering
│   │   ├── filters.js        # Filtering and highlighting
│   │   ├── search.js         # Substance search
│   │   ├── modal.js          # Main modal functionality
│   │   └── advanced-modal.js # Detailed substance info
│   └── nodemap/              # Architecture visualization
│       ├── nodemap-init.js   # Initialization
│       ├── nodemap-parser.js # Function parsing
│       ├── nodemap-layout.js # Placement algorithm
│       ├── nodemap-canvas.js # Canvas rendering
│       ├── nodemap-modal.js  # Modal interface
│       ├── nodemap-flow-data.js # Data flow analysis
│       ├── nodemap-flow-layout.js # Flow diagram layout
│       └── nodemap-flow-canvas.js # Flow diagram rendering
├── electron-app/             # Electron desktop application
│   ├── electron/             # Electron main process files
│   │   ├── main.js           # Main Electron process
│   │   ├── preload.js        # Secure renderer API
│   │   └── wallpaper-api.js  # Windows wallpaper API
│   ├── package.json          # Electron app config
│   └── README.md             # Electron setup instructions
├── latex/                    # LaTeX templates
│   ├── element-template.tex
│   └── preamble.tex
├── img/                      # Image assets
└── md/                       # Documentation files
```

## Building and Running

### Web Version
1. Clone the repository
2. Open `index.html` directly in a browser (no server required)
3. Or serve via a local HTTP server for optimal functionality

### Development Setup
```bash
# For Electron desktop app
cd electron-app
npm install
npm start
```

### Electron Desktop App Build
```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Build Windows installer
npm run build:win

# Build Linux packages (AppImage/deb/snap)
npm run build:linux
```

## Development Conventions

- **Pure JavaScript**: No bundlers, frameworks, or transpilers used
- **Modular Loading**: Custom module system via `scrypt.js`
- **File Protocol Support**: Code works with `file://` protocol
- **Performance First**: Optimized for speed and efficiency
- **Mobile Responsive**: Designed with mobile-first approach
- **Progressive Enhancement**: Core functionality works without JavaScript

## Key Files and Components

- `js/elements.js`: Contains comprehensive database of chemical elements with detailed properties
- `js/scrypt.js`: Custom module loading system that loads scripts progressively
- `js/nodemap/`: Advanced code visualization system that analyzes and displays function dependencies
- `electron-app/electron/`: Desktop application wrapper with Windows integration features
- `sw.js`: Service worker implementing comprehensive caching strategy

## Special Features

### Electron Integration
The desktop version includes unique features:
- **Live Wallpaper**: Sets the periodic table as animated Windows desktop wallpaper
- **System Tray**: Application continues running in system tray when closed
- **Auto-start**: Option to launch with Windows
- **NSIS Installer**: Professional installation package
 - **Linux Packages**: AppImage / deb / snap builds (without wallpaper integration)

### Nodemap Visualization
An innovative feature that automatically analyzes the codebase and creates an interactive graph visualization showing:
- Function dependencies and relationships
- Call frequency heat map (Cold/Normal/Warm/Hot)
- Function types (Entry/Hub/Leaf/Island)
- Complexity metrics
- Warning panel for dead code, circular dependencies, and high complexity

### Solubility Table
Comprehensive 24×16 table with:
- Sticky headers for easy navigation
- Crosshair highlighting for selected compounds
- Realistic colors representing actual substance colors
- Toggle functionality for highlighting
- Search and filter capabilities
