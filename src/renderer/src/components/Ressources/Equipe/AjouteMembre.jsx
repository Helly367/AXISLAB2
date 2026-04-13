import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Close, Save, Person, Work, Email, School, Wc, Phone } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useMembres } from '../../../hooks/useMembers';
import { styleChamps, verifieChamps } from '../../../Services/functions';
import { alertService } from '../../../Services/alertService';

const AjouterMembre = ({ isOpen, onClose, project }) => {
    const [loading, setLoading] = useState(false)
    const { createMembre } = useMembres();

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


    useEffect(() => {
        if (isOpen) {
            reset({
                nomComplet: '',
                poste: '',
                role: '',
                email: '',
                sexe: '',
                telephone: '',
                niveau_etude: '',
                competences: [''],
            });
        }
    }, [isOpen, reset]);


    // Vérification au montage
    useEffect(() => {
        if (isOpen) {
            if (!project) {
                console.log("Attention: project est undefined");
            }
        }
    }, [isOpen, project]);

    const handleClose = () => {
        reset();
        setLoading(false);
        onClose();
    };

    const watchedFields = watch();
    const style = styleChamps();



    const onSubmit = async (data) => {

        if (!isDirty) {
            alertService.info("Aucune modification détectée")
            setLoading(false);
            return;
        }
        
        setLoading(true);

        try {
            const newMember = {
                ...data,
                projet_id: project.projet_id,
                competences: (data.competences || []).map(m => m.trim()).filter(Boolean)
            };

            console.log(newMember);


            await new Promise(resolve => setTimeout(resolve, 3000));
            const result = await createMembre(newMember);


            if (!result || !result.success) {
                console.error(result?.error || result?.errors || "Erreur inconnue");
                setLoading(false); // ← Important : arrêter le loading même en cas d'erreur
                return;
            }

            setLoading(false);
            handleClose();

        } catch (error) {
            console.error("Erreur inattendue:", error);
            setLoading(false); // ← Arrêter le loading en cas d'exception
        }
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="bg-primary p-2 flex justify-between items-center sticky top-0">
                    <h2 className="text-2xd text-white font-bold">
                        Ajouter un membre
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

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
                            placeholder="Ex: Helly vibe's"
                        />

                        {errors.nomComplet && (
                            <p className="text-red-500 text-sm">{errors.nomComplet.message}</p>
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
                            placeholder="Chef projet, Dev..."
                        />

                        {errors.poste && (
                            <p className="text-red-500 text-sm">{errors.poste.message}</p>
                        )}
                    </div>


                    {/* Rôle */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Rôle
                        </label>

                        <input
                            type="text"
                            {...register('role', { required: 'Le rôle est requis' })}
                            maxLength={80} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 80) {
                                    e.target.value = e.target.value.slice(0, 80);
                                }
                                // mettre à jour React Hook Form
                                register('role').onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, 'role')} `}
                        />
                        {errors.role && (
                            <p className="text-red-500 text-sm">{errors.role.message}</p>
                        )}

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

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <Email className="inline mr-2 text-primary" />
                            Email
                        </label>

                        <input
                            type="email"
                            {...register('email',
                                { required: "L'email de téléphone est requis" })}
                            maxLength={120} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 120) {
                                    e.target.value = e.target.value.slice(0, 120);
                                }
                                // mettre à jour React Hook Form
                                register('email').onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, 'email')} `}
                            placeholder='Ex: hellyvibes@gmail.com'
                        />

                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
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
                            placeholder='Ex: hellyvibes@gmail.com'
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
                                    {...register(`competences.${index}`, {
                                        required: 'Compétence requise'
                                    })}
                                    maxLength={80} // limite stricte
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



                    {/* Buttons */}
                    <div className="flex justify-end gap-3 border-t pt-4">

                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 border rounded-lg">
                            Annuler
                        </button>

                        <motion.button
                            type="submit"
                            disabled={loading || Object.keys(errors).length > 0}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:cursor-not-allowed disabled:bg-gray-400'
                        >

                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Ajout en cours ...
                                </>
                            ) : (
                                <>
                                    <Save /> Ajouter

                                </>
                            )}

                        </motion.button>
                    </div>


                </form>
            </div>
        </div>
    );
};

export default AjouterMembre;