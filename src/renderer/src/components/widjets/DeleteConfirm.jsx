import React from "react";
import { Delete, Close } from "@mui/icons-material";
import { limiteTexte } from "../../Services/functions";
import { motion } from "framer-motion";

const DeleteConfirm = ({
    open,
    onClose,
    onConfirm,
    title = "Supprimer cet élément ?",
    message = "Cette action est irréversible.",
    loading
}) => {

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">

            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-opacity"
                onClick={onClose}
            />

            {/* MODAL */}
            <div className="relative bg-white rounded-xl shadow-xl w-120 animate-fadeIn">

                <div className="flex items-center justify-between border-b-2 border-red-400 p-2">

                    <div className="flex items-center gap-1">
                        <Delete fontSize="medium" className="text-red-600" />
                        <h3>{title}</h3>
                    </div>

                    <button
                        onClick={onClose}
                        className="hover:bg-red-500 hover:text-white transition-colors rounded-full p-0.5">
                        <Close />
                    </button>
                </div>

                <div className="flex flex-col items-center mt-8">

                    <div className="flex flex-col items-center gap-2">
                        <p className="text-black text-xl text-center font-medium px-4">
                            {limiteTexte(message, 100)}
                        </p>
                        <span className="text-2xd text-gray-600 mt-2">Cette action est irréversible.</span>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex self-end gap-3 p-4 mt-6">

                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
                        >
                            Annuler
                        </button>

                        <motion.button
                            onClick={onConfirm}
                            type="button"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex gap-2 px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed "
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Suppression en cours ...
                                </>
                            ) : (
                                "Supprimer"
                            )}
                        </motion.button>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default DeleteConfirm;