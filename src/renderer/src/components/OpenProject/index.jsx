import React, { useState } from 'react';
import axis from "../../../../../resources/axis.png";
import SearchIcon from '@mui/icons-material/Search';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadIcon from '@mui/icons-material/Upload';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';

// Données fictives pour l'exemple
const MOCK_PROJECTS = [
    {
        id: 1,
        name: "Rénovation Appartement",
        description: "Rénovation complète d'un appartement de 80m²",
        date: "2024-03-15",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400"
    },
    {
        id: 2,
        name: "Maison Contemporaine",
        description: "Construction d'une maison moderne avec piscine",
        date: "2024-03-10",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400"
    },
    {
        id: 3,
        name: "Bureau Design",
        description: "Aménagement d'un espace de travail collaboratif",
        date: "2024-03-05",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"
    },
    {
        id: 4,
        name: "Jardin Paysager",
        description: "Création d'un jardin avec terrasse et végétation",
        date: "2024-02-28",
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
    }
];

const OpenProject = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [projects] = useState(MOCK_PROJECTS);

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full h-full bg-gray-50 overflow-y-auto">
            {/* Header avec logo */}
            <div className="bg-white shadow-sm py-4 px-6">
                <div className="max-w-7xl mx-auto">
                    <img src={axis} alt="Axis" className="h-12 w-auto" />
                </div>
            </div>

            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Barre de recherche et boutons */}
                <div className="flex flex-col items-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">
                        Mes Projets
                    </h1>

                    {/* Barre de recherche */}
                    <div className="w-full max-w-2xl mb-6">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un projet..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                            <CreateNewFolderIcon />
                            Créer un projet
                        </button>
                        <button className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition">
                            <UploadIcon />
                            Importer un projet
                        </button>
                    </div>
                </div>

                {/* Grille des projets */}
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                            >
                                {/* Image du projet */}
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                    />
                                </div>

                                {/* Informations du projet */}
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {project.name}
                                    </h3>

                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {project.description}
                                    </p>

                                    <div className="flex items-center text-gray-500 text-sm">
                                        <CalendarTodayIcon style={{ fontSize: 16 }} className="mr-2" />
                                        <span>Créé le {new Date(project.date).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                </div>

                                {/* Indicateur de type de projet */}
                                <div className="px-5 pb-4">
                                    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        <DescriptionIcon style={{ fontSize: 12 }} />
                                        Projet actif
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Message si aucun projet trouvé
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            Aucun projet trouvé
                        </p>
                        <p className="text-gray-400 mt-2">
                            Essayez de modifier votre recherche ou créez un nouveau projet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpenProject;