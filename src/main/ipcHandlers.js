import { ipcMain, BrowserWindow } from 'electron';

export function setupIpcHandlers() {
    
  ipcMain.handle('direBonjour', async (event, name) => {
    return `Bonjour ${name}`;
  });
    
  ipcMain.on('window-minimize', (event) => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) window.minimize();
  });

  ipcMain.on('window-maximize', (event) => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
  });

  ipcMain.on('window-close', (event) => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) window.close();
  });
}