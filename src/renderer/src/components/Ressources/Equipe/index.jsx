import React, { useState } from 'react';
import TeamList from '../TeamList';

const Equipe = () => {
    const [members, setMembers] = useState([
        {
            id: 1,
            nom: "Helly Djuma",
            poste: "Chef de projet",
            role: "Chef de projet principal",
            email: "helly.djuma@email.com",
            competences: ["Gestion", "Agile", "Communication"],
            competencesRequises: ["Gestion de projet", "Méthodologie Agile", "Leadership"],
            disponibilite: 80, // Pourcentage de disponibilité
            chargeActuelle: 15, // Heures par semaine
            chargeMax: 40, // Heures maximum par semaine
            dateDebut: "2026-01-15",
            historique: [
                { phase: "ANALYSE", role: "Chef de projet", periode: "Fév 2026" },
                { phase: "CONCEPTION", role: "Chef de projet", periode: "Mars 2026" }
            ],
            photo: ""
        },
        {
            id: 2,
            nom: "Ephraim Winter",
            poste: "Développeur Full Stack",
            role: "Lead développeur Frontend",
            email: "ephraim.w@email.com",
            competences: ["React", "Node.js", "MongoDB", "TypeScript", "GraphQL"],
            competencesRequises: ["React", "Node.js", "TypeScript", "GraphQL"],
            disponibilite: 100,
            chargeActuelle: 35,
            chargeMax: 40,
            dateDebut: "2026-01-15",
            historique: [
                { phase: "CONCEPTION", role: "Architecte technique", periode: "Mars 2026" },
                { phase: "DEVELOPPEMENT", role: "Développeur Frontend", periode: "Avril 2026" }
            ],
            photo: ""
        },
        {
            id: 3,
            nom: "Kenny Mougou",
            poste: "UI/UX Designer",
            role: "Lead Designer",
            email: "kenny.m@email.com",
            competences: ["Figma", "Adobe XD", "Design System", "User Research", "Prototypage"],
            competencesRequises: ["Figma", "Design System", "User Research"],
            disponibilite: 60,
            chargeActuelle: 20,
            chargeMax: 40,
            dateDebut: "2026-02-01",
            historique: [
                { phase: "CONCEPTION", role: "UI/UX Designer", periode: "Mars 2026" }
            ],
            photo: ""
        },
        {
            id: 4,
            nom: "Benny Woubi",
            poste: "Développeur Backend",
            role: "Lead développeur Backend",
            email: "benny.w@email.com",
            competences: ["Java", "Spring Boot", "PostgreSQL", "Microservices", "Docker"],
            competencesRequises: ["Java", "Spring Boot", "PostgreSQL", "Microservices"],
            disponibilite: 90,
            chargeActuelle: 32,
            chargeMax: 40,
            dateDebut: "2026-01-20",
            historique: [
                { phase: "CONCEPTION", role: "Architecte Backend", periode: "Mars 2026" },
                { phase: "DEVELOPPEMENT", role: "Développeur Backend", periode: "Avril 2026" }
            ],
            photo: ""
        },
        {
            id: 5,
            nom: "Sam Rosie",
            poste: "DevOps",
            role: "Ingénieur DevOps",
            email: "sam.r@email.com",
            competences: ["Docker", "AWS", "CI/CD", "Kubernetes", "Terraform"],
            competencesRequises: ["Docker", "AWS", "CI/CD", "Kubernetes"],
            disponibilite: 70,
            chargeActuelle: 25,
            chargeMax: 40,
            dateDebut: "2026-03-01",
            historique: [
                { phase: "DEVELOPPEMENT", role: "DevOps", periode: "Avril 2026" }
            ],
            photo: ""
        },
        {
            id: 6,
            nom: "Soso",
            poste: "Testeur QA",
            role: "Lead QA",
            email: "soso@email.com",
            competences: ["Test manuel", "Cypress", "Jest", "Test automatisé", "Performance"],
            competencesRequises: ["Test manuel", "Cypress", "Test automatisé"],
            disponibilite: 100,
            chargeActuelle: 30,
            chargeMax: 40,
            dateDebut: "2026-02-15",
            historique: [],
            photo: ""
        }
    ]);

    const [viewMode, setViewMode] = useState('grid'); // 'grid', 'table', 'availability'

    const handleAddMember = (newMember) => {
        setMembers(prev => [...prev, { ...newMember, id: Date.now(), historique: [] }]);
    };

    const handleEditMember = (updatedMember) => {
        setMembers(prev => prev.map(m =>
            m.id === updatedMember.id ? updatedMember : m
        ));
    };

    const handleDeleteMember = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
            setMembers(prev => prev.filter(m => m.id !== id));
        }
    };

    const handleUpdateAvailability = (memberId, nouvelleDisponibilite) => {
        setMembers(prev => prev.map(m =>
            m.id === memberId ? { ...m, disponibilite: nouvelleDisponibilite } : m
        ));
    };

    // Statistiques de l'équipe
    const teamStats = {
        total: members.length,
        disponibiliteMoyenne: Math.round(members.reduce((acc, m) => acc + m.disponibilite, 0) / members.length),
        chargeMoyenne: Math.round(members.reduce((acc, m) => acc + (m.chargeActuelle / m.chargeMax * 100), 0) / members.length),
        competencesManquantes: identifyMissingSkills(members)
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-8xl mx-auto px-4 py-2">
                {/* Header avec statistiques */}
                <div className="bg-primary rounded-lg shadow-md p-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl text-white font-bold">Équipe projet</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-600' : 'bg-blue-700 text-white'
                                    }`}>
                                Vue Grille
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'table' ? 'bg-white text-blue-600' : 'bg-blue-700 text-white'
                                    }`}>
                                Vue Tableau
                            </button>
                            <button
                                onClick={() => setViewMode('availability')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'availability' ? 'bg-white text-blue-600' : 'bg-blue-700 text-white'
                                    }`}>
                                Disponibilités
                            </button>
                        </div>
                    </div>

                    {/* Cartes statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white  rounded-lg p-4">
                            <p className="text-primary text-sm">Total membres</p>
                            <p className="text-primary text-2xl font-bold">{teamStats.total}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-primary text-sm">Disponibilité moyenne</p>
                            <p className="text-primary text-2xl font-bold">{teamStats.disponibiliteMoyenne}%</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <p className="text-primary text-sm">Charge moyenne</p>
                            <p className="text-primary text-2xl font-bold">{teamStats.chargeMoyenne}%</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <p className="text-primary text-sm">Compétences manquantes</p>
                            <p className="text-primary text-2xl font-bold">{teamStats.competencesManquantes.length}</p>
                        </div>
                    </div>
                </div>

                {/* Liste des membres selon la vue */}
                <TeamList
                    members={members}
                    onAddMember={handleAddMember}
                    onEditMember={handleEditMember}
                    onDeleteMember={handleDeleteMember}
                    onUpdateAvailability={handleUpdateAvailability}
                    viewMode={viewMode}
                />
            </div>
        </div>
    );
};

// Fonction pour identifier les compétences manquantes dans l'équipe
const identifyMissingSkills = (members) => {
    const allSkills = new Set();
    const requiredSkills = new Set();

    members.forEach(member => {
        member.competences.forEach(skill => allSkills.add(skill));
        member.competencesRequises?.forEach(skill => requiredSkills.add(skill));
    });

    const missingSkills = [];
    requiredSkills.forEach(skill => {
        if (!allSkills.has(skill)) {
            missingSkills.push(skill);
        }
    });

    return missingSkills;
};

export default Equipe;