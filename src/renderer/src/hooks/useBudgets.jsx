import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import { alertService } from '../Services/alertService';


const BudgetsContext = createContext();

export const BudgetsProvider = ({ children }) => {

    const [budget, setBudget] = useState([]);
    const [devise, setDevise] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeProject, setActiveProject] = useState(null);
    const [error, setError] = useState(null);

    // Charger le projet au montage
    useEffect(() => {
        const projet_id = localStorage.getItem("activeProjectId");
        setActiveProject(projet_id ? Number(projet_id) : null);
    }, []);

    // Fonction de chargement avec la bonne dépendance
    const loadBudgets = useCallback(async () => {
        if (!activeProject) {
            console.log("Pas de projet actif");
            return;
        }

        try {
            setLoading(true);
            const result = await window.api.loadBudgets(activeProject);


            if (result?.success) {
                setBudget(result.data?.budget || null);
                setDevise(result.data?.budget?.devise || "USD");


            } else {
                throw new Error(result?.error || "Erreur de chargement");
            }
        } catch (err) {
            console.error(err);
            setBudget(null);
        } finally {
            setLoading(false);
        }
    }, [activeProject]); // ← Ajoutez activeProject ici

    // Déclencher le chargement quand activeProject change
    useEffect(() => {
        if (activeProject) {
            loadBudgets();
        } else {
            setBudget(null);
            setLoading(false);
        }
    }, [activeProject]); // ← Enlevez loadBudgets des dépendances

    /* =========================
       CREATE GLOBAL BUDGET
    ========================== */
    // const createBudget = useCallback(async (budgetData) => {

    //     console.log("useDate", budgetData);

    //     try {
    //         if (!window.api?.createBudget) {
    //             throw new Error("API Electron non disponible");
    //         }
    //         const result = await window.api.createBudget(budgetData);
    //         if (!result) {
    //             throw new Error("Aucune réponse du backend");
    //         }
    //         // 👇 important
    //         if (!result.success) {
    //             return result;
    //         }

    //         setBudget(prev => [...prev, result.data]);
    //         alertService.success("Le budget a été ajouté avec succès !");
    //         return { success: true, data: result.data };

    //     } catch (err) {
    //         console.error("Erreur création:", err);
    //         return {
    //             success: false,
    //             error: err.message
    //         };
    //     }

    // }, []);

    const convertionBudget = useCallback(async (projet_id, budgetData) => {

        console.log("useDate", budgetData);

        try {
            if (!window.api?.convertionBudget) {
                throw new Error("API Electron non disponible");
            }
            const result = await window.api.convertionBudget(projet_id, budgetData);
            if (!result) {
                throw new Error("Aucune réponse du backend");
            }
            // 👇 important
            if (!result.success) {
                return result;
            }

            setBudget(result.data);
            setDevise(result.data.devise || "USD");



            return { success: true, data: result.data };

        } catch (err) {
            console.error("Erreur création:", err);
            return {
                success: false,
                error: err.message
            };
        }

    }, []);



    const configureBudget = useCallback(async (projet_id, budgetData) => {

        console.log("useDate", budgetData);
        console.log("projet_id", projet_id);


        try {
            if (!window.api?.configureBudget) {
                throw new Error("API Electron non disponible");
            }
            const result = await window.api.configureBudget(projet_id, budgetData);
            if (!result) {
                throw new Error("Aucune réponse du backend");
            }
            // 👇 important
            if (!result.success) {
                return result;
            }

            setBudget(result.data);
            setDevise(result.data.devise || "USD");



            return { success: true, data: result.data };

        } catch (err) {
            console.error("Erreur création:", err);
            return {
                success: false,
                error: err.message
            };
        }

    }, []);

  



    /* =========================
       MEMOIZED CONTEXT VALUE
    ========================== */
    const value = useMemo(() => ({
        budget,
        loading,
        error,
        loadBudgets,
        configureBudget,
        convertionBudget,
        setBudget
        // updateMembre,
        // deleteMembre

    }), [
        budget,
        loading,
        error,
        loadBudgets,
        configureBudget,
        convertionBudget,
        setBudget
        // updateMembre,
        // deleteMembre

    ]);

    return (
        <BudgetsContext.Provider value={value}>
            {children}
        </BudgetsContext.Provider>
    );
};

export const useBudgets = () => {
    const context = useContext(BudgetsContext);
    if (!context) {
        throw new Error("useBudgets doit être utilisé dans un BudgetsProvider");
    }
    return context;
};