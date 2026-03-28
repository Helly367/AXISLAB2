import { alertService } from "./alertService";

export const DependencyApi = {

    // Création
    createDependency: async (data) => {
        try {

            if (!data.projet_id || !data.from_phase_id || !data.to_phase_id) {

                alertService.error("Tous les champs sont requis");

                return {
                    success: false,
                    error: "Tous les champs sont requis"
                };
            }

            const response = await window.api.createDependency(data);
            console.log(response);


            if (!response.success) {

                alertService.error(
                    response.error || "Erreur lors de la création de la dépendance"
                );

                return response;
            }

            alertService.success("Dépendance créée avec succès");

            return response;

        } catch (error) {

            console.error("Erreur createDependency:", error);

            return {
                success: false,
                error: error.message
            };
        }
    },


    // Liste complète
    getDependencies: async () => {

        try {

            const response = await window.api.getDependencies();

            if (!response.success) {

                alertService.error(
                    response.error || "Erreur lors du chargement des dépendances"
                );

                return response;
            }

            return response;

        } catch (error) {

            console.error("Erreur getDependencies:", error);

            return {
                success: false,
                error: error.message
            };
        }
    },


    // Dépendances par projet
    getDependenciesByProject: async (projectId) => {

        try {

            if (!projectId) {

                return {
                    success: false,
                    error: "ID projet manquant"
                };
            }

            const response = await window.api.getDependenciesByProject(projectId);

            if (!response.success) {

                alertService.error(
                    response.error || "Erreur lors du chargement des dépendances"
                );

                return response;
            }

            return response;

        } catch (error) {

            console.error("Erreur getDependenciesByProject:", error);

            return {
                success: false,
                error: error.message
            };
        }
    },


    // Suppression
    deleteDependency: async (dependencyId) => {

        try {

            if (!dependencyId) {

                return {
                    success: false,
                    error: "ID dépendance manquant"
                };
            }

            const response = await window.api.deleteDependency(dependencyId);

            if (!response.success) {

                alertService.error(
                    response.error || "Erreur lors de la suppression"
                );

                return response;
            }

            alertService.success("Dépendance supprimée");

            return response;

        } catch (error) {

            console.error("Erreur deleteDependency:", error);

            return {
                success: false,
                error: error.message
            };
        }
    }

};