import React from 'react';
import {
    PieChart, CurrencyExchange, AccountBalance, AttachMoney, MonetizationOn, MoneyOff,
    ShoppingCart, Savings, BarChart,
    Business

} from '@mui/icons-material';
import { formatMontant, getDeviseSymbol, formateMontantSimple } from '../../../Services/functions';
import { devises } from '../../../Services/listes';
import { Code } from 'lucide-react';

const BudgetNav = ({ setActiveTab, activeTab }) => {
    return (
        <div className="w-full bg-white rounded-lg shadow-md p-2 mt-3 flex gap-2">
            <button
                onClick={() => setActiveTab('apercu')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'apercu' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}>
                <PieChart fontSize="small" />
                Aperçu
            </button>

            <button
                onClick={() => setActiveTab('depense')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'depense' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}>
                <AttachMoney fontSize="small" />
                Dépenses
            </button>

            <button
                onClick={() => setActiveTab('conversion')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'conversion' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}>
                <CurrencyExchange fontSize="small" />
                Conversion
            </button>
        </div>
    );
};

const BudgetRender = ({ typeInfo, budget }) => {
    const montantTotal = Number(budget?.budget_total || 0);
    const montantDepense = Number(budget?.budget_depense || 0);
    const montantReste = Number(budget?.budget_restant || 0);
    const montantReserver = Number(budget?.reserve || 0);
    const devise = budget?.devise || 'USD';
    const typebudget = budget?.type;

    const selectType = (typebudget) => {

        if (typebudget && typebudget === 'investissement') {
            return {
                titre: "investissement",
                icon: <Business />,
                style: 'bg-green-600'
            }
        } else if (typebudget && typebudget === 'interne') {
            return {
                titre: "interne",
                icon: <Savings />,
                style: 'bg-orange-600'
            }

        } else {
            return {
                titre: "non defini",
                icon: <Code />,
                style: 'bg-black'
            }
        }

    }

    const { titre, icon, style } = selectType(typebudget);

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 sm:grid-cols-4 gap-6 ">
            {/* Carte type de projet */}
            <div className='bg-white flex flex-col gap-3 items-center justify-center rounded-[5px]'>
                <h3 className='text-2xd text-primary font-bold'>Type du budget</h3>
                <div className={` ${style}  flex items-center gap-2 text-white px-8 py-2 rounded-[5px]`}>
                    {icon}
                    <span>{titre}</span>
                </div>

            </div>

            {/* Carte budget total */}
            <div
                title={`montant total : ${formateMontantSimple(montantTotal)} ${getDeviseSymbol(devise, devises)}`}
                className="bg-white rounded-lg shadow-md h-30 flex  items-center justify-center px-3 py-5 gap-5">

                <span className='w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl'>
                    <MonetizationOn fontSize='medium' />
                </span>

                <div className=''>
                    <div className='flex items-center justify-center gap-3'>
                        <span className="text-2xl font-bold text-primary">
                            {formatMontant(montantTotal)}
                        </span>
                        <span className='text-2xl font-bold text-primary'>
                            {getDeviseSymbol(devise, devises)}
                        </span>
                    </div>

                    <h3 className="text-gray-700 text-sm font-bold">Budget total</h3>


                </div>

            </div>

            {/* Carte dépenses */}
            <div

                title={`  Ceci correspond à la somme des montants que vous avez répartis\n montant total : ${formateMontantSimple(montantDepense)} ${getDeviseSymbol(devise, devises)}`}
                className="bg-white rounded-lg shadow-md h-30 flex  items-center justify-center px-3 py-5 gap-5">

                <span className='w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl'>
                    <ShoppingCart fontSize='medium' />
                </span>

                <div className='flex flex-col items-start justify-center'>

                    <div className='flex items-center justify-center gap-3'>
                        <span className="text-2xl font-bold text-green-600">
                            {formatMontant(montantDepense)}
                        </span>
                        <span className='text-2xl font-bold text-green-600'>
                            {getDeviseSymbol(devise, devises)}
                        </span>
                    </div>
                    <h3 className="text-gray-700 text-sm font-bold">Budget Dépensé</h3>
                </div>

            </div>

            {/* Carte reste */}
            <div
                title={`budget restant total : \n${formateMontantSimple(montantReste)} ${getDeviseSymbol(devise, devises)}`}
                className="bg-white rounded-lg shadow-md h-30 flex items-center justify-center px-3 py-5 gap-5">

                <span className='w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-3xl'>
                    <Savings fontSize='medium' />
                </span>

                <div>

                    <div className='flex items-center justify-center gap-3'>
                        <span className={`text-2xl font-bold text-orange-600 ${montantReste >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatMontant(montantReste)}
                        </span>
                        <span className='text-2xl font-bold text-orange-600'>
                            {getDeviseSymbol(devise, devises)}
                        </span>
                    </div>
                    <h3 className="text-gray-700 text-sm font-bold">budget restant</h3>

                </div>


                {montantReste < 0 && (
                    <p className="text-sm text-red-500 mt-2">
                        Dépassement du budget
                    </p>
                )}
            </div>

            {/* Carte reserve */}
            <div
                title={`montant total reservé :\n ${formateMontantSimple(montantReserver)} ${getDeviseSymbol(devise, devises)}`}
                className="bg-white rounded-lg shadow-md h-30 flex items-center justify-center px-3 py-5 gap-5">

                <span className='w-10 h-10 rounded-full bg-gray-200 text-black flex items-center justify-center text-3xl'>
                    <BarChart fontSize='medium' />
                </span>

                <div>

                    <div className='flex items-center justify-center gap-3'>
                        <span className='text-2xl font-bold text-black'>
                            {formatMontant(montantReserver)}
                        </span>
                        <span className='text-2xl font-bold text-black'>
                            {getDeviseSymbol(devise, devises)}
                        </span>
                    </div>
                    <h3 className="text-gray-700 text-sm font-bold">budget resevé</h3>

                </div>


                {montantReste < 0 && (
                    <p className="text-sm text-red-500 mt-2">
                        Dépassement du budget
                    </p>
                )}
            </div>
        </div>
    );
};

const BudgetCard = ({ typeInfo, setActiveTab, activeTab, budget }) => {

    if (!budget) {
        return (
            <div className="w-full mt-6 bg-white rounded-lg shadow-md p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-700">
                    Aucun budget configuré pour ce projet
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                    Configurez un budget pour commencer à suivre les dépenses du projet.
                </p>
            </div>
        );
    }

    return (
        <div className='w-full flex flex-col  mt-4'>
            <BudgetRender
                typeInfo={typeInfo}
                budget={budget}

            />
            <BudgetNav setActiveTab={setActiveTab} activeTab={activeTab} />
        </div>
    );
};

export default BudgetCard;