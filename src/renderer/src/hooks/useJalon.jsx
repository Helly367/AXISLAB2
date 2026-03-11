import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import { alertService } from '../functions/alertService';


const JalonContext = createContext();

export const JalonProvider = ({ children }) => {

    const [jalons, setJalons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    /* =========================
      LOAD JALONS
   ========================== */
    const loadJalons = useCallback(async () => {
        try {
            setLoading(true);

            const result = await window.api.getJalons();

            if (result.success) {
                setJalons(result.data || []);
                setError(null);
            } else {
                throw new Error(result.error);
            }

        } catch (err) {
            console.error("Erreur chargement des jalons:", err);
            setError("Impossible de charger les jalons");
            alertService.error("Impossible de charger les jalons")
        } finally {
            setLoading(false);
        }
    }, []);

    /* =========================
       INITIAL LOAD
    ========================== */
    useEffect(() => {
        loadJalons();
    }, [loadJalons]);


    /* =========================
       CREATE PHASE
    ========================== */
    const ajouteJalon = useCallback(async (jalonData) => {
        try {

            if (!window.api?.createJalon) {
                throw new Error("API Electron non disponible");
            }

            const result = await window.api.createJalon(jalonData);

            console.log(result);



            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                throw new Error(result.error || "Erreur inconnue");
            }

            // Optimisation : on ajoute sans reload complet
            setJalons(prev => [...prev, result.data]);
            alertService.success(`Le Jalon ${result.data.title} a été créer avec succès !`)

            return { success: true, data: result.data };

        } catch (err) {
            console.error("Erreur création:", err);
            alertService.handleBackendResponse(err.message || "Erreur lors de la création")
            return { success: false, error: err.message };
        }
    }, []);


    //     /* =========================
    //       UPDATE PHASE
    //    ========================== */
    const modifieJalon = useCallback(async (jalon_id, jalonData) => {
        console.log("phase id", jalon_id);
        console.log("jalonData ", jalonData);


        try {
            const result = await window.api.updateJalon(jalon_id, jalonData);
            console.log(result);

            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                throw new Error(result.error || "Erreur inconnue");
            }

            setJalons(prev =>
                prev.map(p => p.jalon_id === jalon_id ? { ...p, ...jalonData } : p)
            );
            alertService.success(`Le jalon ${result.data.title} a été modifié avec succès !`)
            return { success: true };

        } catch (err) {
            console.error("Erreur création:", err);
            alertService.handleBackendResponse(err.message || "Erreur lors de la création")
            return { success: false, error: err.message };
        }
    });

    //     /* =========================
    //     DELETE PHASE
    //  ========================== */
    const deleteJalon = useCallback(async (jalon_id, jalon) => {
        try {

            const result = await window.api.deletejalon(jalon_id);

            if (!result?.success) {
                throw new Error(result?.error || "Erreur inconnue");
            }

            setJalons(prev =>
                prev.filter(p =>
                    Number(p.jalon_id) !== Number(result.data.jalon_id)
                )
            );

            alertService.success(
                `Le jalon ${jalon?.title || ""} a été supprimée avec succès !`
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
        jalons,
        loading,
        error,
        ajouteJalon,
        modifieJalon,
        deleteJalon


    }), [
        jalons,
        loading,
        error,
        ajouteJalon,
        modifieJalon,
        deleteJalon


    ]);

    return (
        <JalonContext.Provider value={value}>
            {children}
        </JalonContext.Provider>
    );
};

export const useJalon = () => {
    const context = useContext(JalonContext);
    if (!context) {
        throw new Error("useJalons doit être utilisé dans un JalonProvider");
    }
    return context;
};