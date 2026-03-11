import { ipcMain } from 'electron';
import {getAllProjects, getProjectById,createProject,updateProject,deleteProject} from './handlers/projectHandlers.js';
import { createPhase, updatePhase, getAllPhases, getPhaseById,deletePhase } from './handlers/phaseHandlers.js';
import { minimizeWindow, maximizeWindow, closeWindow } from './handlers/windowHandlers.js';
import { createDependency, getAllDependencies, getDependenciesByProject, deleteDependency } from './handlers/dependenciesHandlers.js';
// import { createMembre, updateMembre, getAllMembres, deleteMembre } from './handlers/membreHandlers.js';
import { createJalon , getAllJalons , updateJalon , deletejalon} from './handlers/jalonHandlers.js';

export function setupIpcHandlers() {

  /* ===============================
     PROJECT HANDLERS
  =============================== */

  ipcMain.handle('create-project', async (_, projectData) => {
    return await createProject(projectData);
  });

  ipcMain.handle('get-projects', async () => {
    return await getAllProjects();
  });

  ipcMain.handle('get-project-by-id', async (_, id) => {
    return await getProjectById(id);
  });

  ipcMain.handle('update-project', async (_, id, updateData) => {
    return await updateProject(id, updateData);
  });

  ipcMain.handle('delete-project', async (_, id) => {
    return await deleteProject(id);
  });

  /* ===============================
     PHASE HANDLERS
  =============================== */

  ipcMain.handle("create-phase", async (_, phaseData) => {
    return await createPhase(phaseData);
  });

  ipcMain.handle("phase-update", async (_, phaseId, updatePhaseData ) => {
    return await updatePhase(phaseId, updatePhaseData);
  });

  ipcMain.handle("get-phases", async () => {
    return await getAllPhases();
  });

  ipcMain.handle("phase:getById", async (_, id) => {
    return await getPhaseById(id);
  });

  ipcMain.handle("phase-delete", async (_, phaseId) => {
    return await deletePhase(phaseId);
  });
  
  

   /* ===============================
     DEPENDENCES   HANDLERS
  =============================== */
  ipcMain.handle("dependency-create", (_, data) =>
  createDependency(data)
);

ipcMain.handle("dependency-list", () =>
  getAllDependencies()
);

ipcMain.handle("dependency-project", (_, projectId) =>
  getDependenciesByProject(projectId)
);

ipcMain.handle("dependency-delete", (_, id) =>
  deleteDependency(id)
);
  
  
   /* ===============================
     Membres   HANDLERS
  =============================== */
  // ipcMain.handle("membre-create" , async (_, data) => {
  //   return await createMembre(data);
  // });

  // ipcMain.handle("membre-update", async (_, id, updateData) => {
  //   return await updateMembre(id, updateData);
  // });

  // ipcMain.handle("membre-get", async (_, id) => {
  //   return await getMembreById(id);
  // });

  // ipcMain.handle("membre-delete", async (_, id) => {
  //   return await deleteMembre(id);
  // });
  
  
    /* ===============================
     JALON HANDLERS
  =============================== */
  ipcMain.handle("create-jalon", async (_, jalonData) => {
    return await createJalon(jalonData);
  });
  
  ipcMain.handle("get-jalons", async () => {
    return await getAllJalons();
  });
  
  ipcMain.handle('update-jalon', async (_, jalon_id, jalonData) => {
    return await updateJalon(jalon_id, jalonData);
  });
  
  ipcMain.handle("jalon-delete", async (_, jalon_id) => {
    return await deletejalon(jalon_id);
  });
  
  

  /* ===============================
     WINDOW HANDLERS
  =============================== */

  ipcMain.on('window-minimize', minimizeWindow);
  ipcMain.on('window-maximize', maximizeWindow);
  ipcMain.on('window-close', closeWindow);

  /* ===============================
     TEST HANDLER
  =============================== */

  ipcMain.handle('direBonjour', async (_, name) => {
    return `Bonjour ${name}`;
  });
}
