
const typesProjets = [
    "projet d’amélioration",
    "projet de recherche",
    "projet d’innovation",
    "projet d’investissement",
    "projet éducatif",
    "projet événementiel",
    "projet humanitaire",
    "projet informatique",
    "projet industriel",
    "projet organisationnel",

];

 const availableProspects = [
        "Élèves",
        "Étudiant(e)s",
        "Commerçant(e)s",
        "Salariés",
        "Entreprises",
        "Particuliers",
        "Professionnels libéraux",
        "Administrations",
        "Associations",
        "Artisans"
];

const categorieMateriels = [
    "Matériel agricole",
    "Matériel de bureau",
    "Matériel de BTP",
    "Matériel de cuisine professionnelle",
    "Matériel informatique et télécom",
    "Matériel de laboratoire",
    "Matériel médical",
    "Matériel de sport",
    "Matériel de transport et logistique",
    "Matériel industriel",
    "Matériel électrique",
    "Matériel électronique",
    "Matériel de sécurité et protection",
    "Matériel de manutention",
    "Matériel de nettoyage",
    "Matériel d'enseignement et pédagogique",
    "Matériel musical",
    "Matériel de restauration et hôtellerie",
    "Matériel d'emballage",
    "Matériel de mesure et contrôle"
];




const devises = [
  { code: 'USD', nom: 'Dollar américain', symbole: '$' },
  { code: 'CDF', nom: 'Franc congolais', symbole: 'FC' },
  { code: 'EUR', nom: 'Euro', symbole: '€' },
  { code: 'XOF', nom: 'Franc CFA (UEMOA)', symbole: 'CFA' },
  { code: 'XAF', nom: 'Franc CFA (CEMAC)', symbole: 'FCFA' },
  { code: 'GBP', nom: 'Livre sterling', symbole: '£' },
  { code: 'JPY', nom: 'Yen japonais', symbole: '¥' },
  { code: 'CNY', nom: 'Yuan chinois', symbole: '¥' },
  { code: 'CHF', nom: 'Franc suisse', symbole: 'CHF' },
  { code: 'CAD', nom: 'Dollar canadien', symbole: 'C$' },
  { code: 'AUD', nom: 'Dollar australien', symbole: 'A$' },

];


const tauxDeConversion = {
    // Devises de base
    EUR: { 
        USD: 1.08, GBP: 0.86, CHF: 0.98, JPY: 162.50, CNY: 7.85, 
        CAD: 1.47, AUD: 1.62, XOF: 655.957, XAF: 655.957, CDF: 3000 
    },
    USD: { 
        EUR: 0.92, GBP: 0.79, CHF: 0.91, JPY: 150.25, CNY: 7.25, 
        CAD: 1.35, AUD: 1.50, XOF: 605, XAF: 605, CDF: 2775 
    },
    GBP: { 
        EUR: 1.16, USD: 1.26, CHF: 1.15, JPY: 190.50, CNY: 9.15, 
        CAD: 1.70, AUD: 1.89, XOF: 765, XAF: 765, CDF: 3500 
    },
    CHF: { 
        EUR: 1.02, USD: 1.10, GBP: 0.87, JPY: 166.80, CNY: 8.02, 
        CAD: 1.49, AUD: 1.66, XOF: 665, XAF: 665, CDF: 3050 
    },
    
    // Franc CFA UEMOA
    XOF: { 
        EUR: 0.0015, USD: 0.00165, GBP: 0.0013, CHF: 0.0015, 
        JPY: 0.25, CNY: 0.012, CAD: 0.0022, AUD: 0.0025, XAF: 1, CDF: 4.6 
    },
    
    // Franc CFA CEMAC (même valeur que XOF)
    XAF: { 
        EUR: 0.0015, USD: 0.00165, GBP: 0.0013, CHF: 0.0015, 
        JPY: 0.25, CNY: 0.012, CAD: 0.0022, AUD: 0.0025, XOF: 1, CDF: 4.6 
    },
    
    // Franc congolais
    CDF: { 
        EUR: 0.00033, USD: 0.00036, GBP: 0.00029, CHF: 0.00033, 
        JPY: 0.054, CNY: 0.0026, CAD: 0.00049, AUD: 0.00054, 
        XOF: 0.22, XAF: 0.22 
    },
    
    // Yen japonais
    JPY: { 
        EUR: 0.0062, USD: 0.0067, GBP: 0.0052, CHF: 0.0060, 
        CNY: 0.048, CAD: 0.0090, AUD: 0.010, XOF: 4.05, XAF: 4.05, CDF: 18.5 
    },
    
    // Yuan chinois
    CNY: { 
        EUR: 0.127, USD: 0.138, GBP: 0.109, CHF: 0.125, 
        JPY: 20.70, CAD: 0.187, AUD: 0.206, XOF: 82.0, XAF: 82.0, CDF: 382 
    },
    
    // Dollar canadien
    CAD: { 
        EUR: 0.68, USD: 0.74, GBP: 0.59, CHF: 0.67, 
        JPY: 110.8, CNY: 5.35, AUD: 1.10, XOF: 445, XAF: 445, CDF: 2040 
    },
    
    // Dollar australien
    AUD: { 
        EUR: 0.62, USD: 0.67, GBP: 0.53, CHF: 0.60, 
        JPY: 100.5, CNY: 4.85, CAD: 0.91, XOF: 405, XAF: 405, CDF: 1860 
    }
};

// Fonctions utilitaires





export { typesProjets , availableProspects , devises , tauxDeConversion , categorieMateriels};