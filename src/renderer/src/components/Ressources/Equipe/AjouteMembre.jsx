import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Close, Save, Person, Work, Email, School, Wc, Phone } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useMembres } from '../../../hooks/useMembers';

const AjouterMembre = ({ isOpen, onClose, project }) => {
    const [loading, setLoading] = useState(false)
    const { createMembre } = useMembres();

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
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
        onClose();
    };



    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const newMember = {
                ...data,
                project_id: project.projet_id,
                competences: (data.competences || []).map(m => m.trim()).filter(Boolean)
            };

            await new Promise(resolve => setTimeout(resolve, 3000));
            const result = await createMembre(newMember);

            console.log(result);

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
                <div className="bg-primary p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold">
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
                            className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                focus:outline-none focus:bg-white focus:border-blue-500
                                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                focus:outline-none focus:bg-white focus:border-blue-500
                                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                focus:outline-none focus:bg-white focus:border-blue-500
                                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                focus:outline-none focus:bg-white focus:border-blue-500
                                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                focus:outline-none focus:bg-white focus:border-blue-500
                                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                focus:outline-none focus:bg-white focus:border-blue-500
                                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                focus:outline-none focus:bg-white focus:border-blue-500
                                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                        focus:outline-none focus:bg-white focus:border-blue-500
                                        transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
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