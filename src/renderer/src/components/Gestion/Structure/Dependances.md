# Importations et Hooks

```javascript
import React, { useState, useMemo } from 'react';
import { Link, ArrowForward, Delete, Add, Warning } from "@mui/icons-material";
import { usePhases } from '../../../hooks/usePhase';
```

useState → gérer les états locaux : nouvelles dépendances, erreurs, liste des dépendances.
useMemo → pour calculer des valeurs dérivées sans recalculer inutilement (sortedPhases).
usePhases() → hook personnalisé pour récupérer toutes les phases du projet.
Icons MUI pour l’UI (ArrowForward, Delete, Add, Warning).

# États principaux

```javascript
const [newDependency, setNewDependency] = useState({ from: '', to: '' });
const [error, setError] = useState('');
const [dependencies, setDependencies] = useState([]);
```

newDependency → stocke les IDs des phases sélectionnées pour créer une nouvelle dépendance.
error → message d’erreur pour les validations (cycle, doublon, auto-dépendance).
dependencies → tableau des dépendances définies { from: number, to: number }.

# Tri des phases

```javascript
const sortedPhases = useMemo(() => {
    return [...phases].sort(
        (a, b) => new Date(a.date_debut) - new Date(b.date_debut)
    );
}, [phases]);
```

<! On trie les phases par date de début. useMemo → recalcul uniquement si phases change, pour éviter des re-renders inutiles.>

# Fonctions utilitaires

## A — Conversion des IDs

```javascript
const parseIds = () => ({
    from: Number(newDependency.from),
    to: Number(newDependency.to)
});
```

<! Convertit les valeurs des `<select>` (qui sont des strings) en nombres.>

## B — Vérifier si une dépendance existe déjà

```javascript
const dependencyExists = (from, to) => {
    return dependencies.some(d => d.from === from && d.to === to);
};
```

Empêche la création de doublons.

## C — Construire un graphe des dépendances

```javascript
const buildGraph = (extraEdge = null) => {
    const graph = {};
    dependencies.forEach(d => {
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

```

Transforme la liste de dépendances en graphe orienté { phaseId: [phaseId, ...] }.
extraEdge → permet de tester une nouvelle dépendance avant de l’ajouter.

## D — Détection de cycles

```javascript
const hasCycle = (graph) => {
    const visited = new Set();
    const stack = new Set();

    const dfs = (node) => {
        if (stack.has(node)) return true; // cycle détecté
        if (visited.has(node)) return false;

        visited.add(node);
        stack.add(node);

        for (const neighbor of graph[node] || []) {
            if (dfs(neighbor)) return true;
        }

        stack.delete(node);
        return false;
    };

    return Object.keys(graph).some(node => dfs(Number(node)));
};
```

DFS (Depth-First Search) pour détecter un cycle dans le graphe.
Empêche que les dépendances forment des boucles impossibles à exécuter.

# Ajouter une dépendance

```javascript
const handleAddDependency = () => {
    setError('');

    if (!newDependency.from || !newDependency.to) {
        return setError('Veuillez sélectionner deux phases');
    }

    const { from, to } = parseIds();

    if (from === to) {
        return setError('Une phase ne peut pas dépendre d\'elle-même');
    }

    if (dependencyExists(from, to)) {
        return setError('Cette dépendance existe déjà');
    }

    const graph = buildGraph({ from, to });

    if (hasCycle(graph)) {
        return setError('Cette dépendance créerait un cycle');
    }

    setDependencies([...dependencies, { from, to }]);
    setNewDependency({ from: '', to: '' });
};
```

Valide les entrées :
Les deux phases sont sélectionnées
Pas d’auto-dépendance
Pas de doublon
Pas de cycle
Ajoute la dépendance à l’état si tout est OK.

# Supprimer une dépendance

```javascript
const handleDeleteDependency = (from, to) => {
    onUpdateDependencies(
        dependencies.filter(d => !(d.from === from && d.to === to))
    );
};
```

Retire une dépendance existante.
Note : dans ton code, onUpdateDependencies n’est pas défini. Tu devrais utiliser :

```javascript
setDependencies(dependencies.filter(d => !(d.from === from && d.to === to)))
```

# écupérer le nom d’une phase par ID

```javascript
const getPhaseName = (id) => {
    const phase = phases.find(p => p.id === id);
    return phase ? phase.title : 'Inconnue';
};
```

Pour l’affichage clair des dépendances : "Phase A → Phase B".

# JSX du composant

## A — Formulaire pour ajouter une dépendance

Deux `<select>` : Phase dépendante (to) et Phase antérieure (from).
Bouton Ajouter.
Affichage d’erreur si validation échoue.

## B — Liste des dépendances existantes

```javascript
dependencies.map(dep => (
    <div key={...}>
        {getPhaseName(dep.from)} → {getPhaseName(dep.to)}
        <Delete onClick={...} />
    </div>
))
```

Chaque dépendance est affichée avec un bouton de suppression.

## C — Explications

Petite section d’aide expliquant le fonctionnement des dépendances pour l’utilisateur.

