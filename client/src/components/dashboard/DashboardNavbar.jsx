import React from 'react';
import { Link } from 'react-router-dom';

const DashboardNavbar = () => {
    return (
        <nav className="bg-green-600 text-white p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-xl font-bold">VivaFit Dashboard</div>
                <div className="space-x-4">
                    <Link to="/profile" className="hover:underline">
                        Profile
                    </Link>
                    <Link to="/exercises" className="hover:underline">
                        Exercises
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;