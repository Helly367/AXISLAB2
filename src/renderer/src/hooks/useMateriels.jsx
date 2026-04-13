import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import { alertService } from '../Services/alertService';


const MaterielContexte = createContext();

export const MaterielProvider = ({ children }) => {

    const [materiels, setMateriels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeProject, setActiveProject] = useState(null);


    // Charger le projet au montage
    useEffect(() => {
        const projet_id = localStorage.getItem("activeProjectId");
        setActiveProject(projet_id ? Number(projet_id) : null);
    }, []);


    /* =========================
      LOAD materiels
   ========================== */
    const loadAllMateriels = useCallback(async () => {

        if (!activeProject || activeProject <= 0) {
            console.log("Pas de projet actif");
            return;
        }

        try {
            setLoading(true);
            const result = await window.api.loadAllMateriels(activeProject);

            if (result.success) {
                setMateriels(result.data || []);
                setError(null);
            } else {
                throw new Error(result.error);
            }

        } catch (err) {
            console.error("Erreur chargement des materiels:", err);
            setError("Impossible de charger les materiels");
            alertService.error("Impossible de charger les materiels");
        } finally {
            setLoading(false);
        }

    }, [activeProject]); // ✅ IMPORTANT

    /* =========================
       INITIAL LOAD
    ========================== */
    useEffect(() => {
        if (activeProject > 0) {
            loadAllMateriels();
        } else {
            setMateriels([]);
            setLoading(false);
        }
    }, [activeProject, loadAllMateriels]);



    /* =========================
       CREATE PHASE
    ========================== */
    const createMateriel = useCallback(async (materielData) => {
        try {

            if (!window.api?.createMateriel) {
                throw new Error("API Electron non disponible");
            }

            const result = await window.api.createMateriel(materielData);

            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                throw new Error(result.error || "Erreur inconnue");
            }

            const newMateriel = result?.data.materiel;



            // Optimisation : on ajoute sans reload complet
            setMateriels(prev => [...prev, newMateriel]);
            alertService.success(`Materiel ajouter !`)

            return result;

        } catch (err) {
            console.error("Erreur création:", err);
            alertService.handleBackendResponse(err.message || "Erreur lors de la création")
            return { success: false, error: err.message };
        }
    }, []);


    //     /* =========================
    //       UPDATE Materiel
    //    ========================== */
    const updateMateriel = useCallback(async (projet_id, materielData) => {


        try {
            const result = await window.api.updateMateriel(projet_id, materielData);
            console.log(result);

            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                throw new Error(result.error || "Erreur inconnue");
            }

            const materiel_id = materielData.materiel_id;
            const materielDataFont = result?.data.materiel;
            const phase = result?.data.phase;

            setMateriels(prev =>
                prev.map(m => m.materiel_id === materiel_id ? { ...m, ...materielDataFont } : m)
            );

            alertService.success(`Modification effectuer avec succès !`)
            return {
                success: true,
                data: phase
            };

        } catch (err) {
            console.error("Erreur création:", err);
            alertService.handleBackendResponse(err.message || "Erreur lors de la création")
            return { success: false, error: err.message };
        }
    }, []);

    //     /* =========================
    //     DELETE Materiel
    //  ========================== */
    const deleteMateriel = useCallback(async (projet_id, materielId, phase_id) => {
        try {

            const result = await window.api.deleteMateriel(projet_id, materielId, phase_id);

            if (!result?.success) {
                throw new Error(result?.error || "Erreur inconnue");
            }

            const materiel_id = result.data.materiel_id;


            setMateriels(prev =>
                prev.filter(p =>
                    Number(p.materiel_id) !== Number(materiel_id)
                )
            );

            alertService.success(
                `Materiel supprimé avec succès !`
            );

            return result;

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
        materiels,
        loading,
        error,
        createMateriel,
        updateMateriel,
        deleteMateriel,
        loadAllMateriels


    }), [
        materiels,
        loading,
        error,
        createMateriel,
        updateMateriel,
        deleteMateriel,
        loadAllMateriels

    ]);

    return (
        <MaterielContexte.Provider value={value}>
            {children}
        </MaterielContexte.Provider>
    );
};

export const useMateriels = () => {
    const context = useContext(MaterielContexte);
    if (!context) {
        throw new Error("useMateriels doit être utilisé dans un MaterielProvider");
    }
    return context;
};