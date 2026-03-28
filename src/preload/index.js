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
deletePhase: (projet_id , phaseId) => ipcRenderer.invoke('phase-delete', projet_id , phaseId),
  
//   // Dependencies - CRUD complet
createDependency: (data) => ipcRenderer.invoke('dependency-create', data),
getDependencies: () => ipcRenderer.invoke('dependency-list'),
getDependenciesByProject: (projectId) => ipcRenderer.invoke('dependency-project', projectId),
deleteDependency: (id) => ipcRenderer.invoke('dependency-delete', id),


//   // Jalons - CRUD complet 
createJalon: (jalonData) => ipcRenderer.invoke('create-jalon', jalonData),
getJalons: () => ipcRenderer.invoke('get-jalons'),
updateJalon: (jalon_id, jalonData) => ipcRenderer.invoke("update-jalon", jalon_id, jalonData),
deletejalon: (jalon_id) => ipcRenderer.invoke('jalon-delete', jalon_id),

  
//     // Membres - CRUD complet 
createMembre: (memberData) => ipcRenderer.invoke('membre-create', memberData),
getAllMembres: (projet_id) => ipcRenderer.invoke('get-membres' , projet_id),
getMembreById: (membre_id) => ipcRenderer.invoke("membre-getById", membre_id),
updateMembre: (projet_id, memberData) => ipcRenderer.invoke("membre-update", projet_id, memberData),
deleteMembre: (projet_id, membre_id) => ipcRenderer.invoke('membre-delete', projet_id , membre_id),

//   // BUDGET - CRUD complet 
loadBudgets: (project_id) => ipcRenderer.invoke('get-AllBudgets', project_id),
convertionBudget: (projet_id, budgetData) => ipcRenderer.invoke('convertion-budget', projet_id, budgetData),
configureBudget: (projet_id , budgetData) => ipcRenderer.invoke('configure-budget',  projet_id ,budgetData),
 
//   // MATERIELS - CRUD complet 
loadAllMateriels: (projet_id) => ipcRenderer.invoke('get-AllMateriels', projet_id),
createMateriel: (materielData) => ipcRenderer.invoke('ajouter-materiel', materielData),


  
 
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