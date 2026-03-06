import React from 'react';
import { AccessTime, Warning, TrendingUp, Edit } from "@mui/icons-material";

const AvailabilityChart = ({ members = [], onUpdateAvailability, onAddMember }) => {

    if (!members.length) {
        return (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <p className="text-gray-500 text-lg">
                    Aucun membre disponible pour l’analyse de charge
                </p>

                <button
                    onClick={onAddMember}
                    className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
                    Ajouter un membre
                </button>
            </div>
        );
    }

    const totalCharge = members.reduce((acc, m) => acc + (m.chargeActuelle || 0), 0);

    const capaciteTotale = members.reduce(
        (acc, m) => acc + (m.chargeMax || 1),
        0
    );

    const chargeMoyenne = capaciteTotale > 0
        ? (totalCharge / capaciteTotale) * 100
        : 0;

    const membresSurcharges = members.filter(
        m => ((m.chargeActuelle || 0) / (m.chargeMax || 1)) > 0.8
    );

    const membresDisponibles = members.filter(
        m => (m.disponibilite || 0) > 70
    );

    return (
        <div className="space-y-6">

            {/* Résumé */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Charge globale
                    </h3>

                    <div className="text-3xl font-bold text-blue-600 mb-2">
                        {totalCharge}h / {capaciteTotale}h
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`rounded-full h-3 ${chargeMoyenne > 80
                                ? 'bg-red-500'
                                : chargeMoyenne > 60
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                            style={{ width: `${Math.min(chargeMoyenne, 100)}%` }}
                        />
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                        {chargeMoyenne.toFixed(1)}% de la capacité utilisée
                    </p>
                </div>

                {/* Surchargés */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Warning className="text-red-500" />
                        Membres surchargés
                    </h3>

                    <div className="text-3xl font-bold text-red-500">
                        {membresSurcharges.length}
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                        {membresSurcharges.length
                            ? membresSurcharges.map(m => m.nom).join(', ')
                            : 'Aucun membre surchargé'}
                    </p>
                </div>

                {/* Disponibles */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
                        <TrendingUp className="text-green-500" />
                        Membres disponibles
                    </h3>

                    <div className="text-3xl font-bold text-green-500">
                        {membresDisponibles.length}
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                        {membresDisponibles.length
                            ? membresDisponibles.map(m => m.nom).join(', ')
                            : 'Aucun membre disponible'}
                    </p>
                </div>

            </div>

            {/* Graphique individuel */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Disponibilités individuelles
                </h3>

                <div className="space-y-4">
                    {members.map(member => {

                        const chargeRatio =
                            (member.chargeActuelle || 0) /
                            (member.chargeMax || 1) * 100;

                        const disponibiliteReelle = Math.max(
                            0,
                            100 - chargeRatio
                        );

                        return (
                            <div key={member.id} className="border-b pb-4 last:border-0">

                                <div className="flex justify-between items-center mb-2">

                                    <div>
                                        <span className="font-medium text-gray-800">
                                            {member.nom}
                                        </span>

                                        <span className="text-sm text-gray-500 ml-2">
                                            ({member.poste})
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">

                                        <span className={`text-sm font-medium ${disponibiliteReelle > 30
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            }`}>
                                            {disponibiliteReelle.toFixed(0)}% disponible
                                        </span>

                                        <button
                                            onClick={() => {
                                                const newCharge = prompt(
                                                    'Nouvelle charge (heures/semaine):',
                                                    member.chargeActuelle || 0
                                                );

                                                if (newCharge !== null &&
                                                    !isNaN(newCharge)) {

                                                    onUpdateAvailability(
                                                        member.id,
                                                        parseInt(newCharge)
                                                    );
                                                }
                                            }}
                                            className="text-blue-600 hover:text-blue-800">
                                            <Edit fontSize="small" />
                                        </button>

                                    </div>
                                </div>

                                {/* Barre charge */}
                                <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">

                                    <div
                                        className="absolute h-full bg-blue-500"
                                        style={{ width: `${Math.min(chargeRatio, 100)}%` }}
                                    />

                                    <div
                                        className="absolute h-full bg-green-500"
                                        style={{
                                            width: `${member.disponibilite || 0}%`,
                                            left: `${Math.min(chargeRatio, 100)}%`
                                        }}
                                    />

                                    <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                                        Charge: {member.chargeActuelle || 0}h |
                                        Dispo: {member.disponibilite || 0}%
                                    </div>

                                </div>

                            </div>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onAddMember}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Ajouter un membre
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AvailabilityChart;