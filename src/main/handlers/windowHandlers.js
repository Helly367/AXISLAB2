import { BrowserWindow } from 'electron';

export function minimizeWindow() {
  BrowserWindow.getFocusedWindow()?.minimize();
}

export function maximizeWindow() {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.isMaximized() ? win.unmaximize() : win.maximize();
}

export function closeWindow() {
  BrowserWindow.getFocusedWindow()?.close();
}