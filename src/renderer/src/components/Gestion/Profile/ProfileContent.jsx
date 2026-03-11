import {
    Person2Rounded, Description, Flag, CalendarToday, Edit, GroupAdd, Category, AccessTime, TrendingUp,
    PriorityHigh, CheckCircle, Pause, Block, PlayArrow
} from '@mui/icons-material'
import React, { useState } from 'react'
import ProfileModify from './ProfileModify';
import { useProjects } from "../../../hooks/useProjets"

// Main Component
const ProfileContent = ({ project }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { updateProject } = useProjects();


    // Fonction pour mettre à jour les données du projet
    const handleUpdateProject = (updatedData) => {
        updateProject(project.id, updatedData);
    };

    // Fonction pour obtenir la couleur et l'icône du statut
    const getStatusInfo = (status) => {
        switch (status) {
            case 'planification':
                return {
                    color: 'bg-green-100 text-green-800',
                    icon: <PlayArrow className="text-green-600" />,
                    label: 'En cours'
                };
            case 'termine':
                return {
                    color: 'bg-blue-100 text-blue-800',
                    icon: <CheckCircle className="text-blue-600" />,
                    label: 'Terminé'
                };
            case 'en_pause':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: <Pause className="text-yellow-600" />,
                    label: 'En pause'
                };
            case 'annule':
                return {
                    color: 'bg-red-100 text-red-800',
                    icon: <Block className="text-red-600" />,
                    label: 'Annulé'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: <AccessTime className="text-gray-600" />,
                    label: status
                };
        }
    };

    // Fonction pour obtenir la couleur de la priorité
    const getPriorityColor = (priorite) => {
        switch (priorite) {
            case 'haute':
                return 'bg-red-100 text-red-800';
            case 'moyenne':
                return 'bg-yellow-100 text-yellow-800';
            case 'basse':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    // Fonction pour obtenir la couleur et l'icône du statut
    const detailTypeProjet = (type_projet) => {
        const typesProjets = {

            // Types de projet avec descriptions détaillées
            'projet d’amélioration': {
                color: 'bg-purple-100 text-purple-800',
                label: 'Amélioration continue',
                description: 'Optimisation des processus existants pour gagner en efficacité opérationnelle et réduire les coûts. Ce type de projet vise à perfectionner progressivement les méthodes de travail, la qualité des produits ou services, et la satisfaction des parties prenantes à travers des ajustements mesurables et durables.'
            },
            'projet de recherche': {

                label: 'Recherche & Développement',
                description: 'Exploration approfondie de nouvelles connaissances, technologies ou méthodologies dans un domaine spécifique. Ces projets impliquent généralement des phases d\'expérimentation, d\'analyse de données, et de validation scientifique pour aboutir à des découvertes ou innovations pouvant être brevetées ou publiées.'
            },
            'projet d’innovation': {
                color: 'bg-pink-100 text-pink-800',
                label: 'Innovation',
                description: 'Création et développement de solutions nouvelles et disruptives qui transforment les marchés ou les usages existants. Ces projets nécessitent une approche créative, une veille technologique constante, et une capacité à prendre des risques calculés pour proposer des produits, services ou modèles économiques révolutionnaires.'
            },
            'projet d’investissement': {
                color: 'bg-emerald-100 text-emerald-800',
                label: 'Investissement',
                description: 'Acquisition stratégique d\'actifs corporels ou incorporels pour développer l\'entreprise et générer des retours sur investissement à long terme. Ces projets incluent l\'achat d\'équipements, de biens immobiliers, de participations dans d\'autres sociétés, ou le financement de grandes infrastructures avec une analyse rigoureuse de la rentabilité et des risques financiers.'
            },
            'projet éducatif': {
                color: 'bg-cyan-100 text-cyan-800',
                label: 'Éducation',
                description: 'Conception et mise en œuvre de programmes de formation et de développement des compétences pour les apprenants de tous niveaux. Ces projets visent à transmettre des connaissances théoriques et pratiques, à évaluer les acquis pédagogiques, et à adapter les méthodes d\'enseignement aux besoins spécifiques des publics cibles dans un environnement d\'apprentissage structuré.'
            },
            'projet événementiel': {
                color: 'bg-amber-100 text-amber-800',

                label: 'Événementiel',
                description: 'Organisation complète d\'événements temporaires tels que des conférences, festivals, salons professionnels ou cérémonies. Ces projets impliquent la coordination de multiples prestataires, la gestion logistique des lieux et du matériel, la planification minutieuse du programme, et l\'accueil des participants pour créer des expériences mémorables et atteindre des objectifs de communication ou de rassemblement.'
            },
            'projet humanitaire': {
                color: 'bg-rose-100 text-rose-800',

                label: 'Humanitaire',
                description: 'Actions à but non lucratif destinées à aider les populations vulnérables et à améliorer leurs conditions de vie. Ces projets répondent à des urgences (catastrophes naturelles, conflits) ou s\'inscrivent dans le développement durable (santé, éducation, accès à l\'eau), nécessitant une coordination avec les autorités locales, une gestion transparente des dons, et une présence sur le terrain pour un impact direct et mesurable.'
            },
            'projet informatique': {
                color: 'bg-blue-100 text-blue-800',

                label: 'Informatique',
                description: 'Développement de solutions logicielles, d\'applications ou d\'infrastructures techniques répondant à des besoins fonctionnels précis. Ces projets suivent généralement des méthodologies agiles ou en cycle en V, incluant des phases de conception, de codage, de tests, de déploiement et de maintenance, avec une attention particulière à la sécurité des données, à l\'expérience utilisateur et à l\'évolutivité des systèmes.'
            },
            'projet industriel': {
                color: 'bg-slate-100 text-slate-800',

                label: 'Industriel',
                description: 'Conception, réalisation et optimisation d\'installations de production, de chaînes de montage ou d\'unités de fabrication. Ces projets complexes mobilisent des compétences en génie des procédés, en gestion de la supply chain, en contrôle qualité et en maintenance, avec des enjeux majeurs de productivité, de sécurité des travailleurs et de respect des normes environnementales et industrielles.'
            },
            'projet organisationnel': {
                color: 'bg-violet-100 text-violet-800',
                label: 'Organisationnel',
                description: 'Optimisation et restructuration des processus internes, des organigrammes et des méthodes de travail au sein d\'une organisation. Ces projets visent à améliorer la circulation de l\'information, à clarifier les responsabilités, à réduire les redondances et à adapter la structure aux nouveaux défis stratégiques, impliquant souvent une conduite du changement auprès des équipes pour assurer l\'adhésion et la réussite des transformations.'
            }
        };

        return typesProjets[type_projet] || {
            color: 'bg-gray-100 text-gray-800',
            label: type_projet || 'Non défini',
            description: 'Type de projet non spécifié dans la base de données. Veuillez consulter l\'administrateur pour obtenir plus d\'informations sur la nature et les objectifs de ce projet particulier.'
        };
    };

    const typeInfo = detailTypeProjet(project.type_projet);

    const statusInfo = getStatusInfo(project.status);

    // Formater les dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Non définie';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };


    const formateDate2 = (dateString) => {
        if (!dateString) return 'Non définie';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }




    return (
        <div className="min-h-screen bg-gray-200 px-4  ">

            <div className="max-w-8xl mx-auto flex flex-col items-center py-2 pb-4 ">

                {/* Header avec gradient */}
                <div className='w-full  bg-primary shadow-sm rounded-lg p-4 flex justify-between items-center'>
                    <h1 className='text-xl text-white font-bold'>Profil du projet</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center gap-2 shadow-md'
                    >
                        <Edit /> Modifier les informations
                    </button>
                </div>


                {/* Contenu principal */}
                <div className='w-full rounded-b-lg p-4'>
                    {/* Section Statut et Priorité */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>

                        {/* Statut */}
                        <div className='bg-white p-4 rounded-lg shadow-md'>
                            <div className='flex items-center gap-3 mb-3'>
                                <AccessTime className='text-blue-600' />
                                <h3 className='text-lg font-semibold text-gray-700'>Statut</h3>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.color}`}>
                                {statusInfo.icon}
                                <span className='font-medium'>{statusInfo.label}</span>
                            </div>
                        </div>


                        {/* Progression */}
                        <div className='bg-white p-4 rounded-lg shadow-md'>
                            <div className='flex items-center gap-3 mb-3'>
                                <TrendingUp className='text-blue-600' />
                                <h3 className='text-lg font-semibold text-gray-700'>Progression</h3>
                            </div>
                            <div className='flex items-center gap-4'>
                                <div className='flex-1'>
                                    <div className='w-full bg-gray-200 rounded-full h-3'>
                                        <div
                                            className='bg-blue-600 rounded-full h-3 transition-all duration-500'
                                            style={{ width: `20%` }}
                                        ></div>
                                    </div>
                                </div>
                                <span className='text-xl font-bold text-blue-600'>20%</span>
                            </div>
                        </div>
                    </div>

                    {/* Informations générales */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
                        {/* Nom du projet */}
                        <div className='bg-blue-100 p-6 rounded-lg shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-blue-600 rounded-full'>
                                    <Person2Rounded className='text-white' />
                                </div>
                                <h3 className='text-xl font-bold text-gray-800'>Nom du projet</h3>
                            </div>
                            <p className='text-gray-700 font-medium pl-14'>
                                {project.nom_projet ? project.nom_projet : " non defini"}
                            </p>
                        </div>

                        {/* Chef de projet */}
                        <div className='bg-green-100 p-6 rounded-lg shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-green-600 rounded-full'>
                                    <Person2Rounded className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Chef de projet</h3>
                            </div>
                            <p className='text-gray-700 font-medium pl-14'>
                                {project.chef_projet ? project.chef_projet : " non defini"}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className='mb-8'>
                        <div className='p-6 rounded-lg shadow-sm bg-purple-100'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-purple-600 rounded-full'>
                                    <Description className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Description du projet</h3>
                            </div>
                            <p className='text-gray-600 pl-14'>

                                {project.description ? project.description : " non defini"}
                            </p>
                        </div>
                    </div>

                    {/* Dates du projet */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <div className='flex items-center gap-3 mb-3'>
                                <CalendarToday className='text-green-500' />
                                <h3 className='font-semibold text-gray-700'>Date de début</h3>
                            </div>
                            <p className='text-lg font-medium text-gray-800'>
                                {project.date_debut ? formateDate2(project.date_debut) : " non defini"}
                            </p>
                        </div>

                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <div className='flex items-center gap-3 mb-3'>
                                <CalendarToday className='text-blue-500' />
                                <h3 className='font-semibold text-gray-700'>Date de fin prévue</h3>
                            </div>
                            <p className='text-lg font-medium text-gray-800'>
                                {project.date_fin ? formateDate2(project.date_fin) : " non defini"}
                            </p>
                        </div>


                    </div>

                    {/* Objectifs */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
                        {/* Court terme */}
                        <div className='p-6 rounded-lg bg-yellow-100 shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-yellow-600 rounded-full'>
                                    <Flag className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Objectif à court terme</h3>
                            </div>
                            <p className='text-gray-600 mb-4 pl-14'>

                                {project.objectif_court_terme ? project.objectif_court_terme : " non defini"}
                            </p>
                            <div className='space-y-3 pl-14'>
                                <div className='flex items-center gap-3 text-sm'>
                                    <CalendarToday className='text-blue-500' />
                                    <span className='font-semibold'>Début :</span>
                                    <span className='text-gray-600'>
                                        {project.objectif_court_terme_debut ? formateDate2(project.objectif_court_terme_debut) : " non defini"}
                                    </span>
                                </div>
                                <div className='flex items-center gap-3 text-sm'>
                                    <CalendarToday className='text-red-500' />
                                    <span className='font-semibold'>Fin :</span>
                                    <span className='text-gray-600'>
                                        {project.objectif_court_terme_fin ? formateDate2(project.objectif_court_terme_fin) : " non defini"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Long terme */}
                        <div className='bg-green-100 p-6 rounded-lg shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-green-600 rounded-full'>
                                    <Flag className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Objectif à long terme</h3>
                            </div>
                            <p className='text-gray-600 mb-4 pl-14'>
                                {project.objectif_long_terme ? project.objectif_long_terme : " non defini"}
                            </p>
                            <div className='space-y-3 pl-14'>
                                <div className='flex items-center gap-3 text-sm'>
                                    <CalendarToday className='text-blue-500' />
                                    <span className='font-semibold'>Début :</span>
                                    <span className='text-gray-600'>
                                        {project.objectif_long_terme_debut ? formateDate2(project.objectif_long_terme_debut) : " non defini"}
                                    </span>
                                </div>
                                <div className='flex items-center gap-3 text-sm'>
                                    <CalendarToday className='text-red-500' />
                                    <span className='font-semibold'>Fin :</span>
                                    <span className='text-gray-600'>
                                        {project.objectif_long_terme_fin ? formateDate2(project.objectif_long_terme_fin) : " non defini"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clients cibles et Type de projet */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        {/* Clients cibles */}
                        <div className='p-6 rounded-lg bg-red-100 shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-red-600 rounded-full'>
                                    <GroupAdd className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Prospects cibles</h3>
                            </div>
                            <div className='pl-14'>
                                <ul className='list-disc pl-5 space-y-1'>
                                    <ul className='list-disc pl-5 space-y-1'>
                                        {Array.isArray(project?.prospects_cibles) && project.prospects_cibles.length > 0 ? (
                                            project.prospects_cibles.map((prospect, index) => (
                                                <li key={index} className='text-gray-700'>
                                                    {prospect}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-gray-500 italic">Non défini</li>
                                        )}
                                    </ul>
                                </ul>
                            </div>
                        </div>

                        {/* Type de projet */}
                        <div className='bg-gray-100 p-6 rounded-lg shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-gray-700 rounded-full'>
                                    <Category className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Type de projet</h3>
                            </div>
                            <div className='pl-14'>
                                <span className='inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-3'>
                                    {project.type_projet ? project.type_projet : "non defini"}
                                </span>
                                <p className='text-gray-600'>
                                    {typeInfo.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de modification */}
            <ProfileModify
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={project}
                onSave={handleUpdateProject}
            />
        </div>
    );
};

export default ProfileContent;