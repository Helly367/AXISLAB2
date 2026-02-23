import {
    Person2Rounded,
    Close,
    Description,
    Flag,
    Save,
    GroupAdd,
    CheckBox,
    CheckBoxOutlineBlank
} from "@mui/icons-material";
import { useState } from "react";

const publiqueClient = [
    "Élèves",
    "Étudiants",
    "Salariés",
    "Entrepreneurs",
    "Demandeurs d'emploi",
    "Retraités",
    "Enfants",
    "Adultes"
];

const typeProjet = [
    "Formation",
    "Accompagnement",
    "Coaching",
    "Événementiel",
    "Conseil",
    "Développement",
    "Recherche"
];

const ModifierProjet = ({ isOpen, onClose, projectData }) => {
    const [selectedPublics, setSelectedPublics] = useState([]);
    const [formData, setFormData] = useState({
        name: projectData?.name || "",
        description: projectData?.description || "",
        shortTerm: projectData?.shortTerm || "",
        longTerm: projectData?.longTerm || "",
        shortStart: projectData?.shortStart || "",
        shortEnd: projectData?.shortEnd || "",
        longStart: projectData?.longStart || "",
        longEnd: projectData?.longEnd || "",
        projectManager: projectData?.projectManager || "",
        projectType: projectData?.projectType || "",
    });

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePublicToggle = (publicItem) => {
        setSelectedPublics(prev =>
            prev.includes(publicItem)
                ? prev.filter(item => item !== publicItem)
                : [...prev, publicItem]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique de soumission avec formData et selectedPublics
        console.log("Données du formulaire:", { ...formData, selectedPublics });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 bg-blue-600 sticky top-0">
                    <h2 className="text-xl font-bold text-white">Modifier le projet</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors"
                        aria-label="Fermer"
                    >
                        <Close />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Nom du projet */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-black font-semibold">
                            <Person2Rounded className="text-blue-600" /> Nom du projet
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md"
                            placeholder="Nom du projet"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-black font-semibold">
                            <Description className="text-blue-600" /> Description
                        </label>
                        <textarea
                            rows="4"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md resize-y"
                            placeholder="Description du projet"
                            required
                        />
                    </div>

                    {/* Objectifs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Court terme */}
                        <div className="space-y-2 border p-4 rounded-lg">
                            <label className="flex items-center gap-2 text-black font-semibold">
                                <Flag className="text-blue-600" /> Objectif à court terme
                            </label>
                            <textarea
                                rows="3"
                                name="shortTerm"
                                value={formData.shortTerm}
                                onChange={handleInputChange}
                                className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md"
                                placeholder="Objectif court terme"
                            />
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-1">Date de début :</label>
                                    <input
                                        type="date"
                                        name="shortStart"
                                        value={formData.shortStart}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-1">Date de fin :</label>
                                    <input
                                        type="date"
                                        name="shortEnd"
                                        value={formData.shortEnd}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Long terme */}
                        <div className="space-y-2 border p-4 rounded-lg">
                            <label className="flex items-center gap-2 text-black font-semibold">
                                <Flag className="text-blue-600" /> Objectif à long terme
                            </label>
                            <textarea
                                rows="3"
                                name="longTerm"
                                value={formData.longTerm}
                                onChange={handleInputChange}
                                className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md"
                                placeholder="Objectif long terme"
                            />
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-1">Date de début :</label>
                                    <input
                                        type="date"
                                        name="longStart"
                                        value={formData.longStart}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-1">Date de fin :</label>
                                    <input
                                        type="date"
                                        name="longEnd"
                                        value={formData.longEnd}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chef de projet */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-black font-semibold">
                            <Person2Rounded className="text-blue-600" /> Chef de projet
                        </label>
                        <input
                            type="text"
                            name="projectManager"
                            value={formData.projectManager}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md"
                            placeholder="Chef de projet"
                        />
                    </div>

                    {/* Grille pour les sélections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Publiques cibles - Multi-sélection avec cases à cocher */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-black font-semibold">
                                <GroupAdd className="text-blue-600" /> Publics cibles
                            </label>
                            <div className="border-2 border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                                {publiqueClient.map((client, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 py-2 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handlePublicToggle(client)}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`public-${index}`}
                                            checked={selectedPublics.includes(client)}
                                            onChange={() => { }}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                        <label
                                            htmlFor={`public-${index}`}
                                            className="cursor-pointer flex-1"
                                        >
                                            {client}
                                        </label>
                                    </div>
                                ))}
                                {selectedPublics.length > 0 && (
                                    <div className="mt-2 text-sm text-blue-600 border-t pt-2">
                                        {selectedPublics.length} public(s) sélectionné(s)
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Type de projet */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-black font-semibold">
                                <Person2Rounded className="text-blue-600" /> Type de projet
                            </label>
                            <select
                                name="projectType"
                                value={formData.projectType}
                                onChange={handleInputChange}
                                className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md bg-white"
                            >
                                <option value="">Sélectionnez un type</option>
                                {typeProjet.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-4 pt-6 border-t sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                        >
                            <Save /> Enregistrer les modifications
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModifierProjet;