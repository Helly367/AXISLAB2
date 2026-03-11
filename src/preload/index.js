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
  updatePhase: (phaseId , updatePhaseData) => ipcRenderer.invoke('phase-update', phaseId, updatePhaseData),
  getPhases: () => ipcRenderer.invoke('get-phases'),
  deletePhase: (phaseId) => ipcRenderer.invoke('phase-delete', phaseId),
  
  // Dependencies - CRUD complet
  createDependency: (data) => ipcRenderer.invoke('dependency-create', data),
  getDependencies: () => ipcRenderer.invoke('dependency-list'),
  getDependenciesByProject: (projectId) => ipcRenderer.invoke('dependency-project', projectId),
  deleteDependency: (id) => ipcRenderer.invoke('dependency-delete', id),
  
 // Membres - CRUD complet 
createMembre: (data) => ipcRenderer.invoke("membre-create", data),
getMembres: () => ipcRenderer.invoke("membre-list"),
getMembreById: (id) => ipcRenderer.invoke("membre-get", id),
updateMembre: (id, data) => ipcRenderer.invoke("membre-update", id, data),
deleteMembre: (id) => ipcRenderer.invoke("membre-delete", id) ,

  // Jalons - CRUD complet 
createJalon: (jalonData) => ipcRenderer.invoke('create-jalon', jalonData),
getJalons: () => ipcRenderer.invoke('get-jalons'),
updateJalon: (jalon_id, jalonData) => ipcRenderer.invoke("update-jalon", jalon_id, jalonData),
deletejalon: (jalon_id) => ipcRenderer.invoke('jalon-delete', jalon_id),

  
 
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