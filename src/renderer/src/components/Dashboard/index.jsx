// components/Dashboard.js
import React, { useState } from 'react';
import {
    Home,
    School,
    Person,
    MenuBook,
    VideoCall,
    CalendarToday,
    Payment,
    LocalLibrary,
    Assessment,
    Star,
    TrendingUp,
    EmojiEvents
} from '@mui/icons-material';

const Dashboard = () => {
    const [activeMenu, setActiveMenu] = useState('Home');

    const menuItems = [
        { name: 'Home', icon: <Home /> },
        { name: 'Students', icon: <School /> },
        { name: 'Teachers', icon: <Person /> },
        { name: 'Courses', icon: <MenuBook /> },
        { name: 'Live Class', icon: <VideoCall /> },
        { name: 'Attendance', icon: <CalendarToday /> },
        { name: 'Payments', icon: <Payment /> },
        { name: 'Library', icon: <LocalLibrary /> },
        { name: 'Reports', icon: <Assessment /> }
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-600">SkillSet</h1>
                </div>
                <nav className="mt-6">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveMenu(item.name)}
                            className={`w-full flex items-center px-6 py-3 text-left transition ${activeMenu === item.name
                                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Popular Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Popular</h2>
                            <Star className="text-yellow-400" />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <p className="text-gray-600">The book is an essential...</p>
                            <p className="text-gray-500 text-sm mt-2">This is just a general example...</p>
                        </div>
                    </div>

                    {/* Ongoing Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Ongoing</h2>
                            <TrendingUp className="text-green-500" />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <p className="text-gray-600">The book is an essential...</p>
                            <p className="text-gray-500 text-sm mt-2">This is just a general example...</p>
                        </div>
                    </div>

                    {/* Unlocks Achievement */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Unlocks achievement</h2>
                            <EmojiEvents className="text-yellow-500" />
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg shadow-sm text-white">
                            <p className="font-medium">Get achieved success unlocked.</p>
                        </div>
                    </div>

                    {/* Best Sales and Upgrade Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Best Sales */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Best sales</h3>
                            <div className="space-y-3">
                                {[
                                    { name: 'Grow green', rating: 4.5 },
                                    { name: 'Raise a plant', rating: 4.0 },
                                    { name: 'One question...', rating: 4.5 },
                                    { name: 'Unplug day', rating: 4.0 },
                                    { name: 'Best year', rating: 3.5 }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-gray-700">{item.name}</span>
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-500 mr-2">Order: {item.rating}</span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`text-sm ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'
                                                        }`}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upgrade to Pro */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg shadow-sm text-white">
                            <h3 className="text-lg font-semibold mb-2">Upgrade to Pro for more facilities</h3>
                            <button className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
                                Upgrade →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;