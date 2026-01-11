# Full Prompt for Claude Code - Fix Electron App Build Issues

## Project Context

This is a Chemistry Assistant web application (`mendeleevtable`) with an Electron desktop version. The project has automated GitHub Actions workflows to build Windows installers and deploy to GitHub Pages.

## Critical Issues Found

### 1. **Workflow Issues (`release.yml`)**
- Using Linux commands (`mkdir -p`, `cp -r`) on `windows-latest` runner (lines 28-38)
- Deprecated `::set-output` syntax (line 54)
- Should use PowerShell commands like in `deploy-installer.yml`

### 2. **Package.json Configuration (`electron-app/package.json`)**
- Incorrect file paths with `../` prefix (lines 37-42)
- Missing `artifactName` in nsis configuration (lines 67-72)
- After copying files to `electron-app/`, paths should NOT include `../`

**Current (broken):**
```json
"files": [
  "electron/**/*",
  "../index.html",
  "../css/**/*",
  "../js/**/*",
  "../img/**/*"
]
```

**Should be:**
```json
"files": [
  "electron/**/*",
  "index.html",
  "css/**/*",
  "js/**/*",
  "img/**/*",
  "manifest.json",
  "sw.js"
]
```

### 3. **White Screen in Built Application**
The Electron app shows a blank white screen because:
- Files are copied TO `electron-app/` by workflow
- But `package.json` looks for files at `../` (parent directory)
- Result: Files not included in build → white screen

### 4. **Download Link 404 Error**
In `index.html` line 674:
```html
href="https://layfhaker.github.io/mendeleevtable/Chemical.Assistant.Wallpaper.Setup.1.0.0.exe"
```
This file doesn't exist. Need dynamic link to latest GitHub release.

### 5. **Conflicting Workflows**
Two workflows doing the same thing differently:
- `release.yml` - broken (Linux commands)
- `deploy-installer.yml` - works but deploys to wrong location

### 6. **GitHub Pages Overwrite Issue**
`deploy-installer.yml` line 54:
```yaml
publish_dir: ./electron-app/dist
```
This OVERWRITES entire GitHub Pages site with only installer files, breaking the web version.

### 7. **Footer Design Issues**
User feedback: Download section is inconvenient and ugly.

## Required Fixes

### Step 1: Fix `electron-app/package.json`

Update the build configuration:

```json
{
  "name": "chemical-assistant-wallpaper",
  "version": "1.0.0",
  "description": "Interactive Periodic Table with Windows wallpaper capability",
  "main": "electron/main.js",
  "scripts": {
    "start": "electron .",
    "electron": "electron .",
    "dev": "set NODE_ENV=development && electron .",
    "build": "electron-builder",
    "build:win": "electron-builder --win"
  },
  "keywords": ["chemistry", "periodic-table", "mendeleev", "wallpaper", "education", "electron"],
  "author": "Chemical Assistant Team",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/layfhaker/mendeleevtable.git"
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.1"
  },
  "build": {
    "appId": "com.chemistryassistant.wallpaper",
    "productName": "Chemical Assistant",
    "files": [
      "electron/**/*",
      "index.html",
      "css/**/*",
      "js/**/*",
      "img/**/*",
      "manifest.json",
      "sw.js"
    ],
    "directories": {
      "output": "dist",
      "buildResources": "build"
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        }
      ],
      "icon": "img/png2.png"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "Chemical Assistant",
      "artifactName": "ChemicalAssistant-Setup-${version}.exe"
    }
  }
}
```

### Step 2: Add Dynamic Download Link (JavaScript)

Create new file `js/download-link-updater.js`:

```javascript
/**
 * Updates download button link to point to latest GitHub release
 */
async function updateDownloadLink() {
    const downloadBtn = document.getElementById('download-app-btn');
    
    if (!downloadBtn) {
        console.log('[Download] Button not found, skipping update');
        return;
    }

    try {
        console.log('[Download] Fetching latest release info...');
        const response = await fetch('https://api.github.com/repos/layfhaker/mendeleevtable/releases/latest');
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('[Download] Latest release:', data.tag_name);

        // Find the .exe installer file
        const exeAsset = data.assets.find(asset => 
            asset.name.endsWith('.exe') && 
            !asset.name.includes('Portable')
        );

        if (exeAsset) {
            downloadBtn.href = exeAsset.browser_download_url;
            console.log('[Download] Link updated:', exeAsset.name);
            
            // Update version display
            const versionSpan = document.querySelector('.download-details span:first-child');
            if (versionSpan) {
                versionSpan.textContent = `Версия ${data.tag_name.replace('v', '')}`;
            }
            
            // Update file size
            const sizeSpan = document.querySelector('.download-details span:last-child');
            if (sizeSpan) {
                const sizeMB = (exeAsset.size / (1024 * 1024)).toFixed(1);
                sizeSpan.textContent = `~${sizeMB} МБ`;
            }
        } else {
            console.warn('[Download] No .exe file found in latest release');
        }
    } catch (error) {
        console.error('[Download] Failed to update link:', error);
        // Keep default link as fallback
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateDownloadLink);
} else {
    updateDownloadLink();
}
```

Then add this script to `index.html` before closing `</body>` tag:

```html
<script src="js/download-link-updater.js"></script>
```

### Step 3: Create New Unified Workflow

**Delete both** `.github/workflows/release.yml` and `.github/workflows/deploy-installer.yml`

**Create** `.github/workflows/build-and-release.yml`:

```yaml
name: Build and Release

on:
  push:
    branches:
      - main
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build-electron:
    name: Build Electron App
    runs-on: windows-latest
    permissions:
      contents: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: electron-app/package-lock.json

      - name: Copy project files to electron-app
        shell: powershell
        run: |
          Write-Host "Creating directories..."
          New-Item -ItemType Directory -Path "electron-app\css" -Force | Out-Null
          New-Item -ItemType Directory -Path "electron-app\js" -Force | Out-Null
          New-Item -ItemType Directory -Path "electron-app\img" -Force | Out-Null
          
          Write-Host "Copying files..."
          Copy-Item -Path "css\*" -Destination "electron-app\css" -Recurse -Force
          Copy-Item -Path "js\*" -Destination "electron-app\js" -Recurse -Force
          Copy-Item -Path "img\*" -Destination "electron-app\img" -Recurse -Force
          Copy-Item -Path "index.html" -Destination "electron-app\" -Force
          Copy-Item -Path "manifest.json" -Destination "electron-app\" -Force
          Copy-Item -Path "sw.js" -Destination "electron-app\" -Force
          
          Write-Host "Files copied successfully"

      - name: Install dependencies
        working-directory: electron-app
        run: npm ci

      - name: Build Windows installer
        working-directory: electron-app
        run: npm run build:win
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: List build artifacts
        shell: powershell
        run: |
          Write-Host "Build artifacts:"
          Get-ChildItem -Path "electron-app\dist" -Recurse | Select-Object Name, Length

      - name: Determine version
        id: version
        shell: bash
        run: |
          if [[ "${{ github.ref }}" == refs/tags/v* ]]; then
            VERSION="${GITHUB_REF#refs/tags/v}"
            IS_PRERELEASE=false
          else
            VERSION="nightly-$(date +'%Y%m%d-%H%M%S')"
            IS_PRERELEASE=true
          fi
          echo "version=${VERSION}" >> $GITHUB_OUTPUT
          echo "is_prerelease=${IS_PRERELEASE}" >> $GITHUB_OUTPUT
          echo "tag=v${VERSION}" >> $GITHUB_OUTPUT

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: |
            electron-app/dist/*.exe
          tag_name: ${{ steps.version.outputs.tag }}
          name: Release ${{ steps.version.outputs.version }}
          draft: false
          prerelease: ${{ steps.version.outputs.is_prerelease }}
          body: |
            ## 🧪 Химический Ассистент v${{ steps.version.outputs.version }}
            
            ### 📥 Установка
            Скачайте `.exe` файл и запустите установку.
            
            ### ✨ Возможности
            - 🔬 Интерактивная таблица Менделеева (118 элементов)
            - 🧪 Таблица растворимости (384 соединения)
            - 🧮 Калькулятор молярной массы
            - 🖼️ Установка обоев рабочего стола Windows
            - 🎨 Тёмная тема
            - 📱 PWA-версия
            
            ### 📋 Системные требования
            - Windows 10/11 (64-bit)
            - ~100 МБ свободного места
            
            ---
            
            **Commit:** ${{ github.sha }}
            **Build date:** $(date -u +'%Y-%m-%d %H:%M:%S UTC')
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Step 4: Improve Footer Design

Update `css/footer.css`:

```css
/* =========================================
   FOOTER.CSS — Download section styling
   ========================================= */

.download-app-section {
    margin: 80px auto 60px;
    padding: 0 20px;
    max-width: 800px;
}

.download-card {
    background: linear-gradient(135deg, 
        rgba(102, 126, 234, 0.08) 0%, 
        rgba(118, 75, 162, 0.08) 100%);
    border: 2px solid rgba(102, 126, 234, 0.2);
    border-radius: 24px;
    padding: 48px 40px;
    text-align: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.download-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
        rgba(102, 126, 234, 0.05) 0%, 
        rgba(118, 75, 162, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
}

.download-card:hover {
    transform: translateY(-8px);
    border-color: rgba(102, 126, 234, 0.4);
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15);
}

.download-card:hover::before {
    opacity: 1;
}

.download-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
}

.download-card:hover .download-icon {
    transform: scale(1.05) rotate(5deg);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
}

.download-icon svg {
    width: 40px;
    height: 40px;
    color: white;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.download-card h3 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
}

.download-card > p {
    color: var(--text-secondary);
    font-size: 16px;
    line-height: 1.7;
    margin-bottom: 32px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

.download-btn-large {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 18px 48px;
    border-radius: 14px;
    text-decoration: none;
    font-size: 18px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    position: relative;
    overflow: hidden;
}

.download-btn-large::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.2), 
        transparent);
    transition: left 0.5s ease;
}

.download-btn-large:hover::before {
    left: 100%;
}

.download-btn-large:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 36px rgba(102, 126, 234, 0.5);
}

.download-btn-large:active {
    transform: translateY(0) scale(0.98);
}

.download-btn-large svg {
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;
}

.download-btn-large:hover svg {
    transform: translateY(2px);
}

.download-details {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
    font-size: 14px;
    color: var(--text-secondary);
    flex-wrap: wrap;
}

.download-details span {
    opacity: 0.9;
    transition: opacity 0.3s ease;
}

.download-details span:nth-child(even) {
    opacity: 0.4;
}

.download-links {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.download-links a {
    color: #667eea;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.download-links a:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #764ba2;
}

.download-links span {
    color: var(--text-secondary);
    opacity: 0.3;
}

/* Dark theme */
body.dark-theme .download-card {
    background: linear-gradient(135deg, 
        rgba(102, 126, 234, 0.12) 0%, 
        rgba(118, 75, 162, 0.12) 100%);
    border-color: rgba(102, 126, 234, 0.3);
}

body.dark-theme .download-card:hover {
    border-color: rgba(102, 126, 234, 0.5);
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
}

/* Mobile responsive */
@media (max-width: 768px) {
    .download-app-section {
        margin: 60px auto 40px;
        padding: 0 16px;
    }

    .download-card {
        padding: 40px 24px;
        border-radius: 20px;
    }

    .download-icon {
        width: 70px;
        height: 70px;
    }

    .download-icon svg {
        width: 35px;
        height: 35px;
    }

    .download-card h3 {
        font-size: 24px;
    }

    .download-card > p {
        font-size: 15px;
    }

    .download-btn-large {
        width: 100%;
        justify-content: center;
        padding: 16px 32px;
        font-size: 17px;
    }

    .download-details {
        flex-direction: column;
        gap: 8px;
    }

    .download-details span:nth-child(even) {
        display: none;
    }

    .download-links {
        flex-direction: column;
        gap: 4px;
    }

    .download-links span {
        display: none;
    }
}

/* Hide in Electron app */
body.electron-app .download-app-section {
    display: none;
}
```

### Step 5: Update HTML Download Section

Update the download section in `index.html` (around line 663):

```html
<!-- Download section -->
<div class="download-app-section">
    <div class="download-card">
        <div class="download-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
        </div>
        <h3>Десктопная версия для Windows</h3>
        <p>Скачайте полнофункциональное приложение с возможностью установки обоев рабочего стола</p>
        <a href="https://github.com/layfhaker/mendeleevtable/releases/latest"
           class="download-btn-large"
           id="download-app-btn"
           target="_blank"
           rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Скачать для Windows
        </a>
        <div class="download-details">
            <span>Версия 1.0.0</span>
            <span>•</span>
            <span>Windows 10/11</span>
            <span>•</span>
            <span>~100 МБ</span>
        </div>
        <div class="download-links">
            <a href="https://github.com/layfhaker/mendeleevtable/releases" target="_blank" rel="noopener">Все релизы</a>
            <span>|</span>
            <a href="https://github.com/layfhaker/mendeleevtable" target="_blank" rel="noopener">GitHub</a>
        </div>
    </div>
</div>
```

## Summary of Changes

**Files to modify:**
1. `electron-app/package.json` - Fix paths and add artifactName
2. `css/footer.css` - Improve design
3. `index.html` - Update download section HTML
4. Create `js/download-link-updater.js` - Dynamic link fetcher
5. Delete `.github/workflows/release.yml`
6. Delete `.github/workflows/deploy-installer.yml`
7. Create `.github/workflows/build-and-release.yml` - Unified workflow

**Expected results:**
- ✅ Electron app builds correctly with all files included
- ✅ No white screen - app loads properly
- ✅ Download link automatically points to latest release
- ✅ Professional, modern download section design
- ✅ Single unified workflow that works correctly
- ✅ Proper versioning and release notes

Please apply these changes and test the build process.
