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
import { useCampagnes } from '../../../hooks/useCampagnes';
import { alertService } from '../../../Services/alertService';
import { formateDateChamps, formateMontantSimple, formateDate } from "../../../Services/functions"

const CampaignPlanning = ({ campagne, onBack, project }) => {
    const { ajouteEtape, updateEtape, deleteEtape, ajouteCanal } = useCampagnes();
    const [isAjouteEtape, setIsAjouteEtape] = useState(false);
    const [etapes, setEtapes] = useState(campagne.planification?.etapes || []);
    const [canaux, setCanaux] = useState(campagne.planification?.canaux || []);
    const [newCanal, setNewCanal] = useState('');
    const [newEtape, setNewEtape] = useState({
        id: '0123456789',
        nom: '',
        date_debut: '',
        date_fin: '',
        completed: false
    });


    const handleAddEtape = async () => {

        console.log("newEtape", newEtape);


        const result = await ajouteEtape({
            projet_id: project?.projet_id,
            campagne_id: campagne.campagne_id,
            newEtape: newEtape
        });

        console.log("soso", result);

        if (result && result.success) {
            const createdEtape = result.newEtapeF;
            const updatedEtapes = [...etapes, { ...createdEtape }];

            setEtapes(updatedEtapes);
            setNewEtape({ id: '0123456789', nom: '', date_debut: '', date_fin: '' });
            setIsAjouteEtape(false);
        }


    };

    const handleToggleEtape = async (index) => {
        const updatedEtapes = etapes.map((e, i) =>
            i === index ? { ...e, completed: !e.completed } : e
        );

        const result = await updateEtape({
            projet_id: project?.projet_id,
            campagne_id: campagne.campagne_id,
            updatedEtapes: updatedEtapes

        })

        if (result && result.success) {
            setEtapes(updatedEtapes);
        }

    };

    const handleDeleteEtape = async (index) => {
        console.log("index", index);
        const updatedEtapes = etapes.filter((_, i) => i !== index);

        const result = await deleteEtape({
            projet_id: project?.projet_id,
            campagne_id: campagne.campagne_id,
            updatedEtapes: updatedEtapes

        })

        if (result && result.success) {
            setEtapes(updatedEtapes);
        }

    };

    const handleAddCanal = async () => {
        if (newCanal) {
            const updatedCanaux = [...canaux, newCanal];

            const result = await ajouteCanal({
                projet_id: project?.projet_id,
                campagne_id: campagne.campagne_id,
                newCanal: updatedCanaux
            });

            console.log("soso", result);

            if (result && result.success) {
                setCanaux(updatedCanaux);
                setNewCanal('');
            }



        }
    };

    const handleDeleteCanal = async (index) => {
        console.log("index", index);

        const updatedCanaux = canaux.filter((_, i) => i !== index);

        const result = await ajouteCanal({
            projet_id: project?.projet_id,
            campagne_id: campagne.campagne_id,
            newCanal: updatedCanaux
        });

        console.log("soso", result);

        if (result && result.success) {
            setCanaux(updatedCanaux);
            
        }
       
    };



    const progression = etapes.length > 0
        ? (etapes.filter(e => e.completed).length / etapes.length * 100).toFixed(0)
        : 0;

    return (
        <div className='min-h-screen bg-gray-200'>
            <div className="max-w-8xl  bg-white rounded-lg shadow m-4 px-4 mb-15">

                {/* Header */}
                <div className="flex items-center gap-4 bg-white px-4 py-2">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowBack />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Planification - {campagne.nom}</h2>
                        <p className="text-gray-500">Gestion des étapes et des canaux</p>
                    </div>
                </div>

                {/* Progression globale */}
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
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



                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-4">

                    {/* Étapes de la campagne */}
                    <div className='flex flex-col justify-between  mb-8 '>

                        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 shadow p-2 rounded-[5px]">
                            <Timeline className="text-blue-600" />
                            Étapes de la campagne
                        </h3>

                        <div className="space-y-3 mb-4 overflow-y-auto h-160 menu">
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
                                            {formateDate(etape.date_debut)} - {formateDate(etape.date_fin)}
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
                        {isAjouteEtape ? (
                            <div className="bg-gray-50 rounded-lg p-4 shadow mt-4">
                                <h4 className="text-sm font-medium text-gray-600 mb-3">Nouvelle étape</h4>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Nom de l'étape"
                                        value={newEtape.nom}
                                        onChange={(e) => setNewEtape({ ...newEtape, nom: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-400 rounded-xl 
                           focus:outline-none focus:bg-white focus:border-blue-500
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allow"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className='flex flex-col gap-2 '>
                                            <label className='text-gray-600 text-sm font-medium'>Date de début</label>
                                            <input
                                                type="date"
                                                value={newEtape.date_debut}
                                                onChange={(e) => setNewEtape({ ...newEtape, date_debut: e.target.value })}
                                                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-400 rounded-xl 
                           focus:outline-none focus:bg-white focus:border-blue-500
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowe"
                                            />

                                        </div>

                                        <div >
                                            <label className='text-gray-600 text-sm font-medium'>Date de fin</label>
                                            <input
                                                type="date"
                                                value={newEtape.date_fin}
                                                onChange={(e) => setNewEtape({ ...newEtape, date_fin: e.target.value })}
                                                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-400 rounded-xl 
                           focus:outline-none focus:bg-white focus:border-blue-500
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowe"
                                            />
                                        </div>


                                    </div>
                                    <div className='flex items-center gap-4 mt-4 '>
                                        <button
                                            onClick={() => setIsAjouteEtape(false)}
                                            className="w-full bg-white text-gray-700 py-2 rounded-lg  flex items-center justify-center gap-2 border border-gray-700">
                                            Annuler
                                        </button>
                                        <button
                                            onClick={handleAddEtape}
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                                            <Add fontSize="small" /> Ajouter l'étape
                                        </button>
                                    </div>

                                </div>
                            </div>

                        ) : (
                            <button
                                onClick={() => setIsAjouteEtape(true)}
                                className=" bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 self-end font-medium px-2 text-2xd">
                                Ajouter une étape
                            </button>
                        )}




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
                                    className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-400 rounded-xl 
                           focus:outline-none focus:bg-white focus:border-blue-500
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowe"
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


            </div>
        </div>

    );
};

export default CampaignPlanning;