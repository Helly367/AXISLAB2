export const calculateCriticalPath = (phases, deps) => {
  // CPM (simplified)
  // build graph, longest path
  const graph = {};
  phases.forEach((p) => (graph[p.id] = []));
  deps.forEach((d) => graph[d.from].push(d.to));

  const memo = {};
  const dfs = (id) => {
    if (memo[id]) return memo[id];
    if (!graph[id].length) return 0;
    return (
      Math.max(...graph[id].map((c) => dfs(c))) +
      phases.find((p) => p.id === id).duration
    );
  };

  return Object.keys(graph).sort((a, b) => dfs(b) - dfs(a));
};

export const detectConflicts = (phases) => {
  const conflictIds = [];
  for (let i = 0; i < phases.length; i++) {
    for (let j = i + 1; j < phases.length; j++) {
      if (
        new Date(phases[i].date_fin) >
          new Date(phases[j].date_debut) &&
        new Date(phases[i].date_debut) <
          new Date(phases[j].date_fin)
      ) {
        conflictIds.push(phases[i].id);
        conflictIds.push(phases[j].id);
      }
    }
  }
  return [...new Set(conflictIds)];
};