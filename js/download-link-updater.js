/**
 * Updates download button link to point to latest GitHub release
 */
async function updateDownloadLink() {
    const downloadBtn = document.getElementById('download-app-btn');
    const linuxBtn = document.getElementById('download-linux-btn');
    const linuxAppImage = document.getElementById('download-linux-appimage');
    const linuxDeb = document.getElementById('download-linux-deb');

    if (!downloadBtn && !linuxBtn && !linuxAppImage && !linuxDeb) {
        console.log('[Download] Button not found, skipping update');
        return;
    }

    try {
        console.log('[Download] Fetching latest release info...');
        const response = await fetch('https://api.github.com/repos/layfhaker/mendeleevtable/releases');

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const releases = await response.json();
        const data = releases[0]; // Get most recent release (includes pre-releases)
        if (!data) throw new Error('No releases found');
        console.log('[Download] Latest release:', data.tag_name);

        // Find the .exe installer file
        const exeAsset = data.assets.find(asset =>
            asset.name.toLowerCase().endsWith('.exe') &&
            !asset.name.includes('Portable')
        );
        const appImageAsset = data.assets.find(asset =>
            asset.name.toLowerCase().endsWith('.appimage')
        );
        const debAsset = data.assets.find(asset =>
            asset.name.toLowerCase().endsWith('.deb')
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

        if (appImageAsset && linuxBtn) {
            linuxBtn.href = appImageAsset.browser_download_url;
        }
        if (appImageAsset && linuxAppImage) {
            linuxAppImage.href = appImageAsset.browser_download_url;
        }
        if (debAsset && linuxDeb) {
            linuxDeb.href = debAsset.browser_download_url;
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
