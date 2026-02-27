import React, { useState } from 'react';
import { Link, ArrowForward, Delete, Add, Warning } from "@mui/icons-material";

const DependenciesManager = ({ phases, dependencies, onUpdateDependencies }) => {
    const [newDependency, setNewDependency] = useState({ from: '', to: '' });
    const [error, setError] = useState('');

    const handleAddDependency = () => {
        if (!newDependency.from || !newDependency.to) {
            setError('Veuillez sélectionner deux phases');
            return;
        }

        if (newDependency.from === newDependency.to) {
            setError('Une phase ne peut pas dépendre d\'elle-même');
            return;
        }

        // Vérifier si la dépendance existe déjà
        const exists = dependencies.some(
            d => d.from === parseInt(newDependency.from) && d.to === parseInt(newDependency.to)
        );

        if (exists) {
            setError('Cette dépendance existe déjà');
            return;
        }

        // Vérifier les cycles
        if (wouldCreateCycle(parseInt(newDependency.from), parseInt(newDependency.to))) {
            setError('Cette dépendance créerait un cycle');
            return;
        }

        onUpdateDependencies([
            ...dependencies,
            { from: parseInt(newDependency.from), to: parseInt(newDependency.to) }
        ]);

        setNewDependency({ from: '', to: '' });
        setError('');
    };

    const handleDeleteDependency = (from, to) => {
        onUpdateDependencies(dependencies.filter(d => !(d.from === from && d.to === to)));
    };

    // Vérifier si l'ajout créerait un cycle
    const wouldCreateCycle = (from, to) => {
        const graph = {};
        dependencies.forEach(d => {
            if (!graph[d.from]) graph[d.from] = [];
            graph[d.from].push(d.to);
        });

        // Ajouter la nouvelle dépendance temporairement
        if (!graph[from]) graph[from] = [];
        graph[from].push(to);

        // Détection de cycle (DFS)
        const visited = new Set();
        const stack = new Set();

        const hasCycle = (node) => {
            if (stack.has(node)) return true;
            if (visited.has(node)) return false;

            visited.add(node);
            stack.add(node);

            if (graph[node]) {
                for (const neighbor of graph[node]) {
                    if (hasCycle(neighbor)) return true;
                }
            }

            stack.delete(node);
            return false;
        };

        return hasCycle(from);
    };

    const getPhaseName = (id) => {
        const phase = phases.find(p => p.id === id);
        return phase ? phase.title : 'Inconnue';
    };

    // Trier les phases par ordre chronologique
    const sortedPhases = [...phases].sort((a, b) =>
        new Date(a.date_debut) - new Date(b.date_debut)
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Link className="text-blue-600" />
                Gestion des dépendances entre phases
            </h2>

            {/* Formulaire d'ajout */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-medium text-gray-700 mb-4">Ajouter une dépendance</h3>
                <div className="flex flex-col md:flex-row items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Phase dépendante (doit attendre)
                        </label>
                        <select
                            value={newDependency.to}
                            onChange={(e) => setNewDependency({ ...newDependency, to: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionnez une phase</option>
                            {sortedPhases.map(phase => (
                                <option key={phase.id} value={phase.id}>
                                    {phase.title} ({new Date(phase.date_debut).toLocaleDateString('fr-FR')})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-center p-2">
                        <ArrowForward className="text-gray-400" />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Phase antérieure (doit être terminée)
                        </label>
                        <select
                            value={newDependency.from}
                            onChange={(e) => setNewDependency({ ...newDependency, from: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionnez une phase</option>
                            {sortedPhases.map(phase => (
                                <option key={phase.id} value={phase.id}>
                                    {phase.title} ({new Date(phase.date_debut).toLocaleDateString('fr-FR')})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleAddDependency}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Add /> Ajouter
                    </button>
                </div>
                {error && (
                    <div className="mt-3 text-red-500 text-sm flex items-center gap-1">
                        <Warning fontSize="small" />
                        {error}
                    </div>
                )}
            </div>

            {/* Liste des dépendances */}
            <h3 className="font-medium text-gray-700 mb-4">Dépendances existantes</h3>
            {dependencies.length > 0 ? (
                <div className="space-y-3">
                    {dependencies.map((dep, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-blue-600">{getPhaseName(dep.from)}</span>
                                    <ArrowForward className="text-gray-400" />
                                    <span className="font-medium text-green-600">{getPhaseName(dep.to)}</span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {getPhaseName(dep.from)} doit être terminée avant de commencer {getPhaseName(dep.to)}
                                </span>
                            </div>
                            <button
                                onClick={() => handleDeleteDependency(dep.from, dep.to)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Delete />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Link className="text-gray-400 text-5xl mb-3" />
                    <p className="text-gray-500">Aucune dépendance définie</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Les dépendances permettent de gérer l'ordre d'exécution des phases
                    </p>
                </div>
            )}

            {/* Aide */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Comment ça marche ?</h4>
                <p className="text-sm text-blue-600">
                    Une dépendance signifie qu'une phase ne peut commencer que lorsque la phase antérieure est terminée à 100%.
                    Par exemple, la phase "Développement" ne peut pas commencer avant que la phase "Conception" soit terminée.
                </p>
            </div>
        </div>
    );
};

export default DependenciesManager;