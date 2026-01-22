const { execFileSync } = require('child_process');

function isWaylandSession() {
  return process.env.XDG_SESSION_TYPE === 'wayland' || !!process.env.WAYLAND_DISPLAY;
}

function hasBinary(name) {
  try {
    execFileSync('which', [name], { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function getWindowIdHex(window) {
  const handle = window.getNativeWindowHandle();
  let wid;
  if (handle.length >= 8) {
    wid = handle.readBigUInt64LE(0);
  } else {
    wid = BigInt(handle.readUInt32LE(0));
  }
  return `0x${wid.toString(16)}`;
}

function ensureSupported() {
  if (isWaylandSession()) {
    throw new Error('Wayland is not supported for live wallpaper yet.');
  }
  if (!hasBinary('xprop')) {
    throw new Error('Missing dependency: xprop (install package x11-utils).');
  }
}

function setWallpaperProperties(window) {
  const widHex = getWindowIdHex(window);
  execFileSync('xprop', [
    '-id',
    widHex,
    '-f',
    '_NET_WM_WINDOW_TYPE',
    '32a',
    '-set',
    '_NET_WM_WINDOW_TYPE',
    '_NET_WM_WINDOW_TYPE_DESKTOP'
  ]);
  execFileSync('xprop', [
    '-id',
    widHex,
    '-f',
    '_NET_WM_STATE',
    '32a',
    '-set',
    '_NET_WM_STATE',
    '_NET_WM_STATE_BELOW,_NET_WM_STATE_STICKY,_NET_WM_STATE_SKIP_TASKBAR,_NET_WM_STATE_SKIP_PAGER'
  ]);
}

function clearWallpaperProperties(window) {
  const widHex = getWindowIdHex(window);
  execFileSync('xprop', ['-id', widHex, '-remove', '_NET_WM_STATE']);
  execFileSync('xprop', [
    '-id',
    widHex,
    '-f',
    '_NET_WM_WINDOW_TYPE',
    '32a',
    '-set',
    '_NET_WM_WINDOW_TYPE',
    '_NET_WM_WINDOW_TYPE_NORMAL'
  ]);
}

async function attach(window) {
  ensureSupported();
  window.setAlwaysOnTop(false);
  window.setFullScreen(true);
  window.setSkipTaskbar(true);
  window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  setWallpaperProperties(window);
}

async function detach(window) {
  try {
    clearWallpaperProperties(window);
  } catch (error) {
    // Best effort cleanup; don't block shutdown.
  }
  window.setSkipTaskbar(false);
  window.setVisibleOnAllWorkspaces(false);
  window.setFullScreen(false);
}

function reset(window) {
  return detach(window);
}

module.exports = {
  attach,
  detach,
  reset
};
