import React from "react";
import { Warning } from "@mui/icons-material";

const WarningContent = ({ onClose, title = "Supprimer cet élément ?", message = "" }) => {



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
                    <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
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
                        className="px-4 py-2 text-sm rounded-lg border   bg-yellow-600 text-white hover:bg-yellow-700"
                    >
                        D'accord
                    </button>


                </div>

            </div>
        </div>
    );
};

export default WarningContent;