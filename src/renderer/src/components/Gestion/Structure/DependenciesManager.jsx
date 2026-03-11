import React, { useState, useMemo, useEffect } from "react";
import { Link, ArrowForward, Delete, Add, Warning } from "@mui/icons-material";
import { usePhases } from "../../../hooks/usePhase";
import { DependencyApi } from "../../../functions/dependency";

const DependenciesManager = ({ project }) => {

    const { phases } = usePhases();


    const [newDependency, setNewDependency] = useState({ from: "", to: "" });
    const [dependencies, setDependencies] = useState([]);
    const [error, setError] = useState("");


    const sortedPhases = useMemo(() => {
        return [...phases].sort(
            (a, b) => new Date(a.date_debut) - new Date(b.date_debut)
        );
    }, [phases]);

    // Charger dépendances
    useEffect(() => {

        if (!project.projet_id) return;

        DependencyApi.getDependenciesByProject(project.projet_id).then((res) => {

            if (!res?.success) return;

            const deps = res.data.map((d) => ({
                dependency_id: d.dependency_id,
                from: d.from_phase_id,
                to: d.to_phase_id
            }));

            setDependencies(deps);
        });

    }, [project.projet_id]);

    const parseIds = () => ({
        from: Number(newDependency.from),
        to: Number(newDependency.to)
    });

    const dependencyExists = (from, to) => {
        return dependencies.some((d) => d.from === from && d.to === to);
    };

    // Construction du graphe
    const buildGraph = (extraEdge = null) => {

        const graph = {};

        dependencies.forEach((d) => {

            if (!graph[d.from]) graph[d.from] = [];

            graph[d.from].push(d.to);
        });

        if (extraEdge) {

            const { from, to } = extraEdge;

            if (!graph[from]) graph[from] = [];

            graph[from].push(to);
        }

        return graph;
    };

    // Détection cycle
    const hasCycle = (graph) => {

        const visited = new Set();
        const stack = new Set();

        const dfs = (node) => {

            if (stack.has(node)) return true;

            if (visited.has(node)) return false;

            visited.add(node);
            stack.add(node);

            for (const neighbor of graph[node] || []) {

                if (dfs(neighbor)) return true;
            }

            stack.delete(node);

            return false;
        };

        return Object.keys(graph).some((node) => dfs(Number(node)));
    };

    const handleAddDependency = async () => {

        setError("");

        if (!newDependency.from || !newDependency.to) {
            return setError("Veuillez sélectionner deux phases");
        }

        const { from, to } = parseIds();

        if (from === to) {
            return setError("Une phase ne peut pas dépendre d'elle-même");
        }

        if (dependencyExists(from, to)) {
            return setError("Cette dépendance existe déjà");
        }

        const graph = buildGraph({ from, to });

        if (hasCycle(graph)) {
            return setError("Cette dépendance créerait un cycle");
        }

        const response = await DependencyApi.createDependency({
            projet_id: project.projet_id,
            from_phase_id: from,
            to_phase_id: to
        });

        if (!response?.success) return;

        setDependencies((prev) => [
            ...prev,
            {
                dependency_id: response.data.dependency_id,
                from,
                to
            }
        ]);

        setNewDependency({ from: "", to: "" });
    };

    const handleDeleteDependency = async (dependency_id) => {

        await DependencyApi.deleteDependency(dependency_id);

        setDependencies((prev) =>
            prev.filter((d) => d.dependency_id !== dependency_id)
        );
    };

    const getPhaseName = (id) => {

        const phase = phases.find((p) => p.phase_id === id);

        return phase ? phase.title : "Inconnue";
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">

            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Link className="text-blue-600" />
                Gestion des dépendances entre phases
            </h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">

                <h3 className="font-medium text-gray-700 mb-4">
                    Ajouter une dépendance
                </h3>

                <div className="flex flex-col md:flex-row items-end gap-4">

                    <div className="flex-1">

                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Phase antérieure
                        </label>

                        <select
                            value={newDependency.from}
                            onChange={(e) =>
                                setNewDependency((prev) => ({
                                    ...prev,
                                    from: e.target.value
                                }))
                            }
                            className="w-full p-3 border rounded-lg"
                        >
                            <option value="">Sélectionner</option>

                            {sortedPhases.map((phase) => (

                                <option
                                    key={phase.phase_id}
                                    value={phase.phase_id}
                                >
                                    {phase.title}
                                </option>

                            ))}
                        </select>
                    </div>

                    <ArrowForward />

                    <div className="flex-1">

                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Phase dépendante
                        </label>

                        <select
                            value={newDependency.to}
                            onChange={(e) =>
                                setNewDependency((prev) => ({
                                    ...prev,
                                    to: e.target.value
                                }))
                            }
                            className="w-full p-3 border rounded-lg"
                        >
                            <option value="">Sélectionner</option>

                            {sortedPhases.map((phase) => (

                                <option
                                    key={phase.phase_id}
                                    value={phase.phase_id}
                                >
                                    {phase.title}
                                </option>

                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleAddDependency}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                    >
                        <Add /> Ajouter
                    </button>

                </div>

                {error && (
                    <div className="mt-3 text-red-500 flex items-center gap-1">
                        <Warning fontSize="small" />
                        {error}
                    </div>
                )}
            </div>

            <h3 className="font-medium text-gray-700 mb-4">
                Dépendances existantes
            </h3>

            {dependencies.length > 0 ? (

                <div className="space-y-3">

                    {dependencies.map((dep) => (

                        <div
                            key={dep.dependency_id}
                            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                        >

                            <div className="flex items-center gap-3">

                                <span className="text-blue-600 font-medium">
                                    {getPhaseName(dep.from)}
                                </span>

                                <ArrowForward />

                                <span className="text-green-600 font-medium">
                                    {getPhaseName(dep.to)}
                                </span>

                            </div>

                            <button
                                onClick={() =>
                                    handleDeleteDependency(dep.dependency_id)
                                }
                                className="text-red-500"
                            >
                                <Delete />
                            </button>

                        </div>
                    ))}
                </div>

            ) : (

                    <p className="text-gray-500">
                        Aucune dépendance définie
                    </p>

            )}
        </div>
    );
};

export default DependenciesManager;