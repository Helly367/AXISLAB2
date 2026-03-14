import React, { useState, useEffect } from 'react';
import {
    Savings, Business, Timeline, PieChart, Edit, Warning, Refresh, Receipt, WarningAmber, CurrencyExchange, Description
} from "@mui/icons-material";
import ConfigBudget from './ConfigBudget';
import PhaseBudgetDetail from './PhaseBudgetDetail';
import ExpensesTracker from './ExpensesTracker';
import CurrencyConverter from './CurrencyConverter';
import JustificatifsList from './JustificatifsList';
import { usePhases } from '../../../hooks/usePhase';
import { alertService } from '../../../functions/alertService';

const BudgetContent = ({ onUpdateBudget }) => {
    const { phases } = usePhases();
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [budgetConfig, setBudgetConfig] = useState({
        type: 'interne',
        montant_total: 0,
        devise: 'USD',
        reste: 0,
        taux_conversion: 1,

    });

    const [activeTab, setActiveTab] = useState('apercu'); // 'apercu', 'depenses', 'justificatifs', 'conversion'






    const getTypeInfo = () => {
        if (budgetConfig.type === 'investissement') {
            return {
                label: "Projet d'investissement",
                icon: <Business className="text-purple-600" />,
                color: 'purple',
                bg: 'bg-purple-100',
                text: 'text-purple-800'
            };
        } else {
            return {
                label: 'Fonds propres',
                icon: <Savings className="text-green-600" />,
                color: 'green',
                bg: 'bg-green-100',
                text: 'text-green-800'
            };
        }
    };

    const typeInfo = getTypeInfo();

    return (
        <div className="w-full p-4 bg-gray-200">
            {/* Header */}
            <div className="bg-primary rounded-lg shadow-md p-4 flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl text-white font-bold">Gestion du budget</h1>
                </div>
                <div className="flex gap-3">

                    <button
                        onClick={() => setIsConfigModalOpen(true)}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md">
                        <Edit /> Configurer
                    </button>
                </div>
            </div>

            {/* Navigation des onglets */}
            <div className="bg-white rounded-lg shadow-md p-2 mb-6 flex gap-2">
                <button
                    onClick={() => setActiveTab('apercu')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'apercu' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                    <PieChart fontSize="small" />
                    Aperçu
                </button>
                <button
                    onClick={() => setActiveTab('depenses')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'depenses' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                    <Receipt fontSize="small" />
                    Dépenses
                </button>
                <button
                    onClick={() => setActiveTab('justificatifs')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'justificatifs' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                    <Description fontSize="small" />
                    Justificatifs
                </button>
                <button
                    onClick={() => setActiveTab('conversion')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'conversion' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                    <CurrencyExchange fontSize="small" />
                    Conversion
                </button>
            </div>




            {activeTab === 'conversion' && (
                <CurrencyConverter
                    budgetConfig={budgetConfig}
                    formatMontant={formatMontant}
                />
            )}



            {/* Modal de configuration */}
            <ConfigBudget
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                phases={phases}
                currentConfig={budgetConfig}
            />
        </div>
    );
};

export default BudgetContent;