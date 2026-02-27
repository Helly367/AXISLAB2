import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'


const api = {
  direBonjour: (name) => {
    return ipcRenderer.invoke("direBonjour", name)
  },
  
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
   
  } catch (error) {
    console.error('🔴 Erreur exposition:', error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}