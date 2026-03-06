
    const [phases, setPhases] = useState([
        {
            id: 1,
            title: "ANALYSE",
            description_phase: "Analyse des besoins et spécifications du projet.",
            date_debut: "2026-02-01",
            date_fin: "2026-02-25",
            taches: ["Analyse des besoins", "Étude faisabilité", "Spécifications"],
            membres: ["Jean Paul", "Maria Lopez", "Djuma elie", "Benny yole", "Rosie mukubwa"],
            couleur: "#3B82F6",
            progression: 100
        },
        {
            id: 2,
            title: "CONCEPTION",
            description_phase: "Architecture technique et maquettage.",
            date_debut: "2026-02-26",
            date_fin: "2026-03-15",
            taches: ["Architecture", "UI Design", "Base de données"],
            membres: ["Jean Paul", "Kenny Mougou"],
            couleur: "#10B981",
            progression: 75
        },
        {
            id: 3,
            title: "DEVELOPPEMENT",
            description_phase: "Développement frontend et backend.",
            date_debut: "2026-03-16",
            date_fin: "2026-04-30",
            taches: ["Frontend", "Backend", "Tests unitaires"],
            membres: ["Sam Rosie", "Benny Woubi"],
            couleur: "#F59E0B",
            progression: 30
        },
        {
            id: 4,
            title: "TESTS",
            description_phase: "Phase de tests fonctionnels et performance.",
            date_debut: "2026-05-01",
            date_fin: "2026-05-20",
            taches: ["Tests fonctionnels", "Correction bugs", "Validation client"],
            membres: ["Maria Lopez", "Kenny Mougou"],
            couleur: "#EF4444",
            progression: 0
        },
        {
            id: 5,
            title: "DEPLOIEMENT",
            description_phase: "Mise en production du projet.",
            date_debut: "2026-05-21",
            date_fin: "2026-06-05",
            taches: ["Serveur production", "Déploiement", "Documentation"],
            membres: ["Jean Paul"],
            couleur: "#8B5CF6",
            progression: 0
        }
    ]);