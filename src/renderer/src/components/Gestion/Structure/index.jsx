import React, { useState } from 'react';
import { AddCircle, Timeline, Link, Flag } from "@mui/icons-material";
import PhaseList from '../PhaseList';
import PhaseItem from '../PhaseItem';
import ModalCreatePhase from '../CreatePhase';
import ModalEditPhase from '../ModifiePhase';
import GanttDiagram from '../GanttDiagram';
import DependenciesManager from '../DependenciesManager';
import MilestonesList from '../MilestonesList';

const StructureProjet = () => {
    const [phases, setPhases] = useState([
        {
            id: 1,
            title: "ANALYSE",
            description_phase: "Phase d'analyse des besoins et spécifications du projet.",
            date_debut: "2026-02-01",
            date_fin: "2026-02-25",
            taches: [
                "Analyse des besoins clients",
                "Etude de faisabilité",
                "Spécifications fonctionnelles"
            ],
            membres: [
                "Helly Djuma",
                "Ephraim Winter"
            ],
            couleur: "#3B82F6", // Bleu
            progression: 100
        },
        {
            id: 2,
            title: "CONCEPTION",
            description_phase: "Conception technique et architecture du projet.",
            date_debut: "2026-02-26",
            date_fin: "2026-03-15",
            taches: [
                "Architecture technique",
                "Maquettage UI/UX",
                "Modélisation base de données"
            ],
            membres: [
                "Helly Djuma",
                "Ephraim Winter",
                "Kenny Mougou"
            ],
            couleur: "#10B981", // Vert
            progression: 75
        },
        {
            id: 3,
            title: "DEVELOPPEMENT",
            description_phase: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
            date_debut: "2026-03-16",
            date_fin: "2026-04-30",
            taches: [
                "Mise en place environnement",
                "Développement frontend",
                "Développement backend",
                "Tests unitaires",
                "Intégration continue"
            ],
            membres: [
                "Helly Djuma",
                "Ephraim Winter",
                "Kenny Mougou",
                "Benny Woubi",
                "Sam Rosie"
            ],
            couleur: "#F59E0B", // Orange
            progression: 30
        },
        {
            id: 4,
            title: "TESTS",
            description_phase: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
            date_debut: "2026-05-01",
            date_fin: "2026-05-20",
            taches: [
                "Tests fonctionnels",
                "Tests d'intégration",
                "Tests de performance",
                "Correction des bugs",
                "Validation client"
            ],
            membres: [
                "Helly Djuma",
                "Ephraim Winter",
                "Kenny Mougou",
                "Sam Rosie"
            ],
            couleur: "#EF4444", // Rouge
            progression: 0
        },
        {
            id: 5,
            title: "DEPLOIEMENT",
            description_phase: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
            date_debut: "2026-05-21",
            date_fin: "2026-06-05",
            taches: [
                "Préparation serveurs",
                "Déploiement production",
                "Formation utilisateurs",
                "Documentation technique",
                "Support post-déploiement"
            ],
            membres: [
                "Helly Djuma",
                "Ephraim Winter",
                "Kenny Mougou"
            ],
            couleur: "#8B5CF6", // Violet
            progression: 0
        }
    ]);

    // États pour les dépendances
    const [dependencies, setDependencies] = useState([
        { from: 1, to: 2 }, // ANALYSE -> CONCEPTION
        { from: 2, to: 3 }, // CONCEPTION -> DEVELOPPEMENT
        { from: 3, to: 4 }, // DEVELOPPEMENT -> TESTS
        { from: 4, to: 5 }  // TESTS -> DEPLOIEMENT
    ]);

    // États pour les jalons
    const [milestones, setMilestones] = useState([
        {
            id: 1,
            title: "Validation du cahier des charges",
            date: "2026-02-25",
            phaseId: 1,
            type: "validation",
            description: "Validation client du cahier des charges"
        },
        {
            id: 2,
            title: "Revue de conception",
            date: "2026-03-15",
            phaseId: 2,
            type: "revue",
            description: "Validation de l'architecture technique"
        },
        {
            id: 3,
            title: "Premier prototype",
            date: "2026-04-15",
            phaseId: 3,
            type: "livrable",
            description: "Prototype fonctionnel à présenter"
        },
        {
            id: 4,
            title: "Recette client",
            date: "2026-05-20",
            phaseId: 4,
            type: "validation",
            description: "Validation finale par le client"
        },
        {
            id: 5,
            title: "Mise en production",
            date: "2026-06-05",
            phaseId: 5,
            type: "livrable",
            description: "Déploiement en production"
        }
    ]);

    const [showList, setShowList] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [activeView, setActiveView] = useState('list'); // 'list', 'gantt', 'dependencies', 'milestones'

    // États pour les modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [phaseToEdit, setPhaseToEdit] = useState(null);

    const handleViewPhase = (id) => {
        setSelectedId(id);
        setShowList(false);
        setActiveView('list');
    };

    const handleBack = () => {
        setShowList(true);
        setSelectedId(null);
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (phase) => {
        setPhaseToEdit(phase);
        setIsEditModalOpen(true);
    };

    const handleCreatePhase = (newPhase) => {
        setPhases(prev => [...prev, { ...newPhase, id: Date.now(), couleur: getRandomColor(), progression: 0 }]);
    };

    const handleEditPhase = (updatedPhase) => {
        setPhases(prev => prev.map(p =>
            p.id === updatedPhase.id ? updatedPhase : p
        ));
    };

    const handleEditFromDetail = () => {
        const phase = phases.find(p => p.id === selectedId);
        handleOpenEditModal(phase);
    };

    const getRandomColor = () => {
        const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#6366F1"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Vérifier les dépendances
    const checkDependencies = (phaseId) => {
        const phaseDeps = dependencies.filter(d => d.to === phaseId);
        for (const dep of phaseDeps) {
            const depPhase = phases.find(p => p.id === dep.from);
            if (!depPhase || depPhase.progression < 100) {
                return false;
            }
        }
        return true;
    };

    return (
        <div className="min-h-screen bg-gray-200">
            <div className="max-w-8xl mx-auto px-4 py-2">
                {/* Header */}
                <div className="bg-primary rounded-lg shadow-md p-4 flex justify-between items-center mb-4">
                    <h1 className="text-xl text-white font-bold">Structure du projet</h1>
                    <button
                        onClick={handleOpenCreateModal}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md">
                        <AddCircle /> Ajouter une phase
                    </button>
                </div>

                {/* Navigation des vues */}
                <div className="bg-white rounded-lg shadow-md p-2 mb-4 flex gap-2">
                    <button
                        onClick={() => {
                            setActiveView('list');
                            setShowList(true);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeView === 'list'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}>
                        Liste des phases
                    </button>
                    <button
                        onClick={() => setActiveView('gantt')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeView === 'gantt'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}>
                        <Timeline fontSize="small" />
                        Diagramme de Gantt
                    </button>
                    <button
                        onClick={() => setActiveView('dependencies')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeView === 'dependencies'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}>
                        <Link fontSize="small" />
                        Dépendances
                    </button>
                    <button
                        onClick={() => setActiveView('milestones')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeView === 'milestones'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}>
                        <Flag fontSize="small" />
                        Jalons
                    </button>
                </div>

                {/* Contenu selon la vue */}
                {activeView === 'list' && (
                    <>
                        {showList ? (
                            <PhaseList
                                phases={phases}
                                onViewPhase={handleViewPhase}
                                onEditPhase={handleOpenEditModal}
                                dependencies={dependencies}
                                checkDependencies={checkDependencies}
                            />
                        ) : (
                            <PhaseItem
                                phases={phases}
                                phaseId={selectedId}
                                onBack={handleBack}
                                onEdit={handleEditFromDetail}
                                milestones={milestones.filter(m => m.phaseId === selectedId)}
                            />
                        )}
                    </>
                )}

                {activeView === 'gantt' && (
                    <GanttDiagram
                        phases={phases}
                        dependencies={dependencies}
                        milestones={milestones}
                        onPhaseClick={handleViewPhase}
                    />
                )}

                {activeView === 'dependencies' && (
                    <DependenciesManager
                        phases={phases}
                        dependencies={dependencies}
                        onUpdateDependencies={setDependencies}
                    />
                )}

                {activeView === 'milestones' && (
                    <MilestonesList
                        phases={phases}
                        milestones={milestones}
                        onUpdateMilestones={setMilestones}
                    />
                )}
            </div>

            {/* Modals */}
            <ModalCreatePhase
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreatePhase}
                phases={phases}
            />

            <ModalEditPhase
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setPhaseToEdit(null);
                }}
                onSave={handleEditPhase}
                phaseToEdit={phaseToEdit}
            />
        </div>
    );
};

export default StructureProjet;