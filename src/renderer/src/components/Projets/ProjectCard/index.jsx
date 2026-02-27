import React, { useState } from 'react';
import {
    MoreVert,
    Delete,
    Star,
    StarBorder,
    ContentCopy,
    Person,
    CalendarToday,
    Folder
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({
    project,
    viewMode,
    onToggleFavorite,
    onDelete,
    onDuplicate,
    getStatusIcon,
    getStatusLabel
}) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const getPriorityColor = (priorite) => {
        switch (priorite) {
            case 'haute':
                return 'bg-red-100 text-red-700';
            case 'moyenne':
                return 'bg-orange-100 text-orange-700';
            case 'basse':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const calculateProgressColor = (progression) => {
        if (progression >= 75) return 'bg-green-500';
        if (progression >= 50) return 'bg-blue-500';
        if (progression >= 25) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const budgetPourcentage = (project.budget_depense / project.budget_total) * 100;

    // Vue liste
    if (viewMode === 'list') {
        return (
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 relative group">
                <div className="flex items-center gap-4">
                    {/* Image/icône */}
                    <div className={`w-12 h-12 ${project.couleur} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {project.image ? (
                            <img src={project.image} alt={project.nom} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <Folder className="text-white" />
                        )}
                    </div>

                    {/* Infos principales */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-gray-800 truncate">{project.nom}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(project.priorite)}`}>
                                {project.priorite}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                {getStatusIcon(project.statut)}
                                {getStatusLabel(project.statut)}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{project.description}</p>
                    </div>

                    {/* Métriques */}
                    <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                            <p className="text-gray-500">Client</p>
                            <p className="font-medium">{project.client}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500">Progression</p>
                            <p className="font-medium">{project.progression}%</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500">Budget</p>
                            <p className="font-medium">{project.budget_total.toLocaleString()} FCFA</p>
                        </div>
                    </div>

                    {/* Menu actions */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-gray-100 rounded-full">
                            <MoreVert />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                <button
                                    onClick={() => navigate(`/projet/${project.id}`)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                                    Voir les détails
                                </button>
                                <button
                                    onClick={() => onToggleFavorite(project.id)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                                    {project.favori ? (
                                        <>
                                            <Star className="text-yellow-500" fontSize="small" />
                                            Retirer des favoris
                                        </>
                                    ) : (
                                        <>
                                            <StarBorder fontSize="small" />
                                            Ajouter aux favoris
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => onDuplicate(project)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                                    <Copy fontSize="small" /> Dupliquer
                                </button>
                                <button
                                    onClick={() => onDelete(project.id)}
                                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm flex items-center gap-2">
                                    <Delete fontSize="small" /> Supprimer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Vue grille (par défaut)
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden relative group">
            {/* Image d'en-tête */}
            <div className={`h-32 ${project.couleur} relative`}>
                {project.image ? (
                    <img src={project.image} alt={project.nom} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Folder className="text-white text-5xl opacity-50" />
                    </div>
                )}

                {/* Bouton favori */}
                <button
                    onClick={() => onToggleFavorite(project.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                    {project.favori ? (
                        <Star className="text-yellow-500" />
                    ) : (
                        <StarBorder className="text-gray-400" />
                    )}
                </button>

                {/* Statut */}
                <div className="absolute bottom-2 left-2 flex gap-2">
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md">
                        {getStatusIcon(project.statut)}
                        {getStatusLabel(project.statut)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-md ${getPriorityColor(project.priorite)}`}>
                        {project.priorite}
                    </span>
                </div>
            </div>

            {/* Contenu */}
            <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg mb-1">{project.nom}</h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{project.description}</p>

                {/* Client et responsable */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                        <Person fontSize="small" className="text-blue-500" />
                        {project.chef_projet}
                    </span>
                    <span className="flex items-center gap-1">
                        <CalendarToday fontSize="small" className="text-orange-500" />
                        {formatDate(project.date_fin_prevue)}
                    </span>
                </div>

                {/* Progression */}
                <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Progression</span>
                        <span className="text-xs font-medium">{project.progression}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`${calculateProgressColor(project.progression)} rounded-full h-2 transition-all duration-500`}
                            style={{ width: `${project.progression}%` }}
                        />
                    </div>
                </div>

                {/* Budget */}
                <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Budget</span>
                        <span className="text-xs font-medium">{budgetPourcentage.toFixed(0)}% utilisé</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`${budgetPourcentage > 100 ? 'bg-red-500' : 'bg-green-500'} rounded-full h-2`}
                            style={{ width: `${Math.min(budgetPourcentage, 100)}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                        <span>{project.budget_depense.toLocaleString()} FCFA</span>
                        <span className="text-gray-500">/ {project.budget_total.toLocaleString()} FCFA</span>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs border-t pt-3">
                    <div>
                        <p className="text-gray-500">Membres</p>
                        <p className="font-bold">{project.membres}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Tâches</p>
                        <p className="font-bold">{project.taches_terminees}/{project.taches_total}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Risques</p>
                        <p className={`font-bold ${project.risques_critiques > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {project.risques_critiques}
                        </p>
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="mt-4 flex justify-between items-center">
                    <button
                        onClick={() => navigate(`/projet/${project.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Voir les détails →
                    </button>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onDuplicate(project)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                            title="Dupliquer">
                            <ContentCopy fontSize="small" />
                        </button>
                        <button
                            onClick={() => onDelete(project.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                            title="Supprimer">
                            <Delete fontSize="small" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;