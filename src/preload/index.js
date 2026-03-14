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


  // Jalons - CRUD complet 
createJalon: (jalonData) => ipcRenderer.invoke('create-jalon', jalonData),
getJalons: () => ipcRenderer.invoke('get-jalons'),
updateJalon: (jalon_id, jalonData) => ipcRenderer.invoke("update-jalon", jalon_id, jalonData),
deletejalon: (jalon_id) => ipcRenderer.invoke('jalon-delete', jalon_id),

  
    // Membres - CRUD complet 
createMembre: (memberData) => ipcRenderer.invoke('membre-create', memberData),
getAllMembres: () => ipcRenderer.invoke('get-membres'),
getMembreById: (membre_id) => ipcRenderer.invoke("membre-getById", membre_id),
updateMembre: (membre_id, memberData) => ipcRenderer.invoke("membre-update", membre_id, memberData),
deleteMembre: (membre_id) => ipcRenderer.invoke('membre-delete', membre_id),

  // BUDGET - CRUD complet 
  createGlobalBudget: (budgetData) => ipcRenderer.invoke('global-budget-create', budgetData),
 

  
 
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