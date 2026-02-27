import React, { useState } from 'react';
import {
    Close,
    Upload,
    Description,
    Warning,
    CheckCircle,
    CloudUpload,
    InsertDriveFile
} from "@mui/icons-material";

const ModalImportProject = ({ isOpen, onClose, onImport }) => {
    const [file, setFile] = useState(null);
    const [importType, setImportType] = useState('json'); // 'json', 'csv', 'excel'
    const [importing, setImporting] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Simulation de prévisualisation
        if (selectedFile) {
            setPreview({
                nom: "Projet Importé",
                client: "Client Exemple",
                budget: 5000000,
                date_debut: "2026-05-01",
                date_fin: "2026-10-31"
            });
        }
    };

    const handleImport = () => {
        if (!file) return;

        setImporting(true);

        // Simulation d'import
        setTimeout(() => {
            const importedProjects = [
                {
                    nom: "Projet Importé 1",
                    description: "Description du projet importé",
                    client: "Client A",
                    chef_projet: "Responsable A",
                    date_debut: "2026-05-01",
                    date_fin_prevue: "2026-08-31",
                    budget_total: 5000000,
                    priorite: "haute",
                    statut: "planifie"
                },
                {
                    nom: "Projet Importé 2",
                    description: "Description du projet importé",
                    client: "Client B",
                    chef_projet: "Responsable B",
                    date_debut: "2026-06-01",
                    date_fin_prevue: "2026-09-30",
                    budget_total: 3000000,
                    priorite: "moyenne",
                    statut: "planifie"
                }
            ];

            onImport(importedProjects);
            setImporting(false);
            setFile(null);
            setPreview(null);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center">
                    <h2 className="text-xl text-white font-bold flex items-center gap-2">
                        <Upload />
                        Importer des projets
                    </h2>
                    <button onClick={onClose} className="text-white hover:bg-blue-700 p-1 rounded-full">
                        <Close />
                    </button>
                </div>

                <div className="p-6">
                    {/* Type d'import */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Type de fichier
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setImportType('json')}
                                className={`p-3 border rounded-lg text-center ${importType === 'json' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}>
                                <Description className="text-blue-500 mx-auto mb-1" />
                                <span className="text-sm">JSON</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setImportType('csv')}
                                className={`p-3 border rounded-lg text-center ${importType === 'csv' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}>
                                <Description className="text-green-500 mx-auto mb-1" />
                                <span className="text-sm">CSV</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setImportType('excel')}
                                className={`p-3 border rounded-lg text-center ${importType === 'excel' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}>
                                <Description className="text-orange-500 mx-auto mb-1" />
                                <span className="text-sm">Excel</span>
                            </button>
                        </div>
                    </div>

                    {/* Zone de drop */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'
                            }`}>
                        <input
                            type="file"
                            accept=".json,.csv,.xlsx,.xls"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            {file ? (
                                <>
                                    <CheckCircle className="text-green-500 text-4xl mx-auto mb-3" />
                                    <p className="font-medium text-gray-700">{file.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {(file.size / 1024).toFixed(1)} Ko
                                    </p>
                                </>
                            ) : (
                                <>
                                    <CloudUpload className="text-gray-400 text-4xl mx-auto mb-3" />
                                    <p className="font-medium text-gray-700">
                                        Cliquez pour sélectionner un fichier
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        ou glissez-déposez ici
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Formats supportés: JSON, CSV, Excel
                                    </p>
                                </>
                            )}
                        </label>
                    </div>

                    {/* Prévisualisation */}
                    {preview && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-gray-700 mb-3">Aperçu</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Projet:</span>
                                    <span className="font-medium">{preview.nom}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Client:</span>
                                    <span className="font-medium">{preview.client}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Budget:</span>
                                    <span className="font-medium">{preview.budget.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Période:</span>
                                    <span className="font-medium">
                                        {new Date(preview.date_debut).toLocaleDateString('fr-FR')} - {new Date(preview.date_fin).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Aide */}
                    <div className="mt-6 bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <Info />
                            Format attendu
                        </h4>
                        <p className="text-sm text-blue-600 mb-2">
                            Le fichier doit contenir les champs suivants:
                        </p>
                        <ul className="text-xs text-blue-600 list-disc list-inside">
                            <li>nom (obligatoire)</li>
                            <li>description</li>
                            <li>client</li>
                            <li>chef_projet</li>
                            <li>date_debut (YYYY-MM-DD)</li>
                            <li>date_fin_prevue (YYYY-MM-DD)</li>
                            <li>budget_total (nombre)</li>
                            <li>priorite (basse/moyenne/haute)</li>
                        </ul>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Annuler
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={!file || importing}
                            className={`px-6 py-2 rounded-lg flex items-center gap-2 ${!file || importing
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}>
                            {importing ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Import en cours...
                                </>
                            ) : (
                                <>
                                    <Upload /> Importer
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalImportProject;