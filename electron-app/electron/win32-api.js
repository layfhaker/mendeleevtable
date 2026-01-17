/**
 * Windows API Bindings for Live Wallpaper
 * Uses C#, PowerShell and child_process to interact with Windows desktop
 */

const { execSync, spawnSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Debug logger
function log(msg) {
    try {
        const logFile = path.join(process.cwd(), 'debug_wp.txt');
        fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
    } catch (e) { }
}

/**
 * Consolidated Wallpaper Setup: Finding WorkerW, Reparenting, and Positioning
 * all in one C# execution for maximum reliability.
 */
async function attachToWallpaper(childHandle, width, height) {
    log(`attachToWallpaper called: Child=${childHandle}, Size=${width}x${height}`);

    // C# source code for window attachment
    const csCode = `
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

class P {
    [DllImport("user32.dll")] static extern IntPtr FindWindow(string c, string w);
    [DllImport("user32.dll")] static extern IntPtr FindWindowEx(IntPtr p, IntPtr a, string c, string w);
    [DllImport("user32.dll")] static extern IntPtr SendMessageTimeout(IntPtr h, uint m, UIntPtr w, IntPtr l, uint f, uint t, out IntPtr r);
    [DllImport("user32.dll")] static extern bool EnumWindows(EP e, IntPtr l);
    [DllImport("user32.dll")] static extern int GetClassName(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll", SetLastError = true)] static extern IntPtr SetParent(IntPtr c, IntPtr p);
    [DllImport("user32.dll")] static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int cx, int cy, uint f);
    [DllImport("user32.dll")] static extern bool ShowWindow(IntPtr h, int c);
    [DllImport("user32.dll")] static extern int SetWindowLong(IntPtr h, int i, int v);
    [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll")] static extern bool GetClientRect(IntPtr h, out RECT r);

    delegate bool EP(IntPtr h, IntPtr l);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }

    static void Main() {
        try {
            IntPtr progman = FindWindow("Progman", null);
            if (progman == IntPtr.Zero) return;

            // Trigger WorkerW
            IntPtr result;
            SendMessageTimeout(progman, 0x052C, UIntPtr.Zero, IntPtr.Zero, 0, 1000, out result);
            Thread.Sleep(500);

            IntPtr wallpaperWorkerW = IntPtr.Zero;
            EnumWindows(new EP((h, l) => {
                StringBuilder sb = new StringBuilder(256);
                GetClassName(h, sb, 256);
                if (sb.ToString() == "WorkerW") {
                    if (FindWindowEx(h, IntPtr.Zero, "SHELLDLL_DefView", null) == IntPtr.Zero) {
                        wallpaperWorkerW = h;
                    }
                }
                return true;
            }), IntPtr.Zero);

            IntPtr target = (wallpaperWorkerW != IntPtr.Zero) ? wallpaperWorkerW : progman;
            
            long hVal = long.Parse("${childHandle}");
            IntPtr child = new IntPtr(hVal);
            
            // WS_CHILD | WS_VISIBLE | WS_CLIPSIBLINGS
            SetWindowLong(child, -16, 0x40000000 | 0x10000000 | 0x04000000);
            SetParent(child, target);

            RECT rect;
            GetClientRect(target, out rect);
            int w = rect.Right - rect.Left;
            int h = rect.Bottom - rect.Top;
            if (w <= 0) { w = ${width}; h = ${height}; }

            // HWND_BOTTOM (1)
            SetWindowPos(child, new IntPtr(1), 0, 0, w, h, 0x0040 | 0x0010);
            ShowWindow(child, 5);

            Console.WriteLine("SUCCESS:" + target.ToInt64());
        } catch (Exception e) {
            Console.WriteLine("ERR:" + e.Message);
        }
    }
}
`;

    const tempDir = os.tmpdir();
    const csFile = path.join(tempDir, `att-${Date.now()}.cs`);
    const exeFile = path.join(tempDir, `att-${Date.now()}.exe`);

    return new Promise((resolve) => {
        try {
            fs.writeFileSync(csFile, csCode, 'utf8');
            const cscPath = fs.existsSync('C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe')
                ? 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe'
                : 'C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe';

            if (!fs.existsSync(cscPath)) {
                log('CSC not found');
                resolve(null);
                return;
            }

            const compileResult = spawnSync(cscPath, ['/nologo', '/optimize', `/out:${exeFile}`, csFile], { windowsHide: true });
            if (compileResult.status !== 0) {
                log('CSC compilation failed: ' + compileResult.stderr.toString());
                resolve(null);
                return;
            }

            const childProc = spawn(exeFile, [], { windowsHide: true });
            let output = '';
            childProc.stdout.on('data', (data) => output += data.toString());
            childProc.on('close', (code) => {
                log('attachToWallpaper exit ' + code + ' output: ' + output.trim());
                try { fs.unlinkSync(csFile); } catch (e) { }
                setTimeout(() => { try { fs.unlinkSync(exeFile); } catch (e) { } }, 5000);

                if (output.includes('SUCCESS')) {
                    const hStr = output.split('SUCCESS:')[1].trim().split(/[\r\n]+/)[0];
                    resolve(parseInt(hStr, 10));
                } else {
                    resolve(null);
                }
            });
        } catch (e) {
            log('attachToWallpaper error: ' + e.message);
            resolve(null);
        }
    });
}

/**
 * Capture a screenshot of the current desktop (with icons)
 * to be used as a background overlay.
 */
async function getDesktopScreenshot(outputPath) {
    log(`Capturing desktop to ${outputPath}`);
    try {
        const script = `
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$Screen = [System.Windows.Forms.Screen]::PrimaryScreen
$Width  = $Screen.Bounds.Width
$Height = $Screen.Bounds.Height
$Left   = $Screen.Bounds.Left
$Top    = $Screen.Bounds.Top
$Bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
$Graphic = [System.Drawing.Graphics]::FromImage($Bitmap)
$Graphic.CopyFromScreen($Left, $Top, 0, 0, $Bitmap.Size)
$Bitmap.Save("${outputPath.replace(/\\/g, '\\\\')}", [System.Drawing.Imaging.ImageFormat]::Png)
$Graphic.Dispose()
$Bitmap.Dispose()
`;
        const tempFile = path.join(os.tmpdir(), `cap-${Date.now()}.ps1`);
        fs.writeFileSync(tempFile, '\ufeff' + script, 'utf8');

        return new Promise((resolve) => {
            const ps = spawn('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', tempFile], { windowsHide: true });
            ps.on('close', (code) => {
                try { fs.unlinkSync(tempFile); } catch (e) { }
                log(`Capture finished with code ${code}`);
                resolve(code === 0);
            });
        });
    } catch (e) {
        log('Capture error: ' + e.message);
        return false;
    }
}

/**
 * Legacy support for finding Progman
 */
function findProgman() {
    try {
        const script = `
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public class User32Progman {
    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
}
'@
$handle = [User32Progman]::FindWindow("Progman", $null)
Write-Output $handle.ToInt64()
`;
        const tempFile = path.join(os.tmpdir(), `prog-${Date.now()}.ps1`);
        fs.writeFileSync(tempFile, '\ufeff' + script, 'utf8');
        const result = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${tempFile}"`, { encoding: 'utf8', windowsHide: true });
        try { fs.unlinkSync(tempFile); } catch (e) { }
        return parseInt(result, 10);
    } catch (e) { return 0; }
}

/**
 * Refresh desktop icons
 */
function refreshDesktop() {
    try {
        const script = `
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public class User32 {
    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SystemParametersInfo(uint uiAction, uint uiParam, IntPtr pvParam, uint fWinIni);
}
'@
[User32]::SystemParametersInfo(20, 0, [IntPtr]::Zero, 3)
`;
        const tempFile = path.join(os.tmpdir(), `ref-${Date.now()}.ps1`);
        fs.writeFileSync(tempFile, script, 'utf8');
        spawn('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', tempFile], { detached: true, windowsHide: true }).unref();
        setTimeout(() => { try { fs.unlinkSync(tempFile); } catch (e) { } }, 5000);
        return true;
    } catch (e) { return false; }
}

module.exports = {
    attachToWallpaper,
    findProgman,
    refreshDesktop
};
