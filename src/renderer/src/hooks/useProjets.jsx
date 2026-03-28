import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import { alertService } from '../Services/alertService';

const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {

    const [projects, setProjects] = useState([]);
    const [project_id, setProjet_id] = useState(null);
    const [activeProject, setActiveProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* =========================
       LOAD PROJECTS
    ========================== */
    const loadProjects = useCallback(async () => {
        try {
            setLoading(true);

            const result = await window.api.getProjects();

            if (result.success) {
                setProjects(result.data || []);
                setError(null);
            } else {
                throw new Error(result.error);
            }

        } catch (err) {
            console.error("Erreur chargement projets:", err);
            setError("Impossible de charger les projets");
            alertService.error("Impossible de charger les projets");
        } finally {
            setLoading(false);
        }
    }, []);

    /* =========================
       INITIAL LOAD
    ========================== */
    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    /* =========================
       AUTO RESTORE ACTIVE PROJECT
    ========================== */
    useEffect(() => {
        if (projects.length === 0) return;

        const savedId = localStorage.getItem("activeProjectId");
        if (!savedId) return;

        const found = projects.find(p => p.projet_id === Number(savedId));
        if (found) {
            setActiveProject(found);
            setProjet_id(found)
        }

    }, [projects]);

    /* =========================
       CREATE PROJECT
    ========================== */
    const createProject = useCallback(async (projectData) => {
        try {
            const result = await window.api.createProject(projectData);

            if (!result.success) throw new Error(result.error);

            // Optimisation : on ajoute sans reload complet

            setProjects(prev => [...prev, result.data.newProject]);
            setActiveProject(result.data.newProject);

            localStorage.setItem("activeProjectId", result.data.projet_id);
            alertService.success("Projet créé avec succès !")

            return { success: true, data: result.data };

        } catch (err) {
            console.error("Erreur création:", err);
            alertService.handleBackendResponse(err.message || "Erreur lors de la création")
            return { success: false, error: err.message };
        }
    }, []);

    /* =========================
       UPDATE PROJECT
    ========================== */
    const updateProject = useCallback(async (projet_id, updateData) => {
        try {
            const result = await window.api.updateProject(projet_id, updateData);
            if (!result.success) return result;

            setProjects(prev =>
                prev.map(p => p.projet_id === projet_id ? { ...p, ...updateData } : p)
            );

            if (activeProject?.projet_id === projet_id) {
                setActiveProject(prev => ({ ...prev, ...updateData }));
            }

            return { success: true };

        } catch (err) {
            console.error("Erreur mise à jour:", err);
            return { success: false, errors: err.errors || [{ field: "server", message: "Erreur serveur" }] };
        }
    }, [activeProject]);

    /* =========================
       DELETE PROJECT
    ========================== */
    const deleteProject = useCallback(async (projet_id) => {
        try {
            const result = await window.api.deleteProject(projet_id);
            if (!result.success) throw new Error(result.error);

            setProjects(prev => prev.filter(p => p.projet_id !== projet_id));

            if (activeProject?.projet_id === projet_id) {
                setActiveProject(null);
                localStorage.removeItem("activeProjectId");
            }

            toast.success("Projet supprimé !");
            return { success: true };

        } catch (err) {
            console.error("Erreur suppression:", err);
            toast.error("Erreur lors de la suppression");
            return { success: false, error: err.message };
        }
    }, [activeProject]);

    /* =========================
       SELECT ACTIVE PROJECT
    ========================== */
    const selectActiveProject = useCallback((project) => {
        if (!project) {
            setActiveProject(null);
            setProjet_id(null)
            localStorage.removeItem("activeProjectId");
            return;
        }

        setActiveProject(project);
        setProjet_id(project.projet_id)
        localStorage.setItem("activeProjectId", project.projet_id);
    }, []);

    /* =========================
       UTILITIES
    ========================== */
    const getProjectById = useCallback(
        (projet_id) => projects.find(p => p.projet_id === Number(projet_id)),
        [projects]
    );

    const getProjectsByStatus = useCallback(
        (status) => projects.filter(p => p.status === status),
        [projects]
    );

    const getProjectsCount = useCallback(
        () => projects.length,
        [projects]
    );

    /* =========================
       MEMOIZED CONTEXT VALUE
    ========================== */
    const value = useMemo(() => ({
        projects,
        project_id,
        activeProject,
        loading,
        error,
        loadProjects,
        createProject,
        updateProject,
        deleteProject,
        selectActiveProject,
        getProjectById,
        getProjectsByStatus,
        getProjectsCount
    }), [
        projects,
        project_id,
        activeProject,
        loading,
        error,
        loadProjects,
        createProject,
        updateProject,
        deleteProject,
        selectActiveProject,
        getProjectById,
        getProjectsByStatus,
        getProjectsCount
    ]);

    return (
        <ProjectsContext.Provider value={value}>
            {children}
        </ProjectsContext.Provider>
    );
};

export const useProjects = () => {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error("useProjects doit être utilisé dans un ProjectsProvider");
    }
    return context;
};