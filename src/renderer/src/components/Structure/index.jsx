import React, { useState } from 'react';
import { AddCircle } from "@mui/icons-material";
import PhaseList from '../widjets/PhaseList';
import PhaseItem from '../widjets/PhaseItem';
import ModalCreatePhase from '../widjets/CreatePhase';
import ModalEditPhase from '../widjets/ModifiePhase';

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
            ]
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
            ]
        },

        {
            id: 3,
            title: "DEVELOPPEMENT",
            description_phase: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
            date_debut: "16/03/2026",
            date_fin: "30/04/2026",
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
            ]
        },
        {
            id: 4,
            title: "TESTS",
            description_phase: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
            date_debut: "01/05/2026",
            date_fin: "20/05/2026",
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
            ]
        },
        {
            id: 5,
            title: "DEPLOIEMENT",
            description_phase: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
            date_debut: "21/05/2026",
            date_fin: "05/06/2026",
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
            ]
        }

    ]);

    const [showList, setShowList] = useState(true);
    const [selectedId, setSelectedId] = useState(null);

    // États pour les modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [phaseToEdit, setPhaseToEdit] = useState(null);

    const handleViewPhase = (id) => {
        setSelectedId(id);
        setShowList(false);
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
        setPhases(prev => [...prev, newPhase]);
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

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-8xl mx-auto px-4 py-2">
                {/* Header */}
                <div className="bg-gradient-to-r bg-blue rounded-lg shadow-md p-4 flex justify-between items-center mb-8">
                    <h1 className="text-xl text-white font-bold">Structure du projet</h1>
                    <button
                        onClick={handleOpenCreateModal}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md">
                        <AddCircle /> Ajouter une phase
                    </button>
                </div>

                {/* Contenu */}
                {showList ? (
                    <PhaseList
                        phases={phases}
                        onViewPhase={handleViewPhase}
                        onEditPhase={handleOpenEditModal}
                    />
                ) : (
                    <PhaseItem
                        phases={phases}
                        phaseId={selectedId}
                        onBack={handleBack}
                        onEdit={handleEditFromDetail}
                    />
                )}
            </div>

            {/* Modals */}
            <ModalCreatePhase
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreatePhase}
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