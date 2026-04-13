import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import { alertService } from '../Services/alertService';



const PhasesContext = createContext();

export const PhaseProvider = ({ children }) => {

    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    /* =========================
      LOAD PHASES
   ========================== */
    const loadPhases = useCallback(async () => {
        try {
            setLoading(true);

            const result = await window.api.getPhases();
            if (result.success) {
                setPhases(result.data || []);
                setError(null);
            } else {
                throw new Error(result.error);
            }

        } catch (err) {
            console.error("Erreur chargement des phases:", err);
            setError("Impossible de charger les phases");
            alertService.error("Impossible de charger les phases")
        } finally {
            setLoading(false);
        }
    }, []);

    /* =========================
       INITIAL LOAD
    ========================== */
    useEffect(() => {
        loadPhases();
    }, [loadPhases]);


    /* =========================
       CREATE PHASE
    ========================== */
    const createPhase = useCallback(async (phaseData) => {
        try {

            if (!window.api?.createPhase) {
                throw new Error("API Electron non disponible");
            }

            const result = await window.api.createPhase(phaseData);

            console.log("result", result);



            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                throw new Error(result.error || "Erreur inconnue");
            }

            // Optimisation : on ajoute sans reload complet
            setPhases(prev => [...prev, result.data.phase]);
            alertService.success(`La Phase ${result.data.phase.title} a été créer avec succès !`)

            return { success: true, data: result.data };

        } catch (err) {
            console.error("Erreur création:", err);
            alertService.handleBackendResponse(err.message || "Erreur lors de la création")
            return { success: false, error: err.message };
        }
    }, []);


    /* =========================
      UPDATE PHASE
   ========================== */
    const updatePhase = useCallback(async (projet_id, phaseData) => {

        try {
            const result = await window.api.updatePhase(projet_id, phaseData);
            console.log(result);

            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                throw new Error(result.error || "Erreur inconnue");
            }

            const newPhaseData = result?.data.phase;
            const newBudget = result?.data.budget;


            setPhases(prev =>
                prev.map(p => p.phase_id === phaseData.phase_id ? { ...p, ...newPhaseData } : p)
            );

            alertService.success(`La Phase ${newPhaseData.title} a été modifié avec succès !`);
            console.log("Phase mise à jour:", newPhaseData);
            console.log("Budget mis à jour:", newBudget);
            return {
                success: true,
                data: newBudget
            };

        } catch (err) {
            console.error("Erreur création:", err);
            alertService.handleBackendResponse(err.message || "Erreur lors de la création")
            return { success: false, error: err.message };
        }
    }, []);

    /* =========================
    DELETE PHASE
 ========================== */
    const deletePhase = useCallback(async (projet_id, phase_id, phase) => {
        try {

            const result = await window.api.deletePhase(projet_id, phase_id);

            if (!result?.success) {
                throw new Error(result?.error || "Erreur inconnue");
            }

            setPhases(prev =>
                prev.filter(p =>
                    Number(p.phase_id) !== Number(result.data.phase_id)
                )
            );

            alertService.success(
                `La Phase ${phase?.title || ""} a été supprimée avec succès !`
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
        phases,
        loading,
        error,
        createPhase,
        updatePhase,
        deletePhase,
        loadPhases,
        setPhases


    }), [
        phases,
        loading,
        error,
        createPhase,
        updatePhase,
        deletePhase,
        loadPhases,
        setPhases

    ]);

    return (
        <PhasesContext.Provider value={value}>
            {children}
        </PhasesContext.Provider>
    );
};

export const usePhases = () => {
    const context = useContext(PhasesContext);
    if (!context) {
        throw new Error("usePhase doit être utilisé dans un PhaseProvider");
    }
    return context;
};