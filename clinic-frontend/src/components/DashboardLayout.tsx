import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
    title: string;
}

const roleStyles = {
    Admin: 'bg-purple-600',
    Doctor: 'bg-green-600',
    Patient: 'bg-blue-600',
};

export default function DashboardLayout({ children, title }: LayoutProps) {
    const { user, logout } = useAuth();
    const location = useLocation(); // To highlight the active tab

    // Define which links show up for which role
    const navLinks = {
        Doctor: [
            { name: 'Dashboard', path: '/doctor' },
            { name: 'Profile Settings', path: '/doctor/profile' },
        ],
        Patient: [
            { name: 'My Appointments', path: '/patient' },
            // Add more patient links here if needed
        ],
        Admin: [
            { name: 'Overview', path: '/admin' },
            // Add more admin links here
        ]
    };

    const currentLinks = navLinks[user?.role as keyof typeof navLinks] || [];
    const themeColor = roleStyles[user?.role as keyof typeof roleStyles] || 'bg-gray-800';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 1. Top Navbar */}
            <nav className={`${themeColor} text-white px-6 py-4 shadow-md`}>
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-bold tracking-tight border-r border-white/20 pr-6 hidden md:block">
                            ClinicPortal
                        </h1>
                        <h2 className="text-lg font-medium opacity-90">{title}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold leading-none">{user?.fullName}</p>
                            <p className="text-[10px] uppercase tracking-wider opacity-70 mt-1">{user?.role}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg transition text-sm font-medium border border-white/10"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* 2. Sub-Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 flex gap-8">
                    {currentLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`py-4 text-sm font-semibold transition-colors border-b-2 ${
                                location.pathname === link.path
                                    ? `border-${user?.role === 'Doctor' ? 'green' : user?.role === 'Admin' ? 'purple' : 'blue'}-600 text-gray-900`
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* 3. Page Content */}
            <main className="max-w-6xl mx-auto p-4 md:p-8 animate-fadeIn">
                {children}
            </main>
        </div>
    );
}