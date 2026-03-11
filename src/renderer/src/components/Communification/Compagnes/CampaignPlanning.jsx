import React, { useState } from 'react';
import {
    Schedule,
    ArrowBack,
    CheckCircle,
    RadioButtonUnchecked,
    Add,
    Delete,
    Edit,
    Timeline,
    List
} from "@mui/icons-material";

const CampaignPlanning = ({ campagne, onBack, onUpdate }) => {
    const [etapes, setEtapes] = useState(campagne.planification?.etapes || []);
    const [canaux, setCanaux] = useState(campagne.planification?.canaux || []);
    const [newEtape, setNewEtape] = useState({ nom: '', date_debut: '', date_fin: '' });
    const [newCanal, setNewCanal] = useState('');

    const handleAddEtape = () => {
        if (newEtape.nom && newEtape.date_debut && newEtape.date_fin) {
            const updatedEtapes = [...etapes, { ...newEtape, completed: false }];
            setEtapes(updatedEtapes);
            updateCampagne({ ...campagne, planification: { ...campagne.planification, etapes: updatedEtapes } });
            setNewEtape({ nom: '', date_debut: '', date_fin: '' });
        }
    };

    const handleToggleEtape = (index) => {
        const updatedEtapes = etapes.map((e, i) =>
            i === index ? { ...e, completed: !e.completed } : e
        );
        setEtapes(updatedEtapes);
        updateCampagne({ ...campagne, planification: { ...campagne.planification, etapes: updatedEtapes } });
    };

    const handleDeleteEtape = (index) => {
        const updatedEtapes = etapes.filter((_, i) => i !== index);
        setEtapes(updatedEtapes);
        updateCampagne({ ...campagne, planification: { ...campagne.planification, etapes: updatedEtapes } });
    };

    const handleAddCanal = () => {
        if (newCanal) {
            const updatedCanaux = [...canaux, newCanal];
            setCanaux(updatedCanaux);
            updateCampagne({ ...campagne, planification: { ...campagne.planification, canaux: updatedCanaux } });
            setNewCanal('');
        }
    };

    const handleDeleteCanal = (index) => {
        const updatedCanaux = canaux.filter((_, i) => i !== index);
        setCanaux(updatedCanaux);
        updateCampagne({ ...campagne, planification: { ...campagne.planification, canaux: updatedCanaux } });
    };

    const updateCampagne = (updated) => {
        onUpdate(updated);
    };

    const progression = etapes.length > 0
        ? (etapes.filter(e => e.completed).length / etapes.length * 100).toFixed(0)
        : 0;

    return (
        <div className='bg-gray-200 p-4'>
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Header */}
                <div className="flex items-center gap-4 pb-6 border-b mb-4 bg-white p-2">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowBack />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Planification - {campagne.nom}</h2>
                        <p className="text-gray-500">Gestion des étapes et des canaux</p>
                    </div>
                </div>

                {/* Progression globale */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-blue-700">Progression de la planification</span>
                        <span className="text-lg font-bold text-blue-700">{progression}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3">
                        <div
                            className="bg-blue-600 rounded-full h-3 transition-all duration-500"
                            style={{ width: `${progression}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Étapes de la campagne */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <Timeline className="text-blue-600" />
                            Étapes de la campagne
                        </h3>

                        <div className="space-y-3 mb-4">
                            {etapes.map((etape, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <button onClick={() => handleToggleEtape(index)}>
                                        {etape.completed ? (
                                            <CheckCircle className="text-green-500" />
                                        ) : (
                                            <RadioButtonUnchecked className="text-gray-400" />
                                        )}
                                    </button>
                                    <div className="flex-1">
                                        <p className={`font-medium ${etape.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                                            {etape.nom}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(etape.date_debut).toLocaleDateString('fr-FR')} - {new Date(etape.date_fin).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteEtape(index)}
                                        className="text-red-500 hover:text-red-700">
                                        <Delete fontSize="small" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Ajout d'étape */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-600 mb-3">Nouvelle étape</h4>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Nom de l'étape"
                                    value={newEtape.nom}
                                    onChange={(e) => setNewEtape({ ...newEtape, nom: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="date"
                                        value={newEtape.date_debut}
                                        onChange={(e) => setNewEtape({ ...newEtape, date_debut: e.target.value })}
                                        className="p-2 border border-gray-300 rounded-lg"
                                    />
                                    <input
                                        type="date"
                                        value={newEtape.date_fin}
                                        onChange={(e) => setNewEtape({ ...newEtape, date_fin: e.target.value })}
                                        className="p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <button
                                    onClick={handleAddEtape}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                                    <Add fontSize="small" /> Ajouter l'étape
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Canaux de diffusion */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <List className="text-blue-600" />
                            Canaux de diffusion
                        </h3>

                        <div className="space-y-2 mb-4">
                            {canaux.map((canal, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700">{canal}</span>
                                    <button
                                        onClick={() => handleDeleteCanal(index)}
                                        className="text-red-500 hover:text-red-700">
                                        <Delete fontSize="small" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Ajout de canal */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-600 mb-3">Nouveau canal</h4>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ex: Réseaux sociaux, Radio, etc."
                                    value={newCanal}
                                    onChange={(e) => setNewCanal(e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                                />
                                <button
                                    onClick={handleAddCanal}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    <Add />
                                </button>
                            </div>
                        </div>

                        {/* Informations supplémentaires */}
                        {campagne.planification?.formateurs && (
                            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                                <h4 className="font-medium text-purple-700 mb-2">Formateurs</h4>
                                <p className="text-sm text-purple-600">{campagne.planification.formateurs.join(', ')}</p>
                            </div>
                        )}

                        {campagne.planification?.type && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-700 mb-2">Type de planification</h4>
                                <p className="text-sm text-blue-600 capitalize">{campagne.planification.type}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dates clés */}
                <div className="mt-6 pt-6 border-t">
                    <h3 className="font-bold text-gray-700 mb-4">Dates clés</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Début prévu</p>
                            <p className="font-medium">{new Date(campagne.date_debut).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Fin prévue</p>
                            <p className="font-medium">{new Date(campagne.date_fin).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Début réel</p>
                            <p className="font-medium">
                                {campagne.date_debut_reelle
                                    ? new Date(campagne.date_debut_reelle).toLocaleDateString('fr-FR')
                                    : 'Non commencé'}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Fin réelle</p>
                            <p className="font-medium">
                                {campagne.date_fin_reelle
                                    ? new Date(campagne.date_fin_reelle).toLocaleDateString('fr-FR')
                                    : 'En cours'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CampaignPlanning;