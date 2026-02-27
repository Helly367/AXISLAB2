import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Assignment,
    CheckCircle,
    RadioButtonUnchecked,
    PlayArrow,
    Pause,
    Person
} from "@mui/icons-material";

const TachesCalendar = ({ tasks, onTaskClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month'); // 'month', 'week', 'day'

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const getTasksForDate = (dateStr) => {
        return tasks.filter(t => t.date_echeance === dateStr);
    };

    const getStatusIcon = (statut) => {
        switch (statut) {
            case 'a_faire':
                return <RadioButtonUnchecked className="text-gray-400" fontSize="small" />;
            case 'en_cours':
                return <PlayArrow className="text-blue-500" fontSize="small" />;
            case 'en_attente':
                return <Pause className="text-yellow-500" fontSize="small" />;
            case 'termine':
                return <CheckCircle className="text-green-500" fontSize="small" />;
            default:
                return null;
        }
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    // Calculer les jours du mois
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Jours vides avant le premier jour
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    // Jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        days.push(date);
    }

    return (
        <div className='bg-gray-200 p-4'>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* En-tête du calendrier */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Calendrier des tâches</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigateMonth(-1)}
                            className="p-2 hover:bg-gray-100 rounded-full">
                            <ChevronLeft />
                        </button>
                        <span className="text-lg font-medium">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button
                            onClick={() => navigateMonth(1)}
                            className="p-2 hover:bg-gray-100 rounded-full">
                            <ChevronRight />
                        </button>
                    </div>
                </div>

                {/* Jours de la semaine */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grille du calendrier */}
                <div className="grid grid-cols-7 gap-2">
                    {days.map((date, index) => {
                        if (!date) {
                            return <div key={index} className="h-32 bg-gray-50 rounded-lg"></div>;
                        }

                        const dateStr = formatDate(date);
                        const dayTasks = getTasksForDate(dateStr);
                        const isToday = dateStr === formatDate(new Date());
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                        return (
                            <div
                                key={index}
                                className={`h-32 p-2 rounded-lg overflow-y-auto ${isToday ? 'bg-blue-50 border-2 border-blue-500' :
                                    isWeekend ? 'bg-gray-50' : 'bg-white'
                                    } hover:shadow-md transition-shadow`}>
                                <div className="text-right text-sm font-medium mb-1">
                                    {date.getDate()}
                                </div>
                                <div className="space-y-1">
                                    {dayTasks.map(task => (
                                        <div
                                            key={task.id}
                                            onClick={() => onTaskClick(task)}
                                            className={`text-xs p-1 rounded cursor-pointer hover:shadow-sm ${task.statut === 'termine' ? 'bg-green-100' :
                                                task.statut === 'en_cours' ? 'bg-blue-100' :
                                                    task.statut === 'en_attente' ? 'bg-yellow-100' :
                                                        'bg-gray-100'
                                                }`}>
                                            <div className="flex items-center gap-1">
                                                {getStatusIcon(task.statut)}
                                                <span className="truncate flex-1">{task.titre}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-500 mt-1">
                                                <Person fontSize="small" />
                                                <span className="truncate">{task.assignee}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Légende */}
                <div className="mt-6 pt-4 border-t flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-100 rounded"></div>
                        <span className="text-sm">Aujourd'hui</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioButtonUnchecked className="text-gray-400" fontSize="small" />
                        <span className="text-sm">À faire</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PlayArrow className="text-blue-500" fontSize="small" />
                        <span className="text-sm">En cours</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Pause className="text-yellow-500" fontSize="small" />
                        <span className="text-sm">En attente</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-500" fontSize="small" />
                        <span className="text-sm">Terminé</span>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default TachesCalendar;