import { History, Phone, Email, School, Close, Wc, CalendarToday, Work, Badge, Star, Edit } from '@mui/icons-material'
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DetailsMembre = ({ isOpen, onClose, memberToEdit, getAvatarColor, getInitials, entente }) => {

    useEffect(() => {
        if (isOpen) {
            if (!memberToEdit) {
                console.log("Attention: le membre est undefined");
            }
        }
    }, [isOpen, memberToEdit]);

    const formateDate = (dateString) => {
        if (!dateString) return 'Non définie';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const InfoCard = ({ icon: Icon, label, value, color = "text-primary" }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
        >
            {/* Barre de couleur latérale */}
            <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="p-4 pl-5">
                <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br from-primary/10 to-blue-50`}>
                        <Icon className={`text-primary`} fontSize="small" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                            {label}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 break-words">
                            {value || 'Non renseigné'}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const CompetenceBadge = ({ competence }) => (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-primary/10 to-blue-50 text-primary border border-primary/20 shadow-sm">
            {competence}
        </span>
    );

    const renderContent = () => {
        if (isOpen) {
            if (!memberToEdit) return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
                >
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Close className="text-red-500" style={{ fontSize: 40 }} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Membre introuvable</h3>
                        <p className="text-gray-500 mb-6">Le membre sélectionné n'existe pas ou a été supprimé.</p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
                        >
                            Fermer
                        </button>
                    </div>
                </motion.div>
            );

            return (
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'
                            onClick={onClose}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                key={memberToEdit.membre_id}
                                className="bg-white shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header avec gradient */}
                                <div className="sticky top-0 z-10 bg-gradient-to-r from-primary to-blue-600 p-6 flex justify-between items-center">
                                    <div>
                                        <h3 className='text-2xl text-white font-bold tracking-tight'>
                                            Profil du membre
                                        </h3>
                                        <p className='text-white/80 text-sm mt-1'>
                                            Informations détaillées
                                        </p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={onClose}
                                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                                    >
                                        <Close fontSize="small" />
                                    </motion.button>
                                </div>

                                <div className='p-6 space-y-6'>
                                    {/* Section Avatar et identité */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className='flex flex-col sm:flex-row gap-6 items-center sm:items-start'
                                    >
                                        <div className='relative'>
                                            <div className={`${getAvatarColor(memberToEdit.nomComplet)} w-28 h-28 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white`}>
                                                <h3 className="text-white text-3xl font-bold">
                                                    {getInitials(entente(memberToEdit.nomComplet))}
                                                </h3>
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
                                        </div>

                                        <div className='flex-1 text-center sm:text-left'>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                                {entente(memberToEdit.nomComplet)}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                                                <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold flex items-center gap-1">
                                                    <Work style={{ fontSize: 14 }} /> {entente(memberToEdit.poste)}
                                                </span>
                                                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                                    <Badge style={{ fontSize: 14 }} /> {entente(memberToEdit.role)}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm flex items-center gap-1 justify-center sm:justify-start">
                                                <CalendarToday style={{ fontSize: 16 }} />
                                                Membre depuis {formateDate(memberToEdit.created_at)}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Grille d'informations */}
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <InfoCard
                                            icon={Phone}
                                            label="Téléphone"
                                            value={entente(memberToEdit.telephone)}
                                        />
                                        <InfoCard
                                            icon={Email}
                                            label="Email"
                                            value={entente(memberToEdit.email)}
                                        />
                                        <InfoCard
                                            icon={Wc}
                                            label="Sexe"
                                            value={entente(memberToEdit.sexe)}
                                        />
                                        <InfoCard
                                            icon={School}
                                            label="Niveau d'étude"
                                            value={entente(memberToEdit.niveau_etude)}
                                        />
                                    </div>

                                    {/* Section Compétences */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-2 bg-gradient-to-br from-primary/10 to-blue-50 rounded-lg">
                                                <Star className="text-primary" fontSize="small" />
                                            </div>
                                            <h4 className="font-semibold text-gray-800">Compétences</h4>
                                            <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                {memberToEdit.competences?.length || 0}
                                            </span>
                                        </div>

                                        <div className='flex gap-2 flex-wrap'>
                                            {memberToEdit.competences?.length > 0 ? (
                                                memberToEdit.competences.map((competence, index) => (
                                                    <CompetenceBadge key={index} competence={competence} />
                                                ))
                                            ) : (
                                                <p className="text-gray-400 text-sm italic">Aucune compétence renseignée</p>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Footer avec actions */}
                                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={onClose}
                                            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Fermer
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2"
                                        >
                                            <Edit fontSize="small" />
                                            Modifier
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            );
        }
        return null;
    }

    return renderContent();
}

export default DetailsMembre;