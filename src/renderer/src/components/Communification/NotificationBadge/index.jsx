import React from 'react';
import { Notifications } from "@mui/icons-material";

const NotificationBadge = ({ count, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Notifications />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {count > 9 ? '9+' : count}
                </span>
            )}
        </button>
    );
};

export default NotificationBadge;