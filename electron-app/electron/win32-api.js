/**
 * Windows API Bindings for Live Wallpaper
 * Uses PowerShell and child_process to interact with Windows desktop
 * No native dependencies required!
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Execute PowerShell script from temp file
 */
function runPowerShellScript(script) {
    const tempFile = path.join(os.tmpdir(), `wallpaper-script-${Date.now()}.ps1`);

    try {
        // Write script to temp file with BOM for UTF-8
        fs.writeFileSync(tempFile, '\ufeff' + script, 'utf8');

        // Execute script
        const result = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${tempFile}"`, {
            encoding: 'utf8',
            windowsHide: true,
            timeout: 15000
        });

        return result.trim();
    } catch (error) {
        console.error('[Win32] PowerShell error:', error.message);
        if (error.stdout) console.error('[Win32] stdout:', error.stdout);
        if (error.stderr) console.error('[Win32] stderr:', error.stderr);
        return null;
    } finally {
        // Cleanup temp file
        try {
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
        } catch (e) {
            // Ignore cleanup errors
        }
    }
}

/**
 * Find the Progman window handle
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
        const result = runPowerShellScript(script);
        const handle = parseInt(result, 10);
        console.log('[Win32] Progman handle:', handle);
        return handle;
    } catch (error) {
        console.error('[Win32] Error finding Progman:', error);
        return 0;
    }
}

/**
 * Send message to spawn WorkerW and find the correct one for wallpaper
 * Uses CSC for faster execution
 */
function findWorkerW() {
    const csCode = `
using System;
using System.Runtime.InteropServices;
using System.Text;

class W {
    [DllImport("user32.dll")] static extern IntPtr FindWindow(string c, string w);
    [DllImport("user32.dll")] static extern IntPtr FindWindowEx(IntPtr p, IntPtr a, string c, string w);
    [DllImport("user32.dll")] static extern IntPtr SendMessageTimeout(IntPtr h, uint m, UIntPtr w, IntPtr l, uint f, uint t, out IntPtr r);
    delegate bool EP(IntPtr h, IntPtr l);
    [DllImport("user32.dll")] static extern bool EnumWindows(EP e, IntPtr l);
    [DllImport("user32.dll")] static extern int GetClassName(IntPtr h, StringBuilder s, int n);

    static IntPtr workerW = IntPtr.Zero;

    static void Main() {
        IntPtr progman = FindWindow("Progman", null);
        if (progman == IntPtr.Zero) { Console.WriteLine("0"); return; }

        // Send 0x052C to create WorkerW
        IntPtr r;
        SendMessageTimeout(progman, 0x052C, UIntPtr.Zero, IntPtr.Zero, 0, 1000, out r);
        System.Threading.Thread.Sleep(100);

        // Find WorkerW that contains SHELLDLL_DefView
        EnumWindows((h, l) => {
            StringBuilder cn = new StringBuilder(256);
            GetClassName(h, cn, 256);
            if (cn.ToString() == "WorkerW") {
                IntPtr sv = FindWindowEx(h, IntPtr.Zero, "SHELLDLL_DefView", null);
                if (sv != IntPtr.Zero) {
                    // Found! Get the NEXT WorkerW (empty one behind icons)
                    workerW = FindWindowEx(IntPtr.Zero, h, "WorkerW", null);
                    return false;
                }
            }
            return true;
        }, IntPtr.Zero);

        // If found empty WorkerW, use it
        if (workerW != IntPtr.Zero) {
            Console.WriteLine(workerW.ToInt64());
            return;
        }

        // Fallback: check if SHELLDLL_DefView is under Progman
        IntPtr dv = FindWindowEx(progman, IntPtr.Zero, "SHELLDLL_DefView", null);
        if (dv != IntPtr.Zero) {
            // Windows 11 style - find any WorkerW
            EnumWindows((h, l) => {
                StringBuilder cn = new StringBuilder(256);
                GetClassName(h, cn, 256);
                if (cn.ToString() == "WorkerW") {
                    workerW = h;
                    return false;
                }
                return true;
            }, IntPtr.Zero);

            if (workerW != IntPtr.Zero) {
                Console.WriteLine(workerW.ToInt64());
                return;
            }
        }

        // Last resort: use Progman
        Console.WriteLine(progman.ToInt64());
    }
}`;

    const tempDir = os.tmpdir();
    const csFile = path.join(tempDir, 'fw.cs');
    const exeFile = path.join(tempDir, 'fw.exe');

    try {
        fs.writeFileSync(csFile, csCode, 'utf8');

        const cscPath = fs.existsSync('C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe')
            ? 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe'
            : 'C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe';

        const compileResult = spawnSync(cscPath, ['/nologo', '/optimize', `/out:${exeFile}`, csFile], {
            encoding: 'utf8',
            windowsHide: true,
            timeout: 10000
        });

        if (compileResult.status !== 0) {
            console.error('[Win32] CSC compile error:', compileResult.stderr);
            // Fallback to PowerShell
            return findWorkerWPowerShell();
        }

        const runResult = spawnSync(exeFile, [], {
            encoding: 'utf8',
            windowsHide: true,
            timeout: 5000
        });

        const handle = parseInt(runResult.stdout.trim(), 10);
        console.log('[Win32] Desktop handle (CSC):', handle);

        if (!handle || handle === 0) {
            throw new Error('Desktop window not found');
        }

        return handle;

    } catch (error) {
        console.error('[Win32] Error finding desktop window:', error);
        return findWorkerWPowerShell();
    } finally {
        try { fs.unlinkSync(csFile); } catch(e) {}
        try { fs.unlinkSync(exeFile); } catch(e) {}
    }
}

/**
 * PowerShell fallback for finding WorkerW
 */
function findWorkerWPowerShell() {
    try {
        const script = `
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public class WF {
    [DllImport("user32.dll")] public static extern IntPtr FindWindow(string c, string w);
    [DllImport("user32.dll")] public static extern IntPtr SendMessageTimeout(IntPtr h, uint m, UIntPtr w, IntPtr l, uint f, uint t, out IntPtr r);
}
'@
$p = [WF]::FindWindow("Progman", $null)
$r = [IntPtr]::Zero
[WF]::SendMessageTimeout($p, 0x052C, [UIntPtr]::Zero, [IntPtr]::Zero, 0, 1000, [ref]$r)
Write-Output $p.ToInt64()
`;
        const result = runPowerShellScript(script);
        const handle = parseInt(result, 10);
        console.log('[Win32] Desktop handle (PS fallback):', handle);
        return handle || 0;
    } catch (error) {
        console.error('[Win32] PowerShell fallback error:', error);
        return 0;
    }
}

/**
 * Set window parent using C# script compiled with csc.exe (faster than PowerShell Add-Type)
 */
function setParent(childHandle, parentHandle) {
    // Method 1: Try using csc.exe directly (much faster)
    const cscResult = trySetParentViaCsc(childHandle, parentHandle);
    if (cscResult !== null) {
        return cscResult;
    }

    // Method 2: Try PowerShell as fallback
    console.log('[Win32] CSC failed, trying PowerShell...');
    return trySetParentViaPowerShell(childHandle, parentHandle);
}

function trySetParentViaCsc(childHandle, parentHandle) {
    const csCode = `
using System;
using System.Runtime.InteropServices;
class P {
    [DllImport("user32.dll", SetLastError = true)]
    static extern IntPtr SetParent(IntPtr hWndChild, IntPtr hWndNewParent);
    static void Main() {
        try {
            IntPtr result = SetParent(new IntPtr(${childHandle}), new IntPtr(${parentHandle}));
            Console.WriteLine(result.ToInt64());
        } catch (Exception e) {
            Console.WriteLine("ERROR:" + e.Message);
        }
    }
}`;

    const tempDir = os.tmpdir();
    const csFile = path.join(tempDir, 'sp.cs');
    const exeFile = path.join(tempDir, 'sp.exe');

    try {
        fs.writeFileSync(csFile, csCode, 'utf8');

        // Find csc.exe
        const frameworkPath = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';
        const frameworkPath32 = 'C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe';

        let cscPath = fs.existsSync(frameworkPath) ? frameworkPath : frameworkPath32;

        if (!fs.existsSync(cscPath)) {
            console.log('[Win32] CSC not found');
            return null;
        }

        // Compile
        const compileResult = spawnSync(cscPath, ['/nologo', '/optimize', `/out:${exeFile}`, csFile], {
            encoding: 'utf8',
            windowsHide: true,
            timeout: 10000
        });

        if (compileResult.status !== 0) {
            console.log('[Win32] CSC compile error:', compileResult.stderr);
            return null;
        }

        // Run
        const runResult = spawnSync(exeFile, [], {
            encoding: 'utf8',
            windowsHide: true,
            timeout: 5000
        });

        const output = runResult.stdout.trim();
        console.log('[Win32] SetParent output:', output);

        if (output.startsWith('ERROR:')) {
            console.error('[Win32] SetParent error:', output);
            return null;
        }

        const result = parseInt(output, 10);
        console.log('[Win32] SetParent result (CSC):', result);
        return isNaN(result) ? null : result;

    } catch (error) {
        console.error('[Win32] CSC method error:', error.message);
        return null;
    } finally {
        try { fs.unlinkSync(csFile); } catch(e) {}
        try { fs.unlinkSync(exeFile); } catch(e) {}
    }
}

function trySetParentViaPowerShell(childHandle, parentHandle) {
    const scriptContent = `
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class WinAPI {
    [DllImport("user32.dll")]
    public static extern IntPtr SetParent(IntPtr hWndChild, IntPtr hWndNewParent);
}
"@
[WinAPI]::SetParent([IntPtr]::new(${childHandle}), [IntPtr]::new(${parentHandle})).ToInt64()
`;

    const tempFile = path.join(os.tmpdir(), 'setparent.ps1');

    try {
        fs.writeFileSync(tempFile, scriptContent, 'utf8');

        const result = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', tempFile], {
            encoding: 'utf8',
            windowsHide: true,
            timeout: 30000
        });

        if (result.status === 0) {
            const value = parseInt(result.stdout.trim(), 10);
            console.log('[Win32] SetParent result (PS):', value);
            return value;
        } else {
            console.error('[Win32] PowerShell error:', result.stderr);
            return 0;
        }
    } catch (error) {
        console.error('[Win32] PowerShell error:', error.message);
        return 0;
    } finally {
        try { fs.unlinkSync(tempFile); } catch(e) {}
    }
}

/**
 * Set window position and size to fill parent
 */
function setWindowPosition(handle, x, y, width, height) {
    try {
        const script = `
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

public class User32Position {
    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);

    public static readonly IntPtr HWND_BOTTOM = new IntPtr(1);
    public const uint SWP_NOACTIVATE = 0x0010;
    public const uint SWP_SHOWWINDOW = 0x0040;
}
'@

$hwnd = [IntPtr]::new(${handle})

# Move and resize window
$result = [User32Position]::MoveWindow($hwnd, ${x}, ${y}, ${width}, ${height}, $true)
Write-Output $result
`;
        const result = runPowerShellScript(script);
        console.log('[Win32] SetWindowPosition result:', result);
        return result === 'True';
    } catch (error) {
        console.error('[Win32] Error in setWindowPosition:', error);
        return false;
    }
}

module.exports = {
    findProgman,
    findWorkerW,
    setParent,
    setWindowPosition
};
