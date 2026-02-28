import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Création du contexte
const ProjectsContext = createContext();

// Provider component
export const ProjectsProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [activeProject, setActiveProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger tous les projets
    const loadProjects = async () => {
        try {
            setLoading(true);
            const result = await window.api.getProjects();
            if (result.success) {
                setProjects(result.data);
                setError(null);
            } else {
                setError('Erreur lors du chargement des projets');
                toast.error('Erreur lors du chargement des projets');
            }
        } catch (err) {
            console.error('Erreur chargement projets:', err);
            setError('Impossible de charger les projets');
            toast.error('Impossible de charger les projets');
        } finally {
            setLoading(false);
        }
    };

    // Charger au montage
    useEffect(() => {
        loadProjects();
    }, []);

    // Créer un projet
    const createProject = async (projectData) => {
        try {
            const result = await window.api.createProject(projectData);
            if (result.success) {
                // Recharger la liste des projets
                await loadProjects();
                // Définir comme projet actif
                setActiveProject(result.data);
                toast.success('Projet créé avec succès !');
                return { success: true, data: result.data };
            } else {
                toast.error(result.error || 'Erreur lors de la création');
                return { success: false, error: result.error };
            }
        } catch (err) {
            console.error('Erreur création:', err);
            toast.error('Erreur lors de la création');
            return { success: false, error: err.message };
        }
    };

    // Mettre à jour un projet
    const updateProject = async (id, updateData) => {
        try {
            const result = await window.api.updateProject(id, updateData);
            if (result.success) {
                // Mettre à jour la liste
                setProjects(prev => prev.map(p =>
                    p.id === id ? { ...p, ...updateData } : p
                ));
                // Mettre à jour le projet actif si c'est celui-ci
                if (activeProject?.id === id) {
                    setActiveProject(prev => ({ ...prev, ...updateData }));
                }
                toast.success('Projet mis à jour !');
                return { success: true };
            } else {
                toast.error(result.error || 'Erreur lors de la mise à jour');
                return { success: false, error: result.error };
            }
        } catch (err) {
            console.error('Erreur mise à jour:', err);
            toast.error('Erreur lors de la mise à jour');
            return { success: false, error: err.message };
        }
    };

    // Supprimer un projet
    const deleteProject = async (id) => {
        try {
            const result = await window.api.deleteProject(id);
            if (result.success) {
                // Retirer de la liste
                setProjects(prev => prev.filter(p => p.id !== id));
                // Si c'était le projet actif, le désactiver
                if (activeProject?.id === id) {
                    setActiveProject(null);
                }
                toast.success('Projet supprimé !');
                return { success: true };
            } else {
                toast.error(result.error || 'Erreur lors de la suppression');
                return { success: false, error: result.error };
            }
        } catch (err) {
            console.error('Erreur suppression:', err);
            toast.error('Erreur lors de la suppression');
            return { success: false, error: err.message };
        }
    };

    // Sélectionner un projet actif
    const selectActiveProject = (project) => {
        setActiveProject(project);
        localStorage.setItem('activeProjectId', project?.id || '');
    };

    // Charger le dernier projet actif depuis localStorage
    const loadLastActiveProject = async () => {
        const savedId = localStorage.getItem('activeProjectId');
        if (savedId && projects.length > 0) {
            const saved = projects.find(p => p.id === parseInt(savedId));
            if (saved) {
                setActiveProject(saved);
            }
        }
    };

    // Valeurs exposées par le contexte
    const value = {
        projects,
        activeProject,
        loading,
        error,
        loadProjects,
        createProject,
        updateProject,
        deleteProject,
        selectActiveProject,
        loadLastActiveProject,
        // Utilitaires
        getProjectById: (id) => projects.find(p => p.id === parseInt(id)),
        getProjectsByStatus: (status) => projects.filter(p => p.status === status),
        getProjectsCount: () => projects.length,
    };

    return (
        <ProjectsContext.Provider value={value}>
            {children}
        </ProjectsContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte
export const useProjects = () => {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error('useProjects doit être utilisé dans un ProjectsProvider');
    }
    return context;
};