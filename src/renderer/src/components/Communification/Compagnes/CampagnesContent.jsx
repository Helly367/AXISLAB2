import React, { useState } from 'react';
import {
    Campaign,
    Add,
    Edit,
    Delete,
    LocationOn,
    Category,
    AttachMoney,
    CalendarToday,
    PlayArrow,
    Pause,
    CheckCircle,
    Block,
    Info,
    Assessment,
    Schedule,

} from "@mui/icons-material";
import ModalAddCampagne from './ModalAddCampagne';
import ModalEditCampagne from './ModalEditCampagne';
import CampaignPlanning from './CampaignPlanning';
import CampaignResults from './CampaignResults';
import CampaignBudget from './CampaignBudget';
import { useCampagnes } from '../../../hooks/useCampagnes';
import { useBudgets } from '../../../hooks/useBudgets';
import { formateMontantSimple } from '../../../Services/functions';



const CampagnesContent = ({ onUpdateCampagnes, budgetGlobal, project }) => {
    const { campagnes } = useCampagnes();
    const { setBudget, budget } = useBudgets();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [campagneToEdit, setCampagneToEdit] = useState(null);
    const [filter, setFilter] = useState('all');
    const [activeView, setActiveView] = useState('liste'); // 'liste', 'planning', 'resultats', 'budget'
    const [selectedCampagne, setSelectedCampagne] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');


    // Statistiques avancées
    const stats = {
        total: campagnes.length,
        en_cours: campagnes.filter(c => c.status === 'en_cours').length,
        termine: campagnes.filter(c => c.status === 'termine').length,
        inactif: campagnes.filter(c => c.status === 'inactif').length,
        en_pause: campagnes.filter(c => c.status === 'en_pause').length,
        totalCout: campagnes.reduce((acc, c) => acc + c.cout, 0),
        totalDepensesReelles: campagnes.reduce((acc, c) =>
            acc + (c.depenses_reelles?.reduce((sum, d) => sum + d.montant, 0) || 0), 0),
        coutMoyen: campagnes.length > 0
            ? campagnes.reduce((acc, c) => acc + c.cout, 0) / campagnes.length
            : 0,
        objectifsMoyens: campagnes.reduce((acc, c) =>
            acc + (c.resultats?.objectifs_atteints || 0), 0) / campagnes.length,
        budgetRestantGlobal: budgetGlobal - campagnes.reduce((acc, c) => acc + c.cout, 0)
    };

    const devise = budget?.devise || "USD";


    const handleOpenEditModal = (campagne) => {
        setCampagneToEdit(campagne);
        setIsEditModalOpen(true);
    };

    const handleViewCampagne = (campagne, view) => {
        setSelectedCampagne(campagne);
        setActiveView(view);
    };

    const handleBack = () => {
        setSelectedCampagne(null);
        setActiveView('liste');
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'en_cours':
                return {
                    color: 'bg-green-100 text-green-800',
                    icon: <PlayArrow className="text-green-600" fontSize="small" />,
                    label: 'En cours'
                };
            case 'termine':
                return {
                    color: 'bg-blue-100 text-blue-800',
                    icon: <CheckCircle className="text-blue-600" fontSize="small" />,
                    label: 'Terminé'
                };
            case 'inactif':
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: <Block className="text-gray-600" fontSize="small" />,
                    label: 'Inactif'
                };
            case 'en_pause':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: <Pause className="text-yellow-600" fontSize="small" />,
                    label: 'En pause'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: <Info className="text-gray-600" fontSize="small" />,
                    label: status
                };
        }
    };

    const getProgressionColor = (progression) => {
        if (progression >= 75) return 'text-green-600';
        if (progression >= 50) return 'text-yellow-600';
        if (progression >= 25) return 'text-orange-600';
        return 'text-red-600';
    };

    // Filtrer les campagnes
    const campagnesFiltrees = filter === 'all'
        ? campagnes
        : campagnes.filter(c => c.status === filter);

    // Si une campagne est sélectionnée pour une vue détaillée
    if (selectedCampagne) {
        switch (activeView) {
            case 'planning':
                return (
                    <CampaignPlanning
                        campagne={selectedCampagne}
                        onBack={handleBack}
                        project={project}
                    />
                );
            case 'resultats':
                return (
                    <CampaignResults
                        campagne={selectedCampagne}
                        onBack={handleBack}
                    />
                );
            case 'budget':
                return (
                    <CampaignBudget
                        campagne={selectedCampagne}
                        onBack={handleBack}
                        budgetGlobal={budgetGlobal}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <div className="min-h-screen bg-gray-200">
            <div className='max-w-8xl mx-auto px-4 py-2 mb-4'>

                <div className="bg-primary rounded-lg shadow-md p-1.5 px-2 flex justify-between items-center">

                    <h1 className="text-2xd text-white font-bold">
                        Campagnes du projet
                    </h1>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md"
                    >
                        <Add /> Nouvelle campagne
                    </button>
                </div>

                <div className='flex items-center justify-between mt-4 w-full gap-20 '>

                    <input type="text"
                        placeholder="recherchez un materiel"
                        value={searchTerm}
                        maxLength={80} // limite stricte
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            if (e.target.value.length > 80) {
                                e.target.value = e.target.value.slice(0, 80);
                            }

                        }}
                        className="w-150 px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                           focus:outline-none focus:bg-white focus:border-blue-500
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    {/* Filtres */}
                    <div className="bg-white rounded-lg shadow-md  flex items-center  gap-2  p-2 ">
                        <button
                            onClick={() => setFilter('all')}
                            className={` flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}>
                            Toutes ({campagnes.length})
                        </button>
                        <button
                            onClick={() => setFilter('en_cours')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'en_cours'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}>
                            En cours ({stats.en_cours})
                        </button>
                        <button
                            onClick={() => setFilter('termine')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'termine'
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}>
                            Terminées ({stats.termine})
                        </button>
                        <button
                            onClick={() => setFilter('en_pause')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'en_pause'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                }`}>
                            En pause ({stats.en_pause})
                        </button>
                        <button
                            onClick={() => setFilter('inactif')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'inactif'
                                ? 'bg-gray-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}>
                            Inactives ({stats.inactif})
                        </button>
                    </div>

                </div>


            {/* Liste des campagnes */}
            {campagnesFiltrees.length > 0 ? (
                    <div className="grid grid-cols-3  gap-6 mt-4 pb-4">

                    {campagnesFiltrees.map((campagne) => {
                        const statusInfo = getStatusInfo(campagne.status);
                        const dateDebut = new Date(campagne.date_debut).toLocaleDateString('fr-FR');
                        const dateFin = new Date(campagne.date_fin).toLocaleDateString('fr-FR');
                        const totalDepense = campagne.depenses_reelles?.reduce((sum, d) => sum + d.montant, 0) || 0;
                        const budgetRestant = campagne.budgetAlloue - totalDepense;

                        return (
                            <div
                                key={campagne.campagne_id}
                                className="flex flex-col items-start justify-between bg-white rounded-lg shadow-md  p-4 relative group">

                                {/* Image ou icône */}
                                <div className=" flex w-full justify-between gap-2 shadow-sm p-2 bg-gray-100">

                                    <div>
                                        <Campaign className="text-blue-600 text-6xl" />
                                    </div>

                                    <span className={`flex self-start px-3 py-1 rounded-full text-xs font-medium items-center gap-1 ${statusInfo.color}`}>
                                        {statusInfo.icon}
                                        {statusInfo.label}
                                    </span>

                                </div>

                                <div className='flex flex-col gap-1 mt-4'>
                                    {/* Nom */}
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{campagne.nom_compagne}</h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {campagne.description}
                                    </p>


                                </div>


                                {/* Informations principales */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <LocationOn fontSize="small" className="text-blue-500" />
                                        <span className="text-sm">{campagne.ville}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Category fontSize="small" className="text-purple-500" />
                                        <span className="text-sm">{campagne.secteur}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <AttachMoney fontSize="small" className="text-green-500" />
                                        <span className="text-sm font-medium">
                                            {formateMontantSimple(campagne.cout)} {devise}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CalendarToday fontSize="small" className="text-orange-500" />
                                        <span className="text-sm">{dateDebut} - {dateFin}</span>
                                    </div>
                                </div>


                                {/* Budget restant */}
                                {campagne.status === 'en_cours' && (
                                    <div className={`text-xs p-2 rounded-lg ${budgetRestant < 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                        Budget restant: {budgetRestant.toLocaleString()} {devise}
                                        {budgetRestant < 0 && ' (dépassement)'}
                                    </div>
                                )}

                                {/* Objectif et responsable */}
                                <div className="border-t pt-3 mt-3">
                                    <p className="text-sm text-gray-500 mb-1">
                                        <span className="font-medium">Objectif:</span> {campagne.objectif}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Responsable:</span> {campagne.responsable}
                                    </p>
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex items-center gap-2 self-end mt-4">
                                    <button
                                        onClick={() => handleViewCampagne(campagne, 'planning')}
                                        className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
                                        title="Planification">
                                        <Schedule fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => handleViewCampagne(campagne, 'resultats')}
                                        className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                                        title="Résultats">
                                        <Assessment fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => handleViewCampagne(campagne, 'budget')}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                                        title="Budget">
                                        <AttachMoney fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenEditModal(campagne)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                        <Edit fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCampagne(campagne.id)}
                                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                                        <Delete fontSize="small" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <Campaign className="text-gray-400 text-6xl mx-auto mb-4" />
                    <h3 className="text-xl text-gray-600 font-medium mb-2">Aucune campagne</h3>
                    <p className="text-gray-500 mb-6">Commencez par créer une nouvelle campagne</p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                        <Add /> Créer une campagne
                    </button>
                </div>
            )}

            {/* Modals */}
            <ModalAddCampagne
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                    project={project}
            />

            <ModalEditCampagne
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setCampagneToEdit(null);
                }}

                campagneToEdit={campagneToEdit}
                />
            </div>
        </div>
    );
};

export default CampagnesContent;