import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadIcon from '@mui/icons-material/Upload';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import projetImg from "../../../../../../resources/illustractions/projet.png";
import { useProjects } from '../../../hooks/useProjets';

const OpenProject = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const { projects, loading, error, selectActiveProject } = useProjects();

    // 🔹 Sélection d’un projet
    const handleSelectProject = useCallback((project) => {
        selectActiveProject(project);

        toast.success(`Projet "${project.nom_projet}" chargé`, {
            position: "bottom-right",
            theme: "dark",
            autoClose: 3000
        });

        navigate(`/dashboard/${project.projet_id}`);
    }, [navigate, selectActiveProject]);

    // 🔹 Créer nouveau projet
    const handleCreateNew = useCallback(() => {
        navigate('/');
    }, [navigate]);

    // 🔹 Import (placeholder propre)
    const handleImport = useCallback(() => {
        toast.info("Fonctionnalité d'import à venir", {
            position: "bottom-right",
            theme: "dark"
        });
    }, []);

    // 🔹 Filtrage optimisé (memo)
    const filteredProjects = useMemo(() => {
        if (!searchTerm) return projects;

        return projects.filter(project =>
            project.nom_projet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [projects, searchTerm]);

    return (
        <div className="w-full h-full bg-gray-50 overflow-y-auto">
            <div className="max-w-8xl mx-auto px-6">

                {/* Barre recherche */}
                <div className="flex items-center justify-between gap-4 px-6 py-8">
                    <div className="w-full max-w-2xl">
                        <div className="relative gap-4">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un projet..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-10 py-4 bg-gray-50 border-2 rounded-xl 
                                focus:outline-none focus:bg-white border-gray-200 focus:border-blue-500
                                transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            <CreateNewFolderIcon />
                            Créer un projet
                        </button>

                        <button
                            onClick={handleImport}
                            className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
                        >
                            <UploadIcon />
                            Importer un projet
                        </button>
                    </div>
                </div>

                {/* Gestion erreur */}
                {error && (
                    <div className="text-center text-red-500 py-6">
                        Erreur lors du chargement des projets
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (

                    filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                                {filteredProjects.map((project) => {

                                    const createdDate = project.created_at
                                        ? new Date(project.created_at).toLocaleDateString('fr-FR')
                                        : "Date inconnue";

                                    return (
                                        <motion.div
                                            key={project.projet_id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => handleSelectProject(project)}
                                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                                        >
                                            <div className="w-full h-40 overflow-hidden bg-gray-200">
                                                <img
                                                    src={projetImg}
                                                    alt={project.nom_projet}
                                                    className="w-40 h-full hover:scale-105 transition duration-300 mx-auto"
                                                />
                                            </div>

                                            <div className="p-5">
                                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                    {project.nom_projet}
                                                </h3>

                                                <p className="text-gray-600 mb-4 line-clamp-2">
                                                    {project.description || "Aucune description"}
                                                </p>

                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <CalendarTodayIcon style={{ fontSize: 16 }} className="mr-2" />
                                                    <span>Créé le {createdDate}</span>
                                                </div>
                                            </div>

                                            <div className="px-5 pb-4">
                                                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded
                                                ${project.status === 'planification' ? 'bg-yellow-100 text-yellow-800' :
                                                        project.status === 'en_cours' ? 'bg-green-100 text-green-800' :
                                                            project.status === 'termine' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'}`}
                                                >
                                                    <DescriptionIcon style={{ fontSize: 12 }} />
                                                    {project.status === 'planification' ? 'Planification' :
                                                        project.status === 'en_cours' ? 'En cours' :
                                                            project.status === 'termine' ? 'Terminé' :
                                                                project.status || 'Projet'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                                <div className="text-center py-20 px-6">
                                    <p className="text-gray-500 text-lg">
                                        {projects.length === 0
                                            ? "Aucun projet n'a encore été créé"
                                            : "Aucun projet trouvé"}
                                    </p>

                                    <p className="text-gray-400 mt-2">
                                        {projects.length === 0
                                            ? "Commencez par créer votre premier projet !"
                                            : "Essayez de modifier votre recherche"}
                                    </p>

                                    {projects.length === 0 && (
                                        <button
                                            onClick={handleCreateNew}
                                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Créer mon premier projet
                                        </button>
                                    )}
                                </div>
                            )
                )}
            </div>
        </div>
    );
};

export default OpenProject;