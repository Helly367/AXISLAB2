import React, { useState, useMemo } from 'react';
import EquipeList from './EquipeList';
import { useMembres } from '../../../hooks/useMembers';

const EquipeContnent = ({ project }) => {

    const { membres } = useMembres();


    return (
        <div className="min-h-screen bg-gray-200 px-4">

            <div className="max-w-8xl mx-auto flex flex-col items-center">

                {/* Header stats */}
                <div className="w-full bg-primary rounded-lg shadow-md py-2 px-3 flex justify-between items-center">

                    <div className="flex justify-between items-center">
                        <h1 className="text-2xd text-white font-bold">
                            Équipe projet
                        </h1>
                    </div>

                    <StatCard
                        label="Total membres"
                        value={membres?.length}
                    />

                </div>

                {/* Team List */}
                <EquipeList project={project} />

            </div>
        </div>
    );
};



const StatCard = ({ label, value }) => (
    <div className="bg-white rounded-lg p-2 shadow-sm flex items-center gap-4">
        <p className="text-primary text-2xd font-bold">{label}</p>
        <p className="text-primary text-xl font-bold">{value}</p>
    </div>
);

export default EquipeContnent;