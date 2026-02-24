import React, { useState } from 'react';
import TeamList from '../widjets/TeamList';

const Equipe = () => {
    const [members, setMembers] = useState([
        {
            id: 1,
            nom: "Helly Djuma",
            poste: "Chef de projet",
            email: "helly.djuma@email.com",
            competences: ["Gestion", "Agile", "Communication"],
            photo: ""
        },
        {
            id: 2,
            nom: "Ephraim Winter",
            poste: "Développeur Full Stack",
            email: "ephraim.w@email.com",
            competences: ["React", "Node.js", "MongoDB"],
            photo: ""
        },
        {
            id: 3,
            nom: "Kenny Mougou",
            poste: "UI/UX Designer",
            email: "kenny.m@email.com",
            competences: ["Figma", "Adobe XD", "Design System"],
            photo: ""
        },
        {
            id: 4,
            nom: "Benny Woubi",
            poste: "Développeur Backend",
            email: "benny.w@email.com",
            competences: ["Java", "Spring Boot", "PostgreSQL"],
            photo: ""
        },
        {
            id: 5,
            nom: "Sam Rosie",
            poste: "DevOps",
            email: "sam.r@email.com",
            competences: ["Docker", "AWS", "CI/CD"],
            photo: ""
        },
        {
            id: 6,
            nom: "Soso",
            poste: "Testeur QA",
            email: "soso@email.com",
            competences: ["Test manuel", "Cypress", "Jest"],
            photo: ""
        }
    ]);

    const handleAddMember = (newMember) => {
        setMembers(prev => [...prev, newMember]);
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

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-8xl mx-auto px-4 py-2">
                <TeamList
                    members={members}
                    onAddMember={handleAddMember}
                    onEditMember={handleEditMember}
                    onDeleteMember={handleDeleteMember}
                />
            </div>
        </div>
    );
};

export default Equipe;