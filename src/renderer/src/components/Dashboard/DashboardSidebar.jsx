import React, { useState, useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
    Person2Rounded,
    Schema,
    Groups,
    AttachMoney,
    Inventory,
    Campaign,
    Warning,
    Assignment,
    Folder,
    Notifications,
    Settings,
    ChevronLeft,
    ChevronRight,
    TrendingUp
} from "@mui/icons-material";
import { useProjects } from "../../hooks/useProjets";

const DashboardSidebar = ({
    membersCount = 0,
    materielsCount = 0,
    tasksEnCours = 0,
    campagnesEnCours = 0,
    notificationsCount = 0
}) => {
    const { projet_id: paramProjetId } = useParams();
    const { activeProject } = useProjects();
    const [collapsed, setCollapsed] = useState(false);

    // On sécurise le projet_id pour construire les paths
    const projetId = paramProjetId || activeProject?.projet_id || "default";

    const menuItems = useMemo(() => [
        { name: "Profile", icon: <Person2Rounded />, path: `/dashboard/${projetId}/profile` },
        { name: "Budget", icon: <AttachMoney />, path: `/dashboard/${projetId}/budget` },
        { name: "Phases", icon: <Schema />, path: `/dashboard/${projetId}/structure` },
        { name: "Équipe", icon: <Groups />, path: `/dashboard/${projetId}/equipe`, badge: membersCount },
        { name: "Matériels", icon: <Inventory />, path: `/dashboard/${projetId}/materiels`, badge: materielsCount },
        { name: "Campagnes", icon: <Campaign />, path: `/dashboard/${projetId}/campagnes`, badge: campagnesEnCours },
        { name: "Risques", icon: <Warning />, path: `/dashboard/${projetId}/risques` },
        { name: "Tâches", icon: <Assignment />, path: `/dashboard/${projetId}/taches`, badge: tasksEnCours },
        { name: "Progress", icon: <TrendingUp />, path: `/dashboard/${projetId}/progress` },
        { name: "Mes projets", icon: <Folder />, path: "/mesprojets" },
        { name: "Notifications", icon: <Notifications />, path: "/notifications", badge: notificationsCount },
        { name: "Paramètres", icon: <Settings />, path: "/parametres" }
    ], [membersCount, materielsCount, tasksEnCours, campagnesEnCours, notificationsCount, projetId]);

    const NavButton = ({ collapsed, item }) => (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative w-full
        ${isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`
            }
        >
            <span className={`text-xl ${collapsed ? "mx-auto" : ""}`}>{item.icon}</span>

            {!collapsed && (
                <>
                    <span className="font-medium text-sm">{item.name}</span>
                    {item.badge > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
                    )}
                </>
            )}

            {collapsed && item.badge > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full pointer-events-none">
                    {item.badge}
                </span>
            )}
        </NavLink>
    );

    return (
        <div className={`h-full ${collapsed ? "w-20" : "w-60"} bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out`}>
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 flex-shrink-0">
                {!collapsed && (
                    <h2 className="text-lg font-bold text-blue-600 transition-opacity duration-200">Axis Lab</h2>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`p-1 rounded hover:bg-gray-100 transition-transform duration-200 ${collapsed ? "mx-auto" : ""}`}
                >
                    {collapsed ? <ChevronRight className="transition-transform duration-200" /> : <ChevronLeft className="transition-transform duration-200" />}
                </button>
            </div>

            {/* NAVIGATION */}
            <nav className="flex-1 overflow-y-auto py-4 px-2">
                <div className="space-y-1">
                    {menuItems.map(item => (
                        <NavButton key={item.name} collapsed={collapsed} item={item} />
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default DashboardSidebar;