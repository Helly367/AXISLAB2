export const getPositionX = (dateStr, scale, minDate) => {
    if (!dateStr || !minDate) return 0;

    const date = new Date(dateStr);
    const diffDays = Math.ceil((date - minDate) / (1000 * 60 * 60 * 24));

    return diffDays * scale * 10;
};

export const getPhaseWidth = (phase, scale) => {
    if (!phase?.date_debut || !phase?.date_fin) return 0;

    const start = new Date(phase.date_debut);
    const end = new Date(phase.date_fin);

    const diffDays =
        Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return Math.max(diffDays * scale * 10, 20);
};