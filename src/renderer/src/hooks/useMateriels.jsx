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

        console.log("materielData", materielData);

        try {

            if (!window.api?.createMateriel) {
                throw new Error("API Electron non disponible");
            }

            const result = await window.api.createMateriel(materielData);

            console.log("result", result);



            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                throw new Error(result.error || "Erreur inconnue");
            }

            const newMateriel = result?.data.materiel;
            const newPhases = result?.data.phases;


            // Optimisation : on ajoute sans reload complet
            setMateriels(prev => [...prev, newMateriel]);
            alertService.success(`Materiel ajouter !`)

            return { success: true, data: newPhases };

        } catch (err) {
            console.error("Erreur création:", err);
            alertService.handleBackendResponse(err.message || "Erreur lors de la création")
            return { success: false, error: err.message };
        }
    }, []);


    //     /* =========================
    //       UPDATE PHASE
    //    ========================== */
    //     const updatePhase = useCallback(async (phase_id, phaseData) => {

    //         try {
    //             const result = await window.api.updatePhase(phase_id, phaseData);
    //             console.log(result);

    //             if (!result) {
    //                 throw new Error("Aucune réponse du backend");
    //             }

    //             if (!result.success) {
    //                 throw new Error(result.error || "Erreur inconnue");
    //             }

    //             const newPhaseData = result?.data.phase;
    //             const newBudget = result?.data.budget;

    //             setPhases(prev =>
    //                 prev.map(p => p.phase_id === phase_id ? { ...p, ...newPhaseData } : p)
    //             );

    //             alertService.success(`La Phase ${newPhaseData.title} a été modifié avec succès !`)
    //             return {
    //                 success: true,
    //                 data: newBudget
    //             };

    //         } catch (err) {
    //             console.error("Erreur création:", err);
    //             alertService.handleBackendResponse(err.message || "Erreur lors de la création")
    //             return { success: false, error: err.message };
    //         }
    //     }, []);

    //     /* =========================
    //     DELETE PHASE
    //  ========================== */
    //     const deletePhase = useCallback(async (projet_id, phase_id, phase) => {
    //         try {

    //             const result = await window.api.deletePhase(projet_id, phase_id);

    //             if (!result?.success) {
    //                 throw new Error(result?.error || "Erreur inconnue");
    //             }

    //             setPhases(prev =>
    //                 prev.filter(p =>
    //                     Number(p.phase_id) !== Number(result.data.phase_id)
    //                 )
    //             );

    //             alertService.success(
    //                 `La Phase ${phase?.title || ""} a été supprimée avec succès !`
    //             );

    //             return result;

    //         } catch (err) {
    //             console.error("Erreur suppression:", err);
    //             alertService.error("Erreur lors de la suppression");

    //             return { success: false, error: err.message };
    //         }
    //     }, []);


    /* =========================
       MEMOIZED CONTEXT VALUE
    ========================== */
    const value = useMemo(() => ({
        materiels,
        loading,
        error,
        createMateriel,
        // updatePhase,
        // deletePhase,
        loadAllMateriels


    }), [
        materiels,
        loading,
        error,
        createMateriel,
        // updatePhase,
        // deletePhase,
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