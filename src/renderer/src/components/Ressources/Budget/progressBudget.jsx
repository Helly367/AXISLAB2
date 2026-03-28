import React, { useMemo } from 'react';
import { motion } from "framer-motion";
import { formateDate, formatMontant } from '../../../Services/functions';
import { devises } from '../../../Services/listes';
import {
    Code, CurrencyExchange, ShoppingCart, Savings, CalendarToday, TrendingUp, TrendingDown, PlayArrow, CheckCircle, Block
} from "@mui/icons-material";




// Composant principal amélioré
const BudgetPhases = ({ phases, devise, setIsCreateModalOpen }) => {
    const getDeviseSymbol = (code) =>
        devises.find((d) => d.code === code)?.symbole || code;

    const calculerPourcentage = (consomme, prevu) => {
        if (!prevu || prevu === 0) return 0;
        return Math.min(100, Math.round((consomme / prevu) * 100));
    };

    const getStatutPhase = (reste) => {
        if (reste < 0) return { text: 'Dépassement', color: 'text-red-600', icon: <TrendingDown /> };
        if (reste === 0) return { text: 'Épuisé', color: 'text-orange-600', icon: <TrendingUp /> };
        return { text: 'Dans les limites', color: 'text-green-600', icon: <TrendingUp /> };
    };

    const getStatusInfo = (status, reste) => {
        if (status === "encours") {
            return {
                color: 'bg-green-100 text-green-800',
                icon: <PlayArrow className="text-green-600" />,
                label: 'En cours',
                info: reste > 0 ? 'Dans le temps' : 'Dudget fini',
                colorInfo: reste > 0 ? 'text-gray-600 ' : 'text-red-600  ',
            };
        }

        if (status === "termine") {
            return {
                color: 'bg-blue-100 text-blue-800',
                icon: <CheckCircle className="text-blue-600" />,
                label: 'Terminé',
                info: null,
            };
        }

        if (status === "en_pause") {
            return {
                color: 'bg-yellow-100 text-yellow-800',
                icon: <Pause className="text-yellow-600" />,
                label: 'En pause',
                info: reste > 0 ? 'Dans le temps' : 'Budget fini',
                colorInfo: reste > 0 ? 'text-gray-600 ' : 'text-red-600  ',
            };
        }

        // status === "annule" ou autre
        return {
            color: 'bg-red-100 text-red-800',
            icon: <Block className="text-red-600" />,
            label: 'Annulé',
            info: null,
        };
    }






    return (
        <div className="flex flex-col bg-white w-full p-8 gap-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
            {/* En-tête avec statistiques */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl text-gray-800 font-bold">
                        Répartition par phase
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Suivi budgétaire détaillé par phase du projet
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right flex gap-2">
                        <p className="text-sm text-gray-500">Devise</p>
                        <p className="font-semibold text-gray-800">{getDeviseSymbol(devise)}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-200"></div>
                    <div className="text-right flex gap-2">
                        <p className="text-sm text-gray-500">Total phases</p>
                        <p className="font-semibold text-gray-800">{phases.length}</p>
                    </div>
                </div>
            </div>

            {phases && phases.length == 0 ? (
                <div className="text-center py-16 ">
                    <p className="text-gray-500 text-lg font-medium">
                        Aucune phase disponible pour le moment
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        « Découpez votre projet en plusieurs phases pour mieux le structurer et le gérer efficacement. »
                    </p>

                    <button
                        className='px-4 py-2 rounded-[5px] text-white bg-primary mt-8 hover:bg-blue-600'
                        onClick={() => setIsCreateModalOpen(true)}>
                        Ajouter une phase
                    </button>


                </div>

            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 ">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-linear-to-r from-gray-50 to-gray-100 text-gray-800 text-sm font-bold">
                                <th className="p-4 text-left font-semibold">Phase</th>
                                <th className="p-4 text-left font-semibold">Budget prévu</th>
                                <th className="p-4 text-left font-semibold">Budget dépensé</th>
                                <th className="p-4 text-left font-semibold">Reste / Progression</th>
                                <th className="p-4 text-left font-semibold">Échéance</th>
                                <th className="p-4 text-left font-semibold">Statut</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {phases.map((phase, index) => {


                                return (
                                    <tr
                                        key={phase.phase_id || index}
                                        className="hover:bg-blue-50 transition-all duration-200 group">

                                        {/* phase title */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-1 h-8 rounded-full"
                                                    style={{ backgroundColor: '#3B82F6' }}
                                                ></div>
                                                <div>
                                                    <span className="font-medium text-gray-800">{phase.title}</span>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                        <Code sx={{ fontSize: 14 }} />
                                                        <span>ID: {phase.phase_id || `PH-${index + 1}`}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* phase budget */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <CurrencyExchange sx={{ fontSize: 18, color: '#6B7280' }} />
                                                <span className="font-medium text-gray-800">
                                                    {formatMontant(phase.budget_phase || 0)} {getDeviseSymbol(devise)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* phase budget consommer */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <ShoppingCart sx={{ fontSize: 18, color: '#6B7280' }} />
                                                <span className="font-medium text-gray-800">
                                                    {formatMontant(phase.budget_consomme || 0)} {getDeviseSymbol(devise)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* phase budget restant */}
                                        <td className="p-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Savings sx={{ fontSize: 18, color: phase.budget_restant >= 0 ? '#10B981' : '#EF4444' }} />
                                                    <span className={`font-semibold ${phase.budget_restant >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatMontant(Math.abs(phase.budget_restant))} {getDeviseSymbol(devise)}
                                                        {phase.budget_restant < 0 && ' (dépassement)'}
                                                    </span>
                                                </div>

                                                {/* Barre de progression */}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <CalendarToday sx={{ fontSize: 18, color: '#6B7280' }} />
                                                <span className="text-gray-700">{formateDate(phase.created_at)}</span>
                                            </div>
                                        </td>

                                        <td className='p-4'>
                                            <div className="flex items-center gap-2 flex-col">
                                                {(() => {
                                                    const statusInfo = getStatusInfo(phase.status, phase.budget_restant);
                                                    return (
                                                        <>
                                                            <div className='flex'>
                                                                {statusInfo.icon}
                                                                <span className={statusInfo.color}>
                                                                    {statusInfo.label}
                                                                </span>
                                                            </div>
                                                            {statusInfo.info && (
                                                                <span className={`text-xd font-medium ${statusInfo.colorInfo}`}>
                                                                    {statusInfo.info}
                                                                </span>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </td>




                                    </tr>
                                );
                            })}
                        </tbody>

                        {/* Pied de tableau avec totaux */}
                        <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                            <tr>
                                <td className="p-4 font-semibold text-gray-800">Totaux</td>
                                <td className="p-4 font-semibold text-gray-800">
                                    {formatMontant(phases.reduce((acc, p) => acc + (p.budget_phase || 0), 0))} {getDeviseSymbol(devise)}
                                </td>
                                <td className="p-4 font-semibold text-gray-800">
                                    {formatMontant(phases.reduce((acc, p) => acc + (p.budget_consomme || 0), 0))} {getDeviseSymbol(devise)}
                                </td>
                                <td className="p-4 font-semibold" colSpan="3">
                                    <span className={phases.reduce((acc, p) => acc + ((p.budget_phase || 0) - (p.budget_consomme || 0)), 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {formatMontant(Math.abs(phases.reduce((acc, p) => acc + ((p.budget_phase || 0) - (p.budget_consomme || 0)), 0)))} {getDeviseSymbol(devise)}
                                        {phases.reduce((acc, p) => acc + ((p.budget_phase || 0) - (p.budget_consomme || 0)), 0) < 0 && ' (dépassement total)'}
                                    </span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

            )}




        </div>
    );
};



// ---------------- MAIN ----------------
const ProgressBudget = ({ phases, devise, setIsCreateModalOpen }) => {
    return (
        <div className="flex flex-col items-center gap-6 w-full mt-4">
            <BudgetPhases
                phases={phases}
                devise={devise}
                setIsCreateModalOpen={setIsCreateModalOpen} />
        </div>
    );
};

export default ProgressBudget;
