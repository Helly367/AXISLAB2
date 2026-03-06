import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  // Window controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  
  // Projets - CRUD complet
  createProject: (projectData) => ipcRenderer.invoke('create-project', projectData),
  checkProjects: () => ipcRenderer.invoke('check-projects'),
  getProjects: () => ipcRenderer.invoke('get-projects'),
  getProjectById: (id) => ipcRenderer.invoke('get-project-by-id', id),
  updateProject: (id, updateData) => ipcRenderer.invoke('update-project', id, updateData),
  deleteProject: (id) => ipcRenderer.invoke('delete-project', id),
  

  // Phases - CRUD complet
  createPhase: (phaseData) => ipcRenderer.invoke('create-phase', phaseData),
  updatePhase: (id , phaseData) => ipcRenderer.invoke('phase-update', id, phaseData),
  getPhases: () => ipcRenderer.invoke('get-phases'),
  
 
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