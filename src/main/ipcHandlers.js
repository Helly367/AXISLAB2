import { ipcMain } from 'electron';
import {getAllProjects, getProjectById,createProject,updateProject,deleteProject} from './handlers/projectHandlers.js';
import { createPhase, updatePhase, getAllPhases, getPhaseById,deletePhase } from './handlers/phaseHandlers.js';
import {createMember,updateMember,getAllMembers,getMemberById,deleteMember} from "./handlers/membreHandlers.js";
import {minimizeWindow,maximizeWindow,closeWindow} from './handlers/windowHandlers.js';

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

  ipcMain.handle("phase-update", async (_, { id, data }) => {
    return await updatePhase(id, data);
  });

  ipcMain.handle("get-phases", async () => {
    return await getAllPhases();
  });

  ipcMain.handle("phase:getById", async (_, id) => {
    return await getPhaseById(id);
  });

  ipcMain.handle("phase:delete", async (_, id) => {
    return await deletePhase(id);
  });
  
  
   /* ===============================
     MEMBRES   HANDLERS
  =============================== */

  ipcMain.handle("member:create", (_, data) =>
      createMember(data)
  );

  ipcMain.handle("member:update", (_, { id, data }) =>
      updateMember(id, data)
  );

  ipcMain.handle("member:getAll", () =>
      getAllMembers()
  );

  ipcMain.handle("member:getById", (_, id) =>
      getMemberById(id)
  );

  ipcMain.handle("member:delete", (_, id) =>
      deleteMember(id)
  );

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
