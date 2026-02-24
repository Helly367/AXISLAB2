import React, { useState } from 'react';
import Profile from '../Profile';
import StructureProjet from '../Structure';
import Equipe from '../Equipe';
import BudgetManager from '../BudgetManager';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axis from "../../../../../resources/axis.png"

import {
    School,
    Person,
    MenuBook,
    VideoCall,
    CalendarToday,
    Payment,
    LocalLibrary,
    Assessment,
    Person2Rounded,
    Schema,
    Groups
} from '@mui/icons-material';


const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();


    const menuItems = [
        { name: 'Profile', icon: <Person2Rounded />, link: "/profile" },
        { name: 'Structure', icon: <Schema />, link: "/structure" },
        { name: 'Equipe', icon: <Groups />, link: "/equipe" },
        { name: 'Budjet', icon: <MenuBook />, link: "/budjet" },
        { name: 'Live Class', icon: <VideoCall /> },
        { name: 'Attendance', icon: <CalendarToday /> },
        { name: 'Payments', icon: <Payment /> },
        { name: 'Library', icon: <LocalLibrary /> },
        { name: 'Reports', icon: <Assessment /> }
    ];

    const handleLink = (link) => {
        navigate(link)
    }




    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}

            <div className="w-40 bg-white shadow-lg flex  flex-col items-center justify-between py-6">
                <div className="p-2">
                    <img src={axis} alt="axis" className='w-20' />
                </div>
                <nav className="mt-2 w-full">

                    {menuItems.map((item) => {
                        const isActive = location.pathname.includes(item.link);
                        const bg = isActive ? "bg-blue-50 text-blue border-r-4 border-blue" : "text-gray-600 hover:bg-gray-50";

                        return (
                            <button
                                key={item.name}
                                onClick={() => handleLink(item.link)}
                                className={`w-full flex flex-col items-center justify-center px-6 py-3  transition ${bg}`}
                            >
                                <span className="">{item.icon}</span>
                                <span className='text-[16px] font-bold'>{item.name}</span>
                            </button>

                        )
                    })}

                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <Routes>
                    <Route path='/*' element={<Profile />} />
                    <Route path='/profile/*' element={<Profile />} />
                    <Route path='/structure/*' element={<StructureProjet />} />
                    <Route path='/equipe/*' element={<Equipe />} />
                    <Route path='/budjet/*' element={<BudgetManager />} />

                </Routes>

            </div>
        </div>
    );
};

export default Dashboard;