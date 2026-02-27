import React, { useState } from 'react';
import {
    Assessment,
    ArrowBack,
    TrendingUp,
    People,
    ThumbUp,
    AttachMoney,
    Edit,
    Save,
    Photo,
    Comment
} from "@mui/icons-material";

const CampaignResults = ({ campagne, onBack, onUpdate }) => {
    const [resultats, setResultats] = useState(campagne.resultats || {});
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        onUpdate({ ...campagne, resultats });
        setIsEditing(false);
    };

    const calculateROI = () => {
        if (!resultats.ventes_generees || !campagne.cout) return null;
        // Estimation simplifiée
        const beneficeEstime = resultats.ventes_generees * 50000; // 50k FCFA par vente
        return ((beneficeEstime - campagne.cout) / campagne.cout * 100).toFixed(0);
    };

    const roi = calculateROI();

    return (

        <div className='bg-gray-200 p-4'>
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Header */}
                <div className="flex justify-between items-center pb-6 border-b mb-4 ">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                            <ArrowBack />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Résultats - {campagne.nom}</h2>
                            <p className="text-gray-500">Analyse des performances</p>
                        </div>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Edit /> Modifier
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                            <Save /> Enregistrer
                        </button>
                    )}
                </div>

                {/* Indicateurs clés */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="text-blue-600" />
                            <p className="text-sm text-blue-600">Objectifs atteints</p>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">
                            {resultats.objectifs_atteints || 0}%
                        </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <People className="text-green-600" />
                            <p className="text-sm text-green-600">Personnes touchées</p>
                        </div>
                        <p className="text-3xl font-bold text-green-600">
                            {resultats.personnes_touchees || resultats.contacts_estimes || 0}
                        </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ThumbUp className="text-purple-600" />
                            <p className="text-sm text-purple-600">Satisfaction</p>
                        </div>
                        <p className="text-3xl font-bold text-purple-600">
                            {resultats.satisfaction || 0}/5
                        </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <AttachMoney className="text-orange-600" />
                            <p className="text-sm text-orange-600">ROI estimé</p>
                        </div>
                        <p className="text-3xl font-bold text-orange-600">
                            {roi ? `${roi}%` : 'N/A'}
                        </p>
                    </div>
                </div>

                {isEditing ? (
                    // Mode édition
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-700">Modifier les résultats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Objectifs atteints (%)</label>
                                <input
                                    type="number"
                                    value={resultats.objectifs_atteints || ''}
                                    onChange={(e) => setResultats({ ...resultats, objectifs_atteints: parseInt(e.target.value) })}
                                    className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400  
              bg-transparent  placeholder-gray-600 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Ventes générées</label>
                                <input
                                    type="number"
                                    value={resultats.ventes_generees || ''}
                                    onChange={(e) => setResultats({ ...resultats, ventes_generees: parseInt(e.target.value) })}
                                    className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400  
              bg-transparent  placeholder-gray-600 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Leads générées</label>
                                <input
                                    type="number"
                                    value={resultats.leads_generees || ''}
                                    onChange={(e) => setResultats({ ...resultats, leads_generees: parseInt(e.target.value) })}
                                    className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400  
              bg-transparent  placeholder-gray-600 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Personnes touchées</label>
                                <input
                                    type="number"
                                    value={resultats.personnes_touchees || ''}
                                    onChange={(e) => setResultats({ ...resultats, personnes_touchees: parseInt(e.target.value) })}
                                    className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400 
              bg-transparent  placeholder-gray-600 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Satisfaction (/5)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={resultats.satisfaction || ''}
                                    onChange={(e) => setResultats({ ...resultats, satisfaction: parseFloat(e.target.value) })}
                                    className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400  
              bg-transparent  placeholder-gray-600 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Partenaires impliqués</label>
                                <input
                                    type="number"
                                    value={resultats.partenaires_impliques || ''}
                                    onChange={(e) => setResultats({ ...resultats, partenaires_impliques: parseInt(e.target.value) })}
                                    className="w-full p-2 focus:outline-blue-600  border-2 border-gray-600
              bg-transparent  placeholder-gray-600 rounded-lg text-gray-600"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Commentaires</label>
                            <textarea
                                value={resultats.commentaires || ''}
                                onChange={(e) => setResultats({ ...resultats, commentaires: e.target.value })}
                                rows="4"
                                className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400  
              bg-transparent  placeholder-gray-600 rounded-lg"
                            />
                        </div>
                    </div>
                ) : (
                    // Mode visualisation
                    <>
                        {/* Métriques détaillées */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="font-bold text-gray-700 mb-4">Performances commerciales</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Ventes générées</span>
                                        <span className="font-bold text-green-600">{resultats.ventes_generees || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Leads générées</span>
                                        <span className="font-bold text-blue-600">{resultats.leads_generees || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Coût par lead</span>
                                        <span className="font-bold text-purple-600">
                                            {resultats.leads_generees
                                                ? Math.round(campagne.cout / resultats.leads_generees).toLocaleString()
                                                : 0} FCFA
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 mb-4">Impact et portée</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Personnes touchées</span>
                                        <span className="font-bold text-green-600">{resultats.personnes_touchees || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Partenaires impliqués</span>
                                        <span className="font-bold text-blue-600">{resultats.partenaires_impliques || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Taux d'engagement</span>
                                        <span className="font-bold text-purple-600">
                                            {resultats.engagements && resultats.personnes_touchees
                                                ? ((resultats.engagements / resultats.personnes_touchees) * 100).toFixed(1)
                                                : 0}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Photos/Preuves */}
                        {resultats.photos && resultats.photos.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                    <Photo className="text-blue-600" />
                                    Photos de l'événement
                                </h3>
                                <div className="grid grid-cols-4 gap-4">
                                    {resultats.photos.map((photo, index) => (
                                        <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                            <img src={photo} alt={`Événement ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Commentaires */}
                        {resultats.commentaires && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Comment className="text-blue-600" />
                                    Commentaires
                                </h3>
                                <p className="text-gray-600">{resultats.commentaires}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>

    );
};

export default CampaignResults;