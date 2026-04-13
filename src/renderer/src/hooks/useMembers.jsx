import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import { alertService } from '../Services/alertService';

const MembresContext = createContext();

export const MembresProvider = ({ children }) => {

    const [membres, setMembres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeProject, setActiveProject] = useState(null);


    // Charger le projet au montage
    useEffect(() => {
        const projet_id = localStorage.getItem("activeProjectId");
        setActiveProject(projet_id ? Number(projet_id) : null);
    }, []);

    /* =========================
       LOAD PROJECTS
    ========================== */
    const loadMembres = useCallback(async () => {

        if (!activeProject) {
            console.log("Pas de projet actif");
            return;
        }

        try {
            setLoading(true);

            const result = await window.api.getAllMembres(activeProject);

            if (result.success) {
                setMembres(result.data || []);
                setError(null);

            } else {
                throw new Error(result.error);
            }





        } catch (err) {
            console.error("Erreur chargement des Membres:", err);
            setError("Impossible de charger les Membres");
            alertService.error("Impossible de charger les Membres")
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [activeProject]);

    /* =========================
       INITIAL LOAD
    ========================== */



    useEffect(() => {
        if (activeProject) {
            loadMembres();
        } else {
            setMembres(null);
            setLoading(false);
        }
    }, [activeProject]);


    /* =========================
       CREATE MEMBRE
    ========================== */
    const createMembre = useCallback(async (membreData) => {
        try {
            const result = await window.api.createMembre(membreData);
            console.log(result);


            if (!window.api?.createPhase) {
                throw new Error("API Electron non disponible");
            }

            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                throw new Error(result.error || "Erreur inconnue");
            }
            // Optimisation : on ajoute sans reload complet
            setMembres(prev => [...prev, result.data]);
            alertService.success(`Le membre ${result.data.nomComplet} a été ajouter avec succès !`)

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
    const updateMembre = useCallback(async (projet_id, membreData) => {
        try {
            // 1. Vérifier l'API d'abord
            if (!window.api?.updateMembre) {
                throw new Error("API Electron non disponible");
            }

            // 2. Appel à l'API
            const result = await window.api.updateMembre(projet_id, membreData);
            console.log("result", result);




            // 3. Vérifier que result existe
            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            // 4. Vérifier et logger les erreurs en toute sécurité
            if (result.errors) {
                console.log("Erreurs complètes :", result.errors);
                // Vérifier que result.errors est un tableau avant d'accéder à l'index 0
                if (Array.isArray(result.errors) && result.errors.length > 0) {
                    console.log("Première erreur :", result.errors[0]);
                    console.log("Message :", result.errors[0]?.message);
                }
            }

            // 5. Vérifier le succès
            if (!result.success) {
                if (result?.errors?.length) {
                    return {
                        success: false,
                        errors: result.errors
                    };
                }
                return {
                    success: false,
                    errors: [
                        { field: "server", message: result.error || "Erreur inconnue" }
                    ]
                };
            }

            const membre_id = membreData.membre_id;
            const newMembre = result.data;

            // 6. Mise à jour optimiste
            setMembres(prev =>
                prev.map(p => p.membre_id === membre_id ? { ...p, ...newMembre } : p)
            );

            if (result.data?.nomComplet) {
                alertService.success(`Le membre ${result.data.nomComplet} a été modifié avec succès !`);
            } else {
                alertService.success(`Le membre a été modifié avec succès !`);
            }

            return { success: true };

        } catch (err) {
            console.error("Erreur mise à jour:", err);

            // Si err contient déjà la structure { success, errors }
            if (err && typeof err === 'object' && 'errors' in err) {
                return err;
            }

            // Sinon, format standard
            return {
                success: false,
                errors: [{ field: "server", message: err.message || "Erreur serveur" }]
            };
        }
    }, [setMembres]); // N'oubliez pas les dépendances !

    // /* =========================
    //    DELETE MEMBRE
    // ========================== */
    const deleteMembre = useCallback(async (projet_id, membre_id) => {
        console.log("membre_id", membre_id);
        console.log("projet_id", projet_id);

        try {

            const result = await window.api.deleteMembre(projet_id, membre_id);

            if (!result.success) throw new Error(result.error);

            setMembres(prev => prev.filter(m => m.membre_id !== result.data.membre_id));
            alertService.success(`Membre supprimé !`);
            return {
                success: true,
                data: {
                    membres: result.data.membres,
                    phases: result.data.phases
                }
            };

        } catch (err) {
            console.error("Erreur suppression:", err);
            alertService.error("Erreur lors de la suppression");
            return { success: false, error: err.message };
        }
    }, []);





    /* =========================
       MEMOIZED CONTEXT VALUE
    ========================== */
    const value = useMemo(() => ({
        membres,
        setMembres,
        loading,
        error,
        loadMembres,
        createMembre,
        updateMembre,
        deleteMembre

    }), [
        membres,
        setMembres,
        loading,
        error,
        loadMembres,
        createMembre,
        updateMembre,
        deleteMembre

    ]);

    return (
        <MembresContext.Provider value={value}>
            {children}
        </MembresContext.Provider>
    );
};

export const useMembres = () => {
    const context = useContext(MembresContext);
    if (!context) {
        throw new Error("useMembres doit être utilisé dans un MembreProvider");
    }
    return context;
};