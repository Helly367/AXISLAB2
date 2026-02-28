import { ipcMain } from 'electron';
import { 
  checkProjects,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from './handlers/projectHandlers.js';
import { 
  minimizeWindow, 
  maximizeWindow, 
  closeWindow 
} from './handlers/windowHandlers.js';
import db from './database/db.js';

export function setupIpcHandlers() {
    
  // Handlers projets
  ipcMain.handle('create-project', async (event, projectData) => {
    return await createProject(projectData);
  });
  
  ipcMain.handle('check-projects', async () => {
    return await checkProjects();
  });
  
  ipcMain.handle('get-projects', async () => {
    return await getAllProjects();
  });
  
  ipcMain.handle('get-project-by-id', async (event, id) => {
    return await getProjectById(id);
  });
  
  ipcMain.handle('update-project', async (event, id, updateData) => {
    return await updateProject(id, updateData);
  });
  
  ipcMain.handle('delete-project', async (event, id) => {
    return await deleteProject(id);
  });
  
  // Autres handlers
  ipcMain.handle('direBonjour', async (event, name) => {
    return `Bonjour ${name}`;
  });
    
  // Window controls
  ipcMain.on('window-minimize', minimizeWindow);
  ipcMain.on('window-maximize', maximizeWindow);
  ipcMain.on('window-close', closeWindow);
}