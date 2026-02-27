import React from 'react';
import {
    FilterList,
    Sort,
    GridView,
    List,
    Star,
    CalendarToday,
    TrendingUp,
    AttachMoney
} from "@mui/icons-material";

const ProjectFilters = ({ filters, setFilters, sortBy, setSortBy, viewMode, setViewMode }) => {
    return (
        <>
            {/* Filtres déroulants */}
            <select
                value={filters.statut}
                onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="all">Tous statuts</option>
                <option value="en_cours">En cours</option>
                <option value="planifie">Planifié</option>
                <option value="termine">Terminé</option>
                <option value="en_pause">En pause</option>
            </select>

            <select
                value={filters.priorite}
                onChange={(e) => setFilters({ ...filters, priorite: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="all">Toutes priorités</option>
                <option value="haute">Haute</option>
                <option value="moyenne">Moyenne</option>
                <option value="basse">Basse</option>
            </select>

            <select
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="all">Toutes dates</option>
                <option value="mois">Échéance ce mois</option>
                <option value="trimestre">Échéance ce trimestre</option>
            </select>

            {/* Filtre favoris */}
            <button
                onClick={() => setFilters({ ...filters, favoris: !filters.favoris })}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${filters.favoris
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                <Star className={filters.favoris ? 'text-yellow-500' : 'text-gray-400'} fontSize="small" />
                Favoris
            </button>

            {/* Tri */}
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="date_desc">Plus récents</option>
                <option value="date_asc">Plus anciens</option>
                <option value="nom">Ordre alphabétique</option>
                <option value="progression">Progression</option>
                <option value="budget">Budget</option>
            </select>

            {/* Vue grille/liste */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                    <GridView fontSize="small" />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                    <List fontSize="small" />
                </button>
            </div>
        </>
    );
};

export default ProjectFilters;