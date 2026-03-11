import React from "react";
import { Warning } from "@mui/icons-material";

const DeleteConfirm = ({ open, onClose, onConfirm, title = "Supprimer cet élément ?", message = "Cette action est irréversible." }) => {

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">

            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-opacity"
                onClick={onClose}
            />

            {/* MODAL */}
            <div className="relative bg-white rounded-xl shadow-xl w-[400px] p-6 animate-fadeIn">

                {/* ICON */}
                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 text-red-600 p-3 rounded-full">
                        <Warning fontSize="large" />
                    </div>
                </div>

                {/* TITLE */}
                <h2 className="text-lg font-semibold text-center mb-2">
                    {title}
                </h2>

                {/* MESSAGE */}
                <p className="text-gray-500 text-sm text-center mb-6">
                    {message}
                </p>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        Annuler
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                        Supprimer
                    </button>

                </div>

            </div>
        </div>
    );
};

export default DeleteConfirm;