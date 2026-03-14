import React, { useState, useMemo } from 'react';
import EquipeList from './EquipeList';
import { useMembres } from '../../../hooks/useMembers';

const EquipeContnent = ({ project }) => {

    const { membres } = useMembres();


    return (
        <div className="min-h-screen bg-gray-100">

            <div className="max-w-8xl mx-auto px-4 py-2">

                {/* Header stats */}
                <div className="bg-primary rounded-lg shadow-md p-4 mb-6 flex justify-between">

                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl text-white font-bold">
                            Équipe projet
                        </h1>


                    </div>

                    <StatCard
                        label="Total membres"
                        value={membres.length}
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
        <p className="text-primary text-[16px] font-bold">{label}</p>
        <p className="text-primary text-xl font-bold">{value}</p>
    </div>
);

export default EquipeContnent;