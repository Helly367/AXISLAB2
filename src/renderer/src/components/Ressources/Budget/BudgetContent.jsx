import React, { useState, useEffect } from 'react';
import {
    Savings, Business, Timeline, PieChart, Edit, Warning, Refresh, Receipt, WarningAmber, CurrencyExchange, Description
} from "@mui/icons-material";
import ConfigBudget from './ConfigBudget';
import CurrencyConverter from './CurrencyConverter';
import { usePhases } from '../../../hooks/usePhase';
import { useBudgets } from '../../../hooks/useBudgets';
import { useProjects } from '../../../hooks/useProjets';
import BudgetCard from './BudgetCard';
import ProgressBudget from './progressBudget';
import ModalCreatePhase from '../../Gestion/Structure/Phases/CreatePhase';
import BudgetDepenses from './BudgetDepenses';


const BudgetContent = ({ onUpdateBudget, project }) => {
    const { budget, devise, convertionBudget } = useBudgets();
    const { phases } = usePhases();
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


    const [activeTab, setActiveTab] = useState('apercu'); // 'apercu', 'depenses', 'justificatifs', 'conversion'


    return (
        <div className="min-h-screen bg-gray-200 px-4">

            <div className='max-w-8xl mx-auto flex flex-col items-center  '>

                {/* Header */}
                <div className="w-full bg-primary rounded-lg shadow-md py-2 px-3 flex justify-between items-center ">
                    <div className="flex items-center gap-3 ">
                        <h1 className="text-2xd text-white font-bold">Gestion du budget</h1>
                    </div>
                    <div className="flex gap-3">

                        <button
                            onClick={() => setIsConfigModalOpen(true)}
                            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md text-2xd">
                            <Edit /> Configurer
                        </button>
                    </div>
                </div>

                <BudgetCard
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    budget={budget}
                />

                {activeTab === 'apercu' && (
                    <ProgressBudget
                        phases={phases}
                        devise={devise}
                        setIsCreateModalOpen={setIsCreateModalOpen}


                    />
                )}

                {activeTab === 'depense' && (
                    <BudgetDepenses />
                )}


                {activeTab === 'conversion' && (
                    <CurrencyConverter
                        budget={budget}
                        convertionBudget={convertionBudget}
                        projet_id={project.projet_id}

                    />
                )}




                {/* Modal de configuration */}
                <ConfigBudget
                    isOpen={isConfigModalOpen}
                    onClose={() => setIsConfigModalOpen(false)}
                    phases={phases}
                    currentConfig={budget}
                    project={project}
                />

                <ModalCreatePhase
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    project={project}
                />
            </div>
        </div>
    );
};

export default BudgetContent;