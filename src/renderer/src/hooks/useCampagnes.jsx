import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import { alertService } from '../Services/alertService';



const CampagnesContexte = createContext();

export const CampagnesProvider = ({ children }) => {

    const [campagnes, setCampagnes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeProject, setActiveProject] = useState(null);


    // Charger le projet au montage
    useEffect(() => {
        const projet_id = localStorage.getItem("activeProjectId");
        setActiveProject(projet_id ? Number(projet_id) : null);
    }, []);


    /* =========================
      LOAD Campagnes
   ========================== */
    const loadAllCampagnes = useCallback(async () => {

        if (!activeProject || activeProject <= 0) {
            console.log("Pas de projet actif");
            return;
        }

        try {
            setLoading(true);

            const result = await window.api.getAllCampagnes(activeProject);

            console.log("result", result);


            if (result.success) {
                setCampagnes(result.data || []);
                setError(null);
            } else {
                throw new Error(result.error);
            }

        } catch (err) {
            console.error("Erreur chargement des campagnes:", err);
            setError("Impossible de charger les campagnes");
            alertService.error("Impossible de charger les campagnes");
        } finally {
            setLoading(false);
        }

    }, [activeProject]); // ✅ IMPORTANT

    /* =========================
       INITIAL LOAD
    ========================== */
    useEffect(() => {
        if (activeProject > 0) {
            loadAllCampagnes();
        } else {
            setCampagnes([]);
            setLoading(false);
        }
    }, [activeProject, loadAllCampagnes]);



    /* =========================
       CREATE PHASE
    ========================== */
    const createCampagne = useCallback(async (campagneData) => {
        try {

            if (!window.api?.createCampagne) {
                throw new Error("API Electron non disponible");
            }

            const result = await window.api.createCampagne(campagneData);

            console.log("result", result);

            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                throw new Error(result.error || "Erreur inconnue");
            }

            const newCampagne = result?.data.campagne;

            // Optimisation : on ajoute sans reload complet
            setCampagnes(prev => [...prev, newCampagne]);
            alertService.success(`Campagne ajoutée !`)

            return result;

        } catch (err) {
            console.error("Erreur création:", err);
            alertService.handleBackendResponse(err.message || "Erreur lors de la création")
            return { success: false, error: err.message };
        }
    }, []);

    const ajouteEtape = useCallback(async (etapeDatas) => {

        console.log({
            projet_id: etapeDatas.projet_id,
            campagne_id: etapeDatas.campagne_id,
            newEtape: etapeDatas.newEtape
        });


        try {

            if (!window.api?.ajouteEtape) {
                throw new Error("API Electron non disponible");
            }

            if (!etapeDatas.projet_id && !etapeDatas.campagne_id) {
                throw new Error("ID de la campagne et du projet sont requis");
            }


            if (!etapeDatas.newEtape.nom || !etapeDatas.newEtape.date_debut || !etapeDatas.newEtape.date_fin) {
                throw new Error("Champs requis pour création");
            }

            const result = await window.api.ajouteEtape(etapeDatas.projet_id, etapeDatas.campagne_id, etapeDatas.newEtape);
            console.log("result", result);

            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                if (result.error) {
                    alertService.error(result.error)
                }
                return;
            }

            const campagne_id = etapeDatas.campagne_id;
            const campagne = result?.data?.newCampagne;
            const updatedPlanification = result?.data?.updatedPlanification;
            const newEtapeF = result?.data?.newEtapeF

            console.log(newEtapeF);


            setCampagnes(prev =>
                prev.map(c => c.campagne_id === campagne_id ? { ...c, ...campagne } : c)
            );

            alertService.success(`Modification effectuer avec succès !`)

            return {
                success: true,
                updatedPlanification: updatedPlanification,
                newEtapeF: newEtapeF
            };

        } catch (err) {
            console.error("Erreur:", err);
            alertService.handleBackendResponse(err.message || "Erreur");
            return { success: false, error: err.message };
        }

    }, []);

    const updateEtape = useCallback(async (etapeDatas) => {

        console.log({
            projet_id: etapeDatas.projet_id,
            campagne_id: etapeDatas.campagne_id,
            updatedEtapes: etapeDatas.updatedEtapes
        });


        try {

            if (!window.api?.ajouteEtape) {
                throw new Error("API Electron non disponible");
            }

            if (!etapeDatas.projet_id && !etapeDatas.campagne_id) {
                throw new Error("ID de la campagne et du projet sont requis");
            }


            const result = await window.api.updateEtape(etapeDatas.projet_id, etapeDatas.campagne_id, etapeDatas.updatedEtapes);
            console.log("result", result);

            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                if (result.error) {
                    alertService.error(result.error)
                }
                return;
            }

            const campagne_id = etapeDatas.campagne_id;
            const campagne = result?.data?.newCampagne;
            setCampagnes(prev =>
                prev.map(c => c.campagne_id === campagne_id ? { ...c, ...campagne } : c)
            );

            alertService.success(`Modification effectuer avec succès !`)

            return { success: true };


        } catch (err) {
            console.error("Erreur:", err);
            alertService.handleBackendResponse(err.message || "Erreur");
            return { success: false, error: err.message };
        }

    }, []);

    const deleteEtape = useCallback(async (etapeDatas) => {


        try {

            if (!window.api?.deleteEtape) {
                throw new Error("API Electron non disponible");
            }

            if (!etapeDatas.projet_id && !etapeDatas.campagne_id) {
                throw new Error("ID de la campagne et du projet sont requis");
            }


            const result = await window.api.deleteEtape(etapeDatas.projet_id, etapeDatas.campagne_id, etapeDatas.updatedEtapes);
            console.log("result", result);

            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                if (result.error) {
                    alertService.error(result.error)
                }
                return;
            }

            const campagne_id = etapeDatas.campagne_id;
            const campagne = result?.data?.newCampagne;
            setCampagnes(prev =>
                prev.map(c => c.campagne_id === campagne_id ? { ...c, ...campagne } : c)
            );

            alertService.success(`suppression effectuer avec succès !`)

            return { success: true };


        } catch (err) {
            console.error("Erreur:", err);
            alertService.handleBackendResponse(err.message || "Erreur");
            return { success: false, error: err.message };
        }

    }, []);


    const ajouteCanal = useCallback(async (canalDatas) => {

        try {

            if (!window.api?.ajouteCanal) {
                throw new Error("API Electron non disponible");
            }

            if (!canalDatas.projet_id && !canalDatas.campagne_id) {
                throw new Error("ID de la campagne et du projet sont requis");
            }


            const result = await window.api.ajouteCanal(
                canalDatas.projet_id,
                canalDatas.campagne_id,
                canalDatas.newCanal
            );


            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                if (result.error) {
                    alertService.error(result.error)
                }
                return;
            }

            const campagne_id = canalDatas.campagne_id;
            const campagne = result?.data?.newCampagne;
            setCampagnes(prev =>
                prev.map(c => c.campagne_id === campagne_id ? { ...c, ...campagne } : c)
            );

            alertService.success(`canal ajouter avec succès !`)

            return { success: true };


        } catch (err) {
            console.error("Erreur:", err);
            alertService.handleBackendResponse(err.message || "Erreur");
            return { success: false, error: err.message };
        }

    }, []);

    const deleteCanal = useCallback(async (canalDatas) => {

        try {

            if (!window.api?.deleteCanal) {
                throw new Error("API Electron non disponible");
            }

            if (!canalDatas.projet_id && !canalDatas.campagne_id) {
                throw new Error("ID de la campagne et du projet sont requis");
            }


            const result = await window.api.ajouteCanal(
                canalDatas.projet_id,
                canalDatas.campagne_id,
                canalDatas.newCanal
            );


            if (!result) {
                throw new Error("Aucune réponse du backend");
            }

            if (!result.success) {
                if (result.error) {
                    alertService.error(result.error)
                }
                return;
            }

            const campagne_id = canalDatas.campagne_id;
            const campagne = result?.data?.newCampagne;
            setCampagnes(prev =>
                prev.map(c => c.campagne_id === campagne_id ? { ...c, ...campagne } : c)
            );

            alertService.success(`canal supprimé avec succès !`)

            return { success: true };


        } catch (err) {
            console.error("Erreur:", err);
            alertService.handleBackendResponse(err.message || "Erreur");
            return { success: false, error: err.message };
        }

    }, []);




    //     /* =========================
    //       UPDATE Materiel
    //    ========================== */
    // const updateMateriel = useCallback(async (projet_id, materielData) => {


    //     try {
    //         const result = await window.api.updateMateriel(projet_id, materielData);
    //         console.log(result);

    //         if (!result) {
    //             throw new Error("Aucune réponse du backend");
    //         }

    //         if (!result.success) {
    //             throw new Error(result.error || "Erreur inconnue");
    //         }

    //         const materiel_id = materielData.materiel_id;
    //         const materielDataFont = result?.data.materiel;
    //         const phase = result?.data.phase;

    //         setMateriels(prev =>
    //             prev.map(m => m.materiel_id === materiel_id ? { ...m, ...materielDataFont } : m)
    //         );

    //         alertService.success(`Modification effectuer avec succès !`)
    //         return {
    //             success: true,
    //             data: phase
    //         };

    //     } catch (err) {
    //         console.error("Erreur création:", err);
    //         alertService.handleBackendResponse(err.message || "Erreur lors de la création")
    //         return { success: false, error: err.message };
    //     }
    // }, []);

    //     /* =========================
    //     DELETE Materiel
    //  ========================== */
    // const deleteMateriel = useCallback(async (projet_id, materielId, phase_id) => {
    //     try {

    //         const result = await window.api.deleteMateriel(projet_id, materielId, phase_id);

    //         if (!result?.success) {
    //             throw new Error(result?.error || "Erreur inconnue");
    //         }

    //         const materiel_id = result.data.materiel_id;


    //         setMateriels(prev =>
    //             prev.filter(p =>
    //                 Number(p.materiel_id) !== Number(materiel_id)
    //             )
    //         );

    //         alertService.success(
    //             `Materiel supprimé avec succès !`
    //         );

    //         return result;

    //     } catch (err) {
    //         console.error("Erreur suppression:", err);
    //         alertService.error("Erreur lors de la suppression");

    //         return { success: false, error: err.message };
    //     }
    // }, []);


    /* =========================
       MEMOIZED CONTEXT VALUE
    ========================== */
    const value = useMemo(() => ({
        campagnes,
        setCampagnes,
        loading,
        error,
        // createMateriel,
        // updateMateriel,
        // deleteMateriel,
        loadAllCampagnes,
        createCampagne,
        ajouteEtape,
        updateEtape,
        deleteEtape,
        ajouteCanal,
        deleteCanal


    }), [
        campagnes,
        setCampagnes,
        loading,
        error,
        // createMateriel,
        // updateMateriel,
        // deleteMateriel,
        loadAllCampagnes,
        createCampagne,
        ajouteEtape,
        updateEtape,
        deleteEtape,
        ajouteCanal,
        deleteCanal

    ]);

    return (
        <CampagnesContexte.Provider value={value}>
            {children}
        </CampagnesContexte.Provider>
    );
};

export const useCampagnes = () => {
    const context = useContext(CampagnesContexte);
    if (!context) {
        throw new Error("useCampagnes doit être utilisé dans un CampagnesProvider");
    }
    return context;
};