import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Close, Save, Person, Work, Email, School, Wc, Phone } from "@mui/icons-material";
import WarningContent from '../../widjets/WarningContent';
import { motion } from 'framer-motion';
import { useMembres } from '../../../hooks/useMembers';
import { alertService } from '../../../Services/alertService'; // Si vous avez un service d'alert
import { styleChamps, verifieChamps } from '../../../Services/functions';


const ModifyMembre = ({ isOpen, onClose, memberToEdit, project }) => {
    const [loading, setLoading] = useState(false);
    const [isCompetenceError, setIsCompentenceError] = useState(false);
    const [compentenceError, setCompentenceError] = useState('');
    const { updateMembre } = useMembres();
    const [validationErrors, setValidationErrors] = useState([]);

    const { register, control, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm({
        defaultValues: {
            nomComplet: '',
            poste: '',
            role: '',
            email: '',
            sexe: '',
            telephone: '',
            niveau_etude: '',
            competences: [''],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'competences'
    });

    // Reset form quand memberToEdit change
    useEffect(() => {
        if (memberToEdit) {

            reset({
                nomComplet: memberToEdit.nomComplet || '',
                poste: memberToEdit.poste || '',
                role: memberToEdit.role || '',
                email: memberToEdit.email || '',
                sexe: memberToEdit.sexe || '',
                telephone: memberToEdit.telephone || '',
                niveau_etude: memberToEdit.niveau_etude || '',
                competences: memberToEdit.competences?.length
                    ? memberToEdit.competences
                    : [''],
            });
        }
    }, [memberToEdit, reset]);

    const watchedFields = watch();
    const style = styleChamps();

    const onSubmit = async (data) => {

        // Récupérer les compentences originales
        const originalCompetences = memberToEdit?.competences?.length ? memberToEdit.competences : [''];
        const currentCompetences = data.competences || [];

        // Vérifier si les tâches ont changé
        const hasCompetencesChanged =
            currentCompetences.length !== originalCompetences.length ||
            currentCompetences.some((competence, index) =>
                competence?.trim() !== originalCompetences[index]?.trim()
            );

        // Vérifier modification globale OU modification des tâches
        if (!isDirty && !hasCompetencesChanged) {
            alertService.info("Aucune modification détectée");
            setLoading(false);
            return;
        }

        // Vérifier qu'il y a au moins une competence remplie
        const hasCompetence = currentCompetences.some(c => c && c.trim() !== '');
        if (!hasCompetence) {
            setIsCompentenceError(true);
            setCompentenceError("Ajoute au moins une competence");
            setLoading(false);
            return;
        }
        setLoading(true);
        setValidationErrors([]);

        try {
            // Préparer UNIQUEMENT les champs du formulaire
            const updatedMember = {
                nomComplet: data.nomComplet,
                poste: data.poste,
                role: data.role,
                email: data.email,
                sexe: data.sexe,
                telephone: data.telephone,
                niveau_etude: data.niveau_etude,
                competences: (data.competences || [])
                    .map(m => m?.trim())
                    .filter(Boolean),
                membre_id: memberToEdit.membre_id
            };



            if (!memberToEdit?.membre_id) {
                throw new Error("ID du membre manquant");
            }

            // Simuler un délai (à enlever en production)
            await new Promise(resolve => setTimeout(resolve, 1000));
            const result = await updateMembre(project.projet_id, updatedMember);
            console.log(result);



            if (!result || !result.success) {
                // Afficher les erreurs de validation
                if (result?.errors) {
                    console.error("Erreurs de validation:", result.errors);
                    setValidationErrors(result.errors);

                    // Option: afficher avec alertService
                    if (alertService) {
                        alertService.error(
                            result.errors.map(e => `${e.field}: ${e.message}`).join('\n')
                        );
                    }
                }
                setLoading(false);
                return;
            }

            // Succès
            setLoading(false);
            handleClose();

        } catch (error) {
            console.error("Erreur inattendue:", error);
            setLoading(false);

            if (alertService) {
                alertService.error(error.message);
            }
        }
    };

    const handleClose = () => {
        reset();
        setValidationErrors([]);
        onClose();
    };

    if (!isOpen) return null;

    const renderContent = () => {
        if (!memberToEdit) {
            return (
                <WarningContent
                    onClose={onClose}
                    title={"Information"}
                    message={"Les informations de ce membre n'existent pas ou ont été corrompues"}
                />
            );
        }

        return (
            <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                    {/* Header */}
                    <div className="bg-primary p-2 flex justify-between items-center sticky top-0">
                        <h2 className="text-2xd text-white font-bold">
                            Modifier le membre
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-blue-700 p-1 rounded-full">
                            <Close />
                        </button>
                    </div>

                    {/* Affichage des erreurs de validation */}
                    {validationErrors.length > 0 && (
                        <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
                            <h3 className="text-red-700 font-medium mb-2">Erreurs de validation :</h3>
                            <ul className="list-disc pl-5">
                                {validationErrors.map((err, idx) => (
                                    <li key={idx} className="text-red-600 text-sm">
                                        {err.field}: {err.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        {/* ... reste du formulaire ... */}

                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <Person className="inline mr-2 text-primary" />
                                Nom complet
                            </label>

                            <input
                                type="text"
                                {...register('nomComplet', {
                                    required: 'Le nom est requis',
                                    minLength: { value: 2, message: 'Minimum 2 caractères' }
                                })}
                                maxLength={80} // limite stricte
                                onChange={(e) => {
                                    if (e.target.value.length > 80) {
                                        e.target.value = e.target.value.slice(0, 80);
                                    }
                                    // mettre à jour React Hook Form
                                    register('nomComplet').onChange(e)
                                }}
                                className={`${style} ${verifieChamps(errors, watchedFields, 'nomComplet')} `}
                            />

                            {errors.nom && (
                                <p className="text-red-500 text-sm">{errors.nom.message}</p>
                            )}
                        </div>

                        {/* Poste */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <Work className="inline mr-2 text-primary" />
                                Poste
                            </label>

                            <input
                                type="text"
                                {...register('poste', { required: 'Le poste est requis' })}
                                maxLength={80} // limite stricte
                                onChange={(e) => {
                                    if (e.target.value.length > 80) {
                                        e.target.value = e.target.value.slice(0, 80);
                                    }
                                    // mettre à jour React Hook Form
                                    register('poste').onChange(e)
                                }}
                                className={`${style} ${verifieChamps(errors, watchedFields, 'poste')} `}
                            />
                        </div>

                        {/* contacte */}
                        <div className='grid grid-cols-2 gap-4'>

                            {/* sexe */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Wc className="inline mr-2 text-primary" />
                                    Sexe
                                </label>

                                <select
                                    type="text"
                                    {...register('sexe',
                                        { required: 'Veuillez selectionnez un sexe' }
                                    )}

                                    className={`${style} ${verifieChamps(errors, watchedFields, 'sexe')} `}
                                    placeholder='Ex: 0991631180 '
                                >
                                    <option value="Homme">Homme</option>
                                    <option value="Femme">Femme</option>
                                    <option value="Personaliser">Personaliser</option>
                                </select>

                                {errors.sexe && (
                                    <p className="text-red-500 text-sm">{errors.sexe.message}</p>
                                )}


                            </div>

                            {/* Tel */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Phone className="inline mr-2 text-primary" />
                                    Numéro téléphone
                                </label>

                                <input
                                    type="number"
                                    {...register('telephone',
                                        { required: 'Le numéro de téléphone est requis' }
                                    )}
                                    maxLength={12} // limite stricte
                                    onChange={(e) => {
                                        if (e.target.value.length > 12) {
                                            e.target.value = e.target.value.slice(0, 12);
                                        }
                                        // mettre à jour React Hook Form
                                        register('telephone').onChange(e)
                                    }}
                                    className={`${style} ${verifieChamps(errors, watchedFields, 'telephone')} `}
                                    placeholder='Ex: 0991631180 '
                                />

                                {errors.telephone && (
                                    <p className="text-red-500 text-sm">{errors.telephone.message}</p>
                                )}
                            </div>

                        </div>


                        {/* Niveau d'etude */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <School className="inline mr-2 text-primary" />
                                Niveau d'étude
                            </label>

                            <input
                                type="text"
                                {...register('niveau_etude',
                                    { required: "Veuillez renseignez le niveau d'étude" }
                                )}
                                maxLength={80} // limite stricte
                                onChange={(e) => {
                                    if (e.target.value.length > 80) {
                                        e.target.value = e.target.value.slice(0, 80);
                                    }
                                    // mettre à jour React Hook Form
                                    register('niveau_etude').onChange(e)
                                }}
                                className={`${style} ${verifieChamps(errors, watchedFields, 'niveau_etude')} `}
                                placeholder='Ex: Licencié en informatique'
                            />

                            {errors.niveau_etude && (
                                <p className="text-red-500 text-sm">{errors.niveau_etude.message}</p>
                            )}
                        </div>

                        {/* Compétences */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <School className="inline mr-2 text-primary" />
                                Compétences
                            </label>

                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        {...register(`competences.${index}`)}
                                        maxLength={80}
                                        onChange={(e) => {
                                            if (e.target.value.length > 80) {
                                                e.target.value = e.target.value.slice(0, 80);
                                            }
                                            // mettre à jour React Hook Form
                                            register(`competences.${index}`).onChange(e)
                                        }}
                                        className={`${style} ${verifieChamps(errors, watchedFields, `competences.${index}`)} `}
                                    />
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="px-3 bg-red-500 text-white rounded-lg">
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => append('')}
                                className="text-primary text-sm mt-2">
                                + Ajouter compétence
                            </button>
                        </div>

                        {isCompetenceError && (
                            <p className="text-red-500 text-sm mt-1">
                                {compentenceError}
                            </p>
                        )}

                        {/* Boutons */}
                        <div className="flex justify-end gap-3 border-t pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border rounded-lg">
                                Annuler
                            </button>

                            <motion.button
                                type="submit"
                                disabled={loading || Object.keys(errors).length > 0}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed'
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Modification en cours ...
                                    </>
                                ) : (
                                    <>
                                        <Save /> Modifier
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return renderContent();
};

export default ModifyMembre;