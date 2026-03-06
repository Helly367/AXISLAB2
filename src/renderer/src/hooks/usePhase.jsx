import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import { alertService } from '../functions/alertService';

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

            console.log("RESULT API:", result);

            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                throw new Error(result.error || "Erreur inconnue");
            }

            // Optimisation : on ajoute sans reload complet
            setPhases(prev => [...prev, result.data]);
            alertService.success(`La Phase ${result.data.title} a été créer avec succès !`)

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
    const updatePhase = useCallback(async (phase_id, phaseData) => {
        try {
            const result = await window.api.updatePhase(phase_id, phaseData);
            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                throw new Error(result.error || "Erreur inconnue");
            }

            setPhases(prev =>
                prev.map(p => p.phase_id === phase_id ? { ...p, ...phaseData } : p)
            );
            alertService.success(`La Phase ${result.data.title} a été modifié avec succès !`)
            return { success: true };

        } catch (err) {
            console.error("Erreur création:", err);
            alertService.handleBackendResponse(err.message || "Erreur lors de la création")
            return { success: false, error: err.message };
        }
    });


    /* =========================
       MEMOIZED CONTEXT VALUE
    ========================== */
    const value = useMemo(() => ({
        phases,
        loading,
        error,
        createPhase,
        updatePhase

    }), [
        phases,
        loading,
        error,
        createPhase,
        updatePhase
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