## Nom du projet

`Aryo Academy`

## Description

`Création d’un campus universitaire écologique avec énergie renouvelable, espaces verts et bâtiments durables.`

## Objet à long terme

`Développer un campus zéro carbone et promouvoir la durabilité environnementale dans l’enseignement supérieur.`

## Objectif à court terme

`Mettre en place les infrastructures principales pour démarrer les activités académiques dans un bâtiment écologique.`

## Type du projet

`Projet environnemental et éducatif`


## Étape 1 : Étude et planification

### Tâches:

`Analyse de faisabilité ,Étude de terrain et impact environnemental , Élaboration du plan du campus`

### Objectif 

` Définir la faisabilité et les besoins exacts Budget: 50 000 €`

## Étape 2 : Conception architecturale

### Tâches:

`Conception des bâtiments écologiques , Sélection des matériaux durables , Validation des plans par les autorités 

## Objectif 
`Obtenir des plans prêts pour construction Budget: 100 000 € `

## Étape 3 : Construction des infrastructures

###  Tâches:
`Construction des bâtiments principaux , Installation des systèmes solaires et éoliens , Aménagement des espaces verts`

### Objectif 
`Avoir un campus opérationnel Budget: 1 000 000 €`

## Étape 4 : Équipement et aménagement

### Tâches:

`Achat de mobilier écologique , Installation de laboratoires et bibliothèques , Mise en place des systèmes informatiques

### Objectif
`Préparer le campus pour les étudiants et le personnel , Budget: 200 000 €`

## Étape 5 : Lancement et suivi

### Tâches

`Ouverture officielle du campus , Suivi de consommation énergétique , Ajustements pour optimiser la durabilité`

### Objectif
`Assurer le fonctionnement durable du campus Budget: 50 000 € `


Voici les détails demandés pour le projet GreenCampus :

1. Matériaux nécessaires

Bois certifié durable (bâtiments, mobilier)

Béton écologique (béton à faible émission CO₂)

Panneaux solaires et turbines éoliennes

Systèmes de récupération d’eau de pluie

Matériaux d’isolation thermique écologiques (laine de bois, chanvre)

Peintures et revêtements non toxiques

Équipements informatiques et de laboratoire à faible consommation énergétique

2. Campagnes à prévoir

Campagne de sensibilisation : informer étudiants, professeurs et communauté sur l’importance du campus écologique.

Campagne de financement : lever des fonds via subventions publiques et partenaires privés.

Campagne de recrutement : attirer personnel et enseignants intéressés par la durabilité.

Campagne de communication environnementale : mettre en avant les actions durables du campus dans les médias et réseaux sociaux.

3. Risques possibles

Retards de construction : météo, fournisseurs, permis administratifs.

Dépassement de budget : prix des matériaux durables plus élevés que prévu.

Problèmes techniques : installation des systèmes énergétiques renouvelables.

Adoption limitée : étudiants ou personnel peu impliqués dans les pratiques durables.

Réglementations : changements législatifs ou normes environnementales strictes.

Si tu veux, je peux te créer un tableau complet “Matériaux – Campagnes – Risques” par étape, pour que ce soit prêt pour un dossier de projet. Veux‑tu que je fasse ça ?

metriel , description et prix 

Voici un exemple clair de matériel pour le projet GreenCampus avec description et prix estimatif :

Matériel	Description	Prix estimatif (€)
Bois certifié durable	Pour construction et mobilier écologique	50 000
Béton écologique	Béton à faible émission de CO₂ pour bâtiments	120 000
Panneaux solaires	Pour production d’énergie renouvelable	80 000
Turbines éoliennes	Petite éolienne pour complément énergétique	60 000
Systèmes récupération eau pluie	Collecte et stockage d’eau pour irrigation	20 000
Isolation thermique écologique	Laine de bois, chanvre pour réduire consommation énergie	30 000
Peintures et revêtements non toxiques	Sécurité et durabilité des finitions intérieures	10 000
Mobilier écologique	Tables, chaises, bureaux durables	40 000
Équipements informatiques et laboratoires	Ordinateurs, imprimantes, matériel de labo à faible consommation	90 000

Total estimatif : 500 000 €

Si tu veux, je peux maintenant associer ce matériel à chaque étape du projet avec budget précis par étape pour un plan complet. Veux‑tu que je fasse ça ?



Explication

Cette ligne met à jour uniquement la phase modifiée dans le tableau phases.
Décomposition
javascript

setPhases(prev => prev.map(p =>
    Number(p.phase_id) === Number(result.data.phase_id)
        ? { ...p, ...result.data }
        : p
));

    setPhases(prev => ...)

        Fonction de mise à jour qui reçoit l'état actuel prev

    prev.map(p => ...)

        Parcourt chaque phase p du tableau

    Number(p.phase_id) === Number(result.data.phase_id)

        Compare l'ID de la phase actuelle avec l'ID de la phase modifiée

    ? { ...p, ...result.data }

        Si les ID correspondent :

            { ...p } : garde toutes les propriétés existantes

            ...result.data : écrase avec les nouvelles valeurs de la phase mise à jour

            Résultat : une phase fusionnée (anciennes + nouvelles données)

    : p

        Si les ID ne correspondent pas : garde la phase inchangée

Exemple concret

Avant :
javascript

phases = [
  { phase_id: 1, title: "Phase A", budget_restant: 1000 },
  { phase_id: 2, title: "Phase B", budget_restant: 800 }
]

Après modification de la phase 1 : result.data = { phase_id: 1, title: "Phase A", budget_restant: 800 }

Résultat :
javascript

phases = [
  { phase_id: 1, title: "Phase A", budget_restant: 800 },  // ✅ mise à jour
  { phase_id: 2, title: "Phase B", budget_restant: 800 }   // inchangée
]

