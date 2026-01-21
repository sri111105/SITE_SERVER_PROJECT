import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings, User } from 'lucide-react';
import PropertyManager from '../components/PropertyManager';
import SurveyExecution from '../components/SurveyExecution';

const Dashboard = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar - simplified for now */}
            <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-50">
                <div className="flex items-center justify-center h-16 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-primary">ISP Survey</h1>
                </div>
                <div className="flex-1 flex flex-col p-4 space-y-1">
                    <a href="#" className="flex items-center px-4 py-3 text-gray-700 bg-blue-50 rounded-lg group">
                        <LayoutDashboard className="h-5 w-5 mr-3 text-primary" />
                        <span className="font-medium text-primary">Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg group transition-colors">
                        <Settings className="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-600" />
                        <span className="font-medium group-hover:text-gray-900">Settings</span>
                    </a>
                </div>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center mb-4">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            {currentUser?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">{currentUser?.username}</p>
                            <p className="text-xs text-gray-500">{currentUser?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="md:ml-64 p-8">
                <header className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Welcome back, {currentUser?.username}!</h2>
                    <p className="text-gray-600">Here's an overview of your survey projects.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Stats Cards */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Surveys</h3>
                        <p className="text-3xl font-bold text-primary">12</p>
                        <p className="text-sm text-gray-500 mt-2">+2 from last week</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Uploads</h3>
                        <p className="text-3xl font-bold text-orange-500">4</p>
                        <p className="text-sm text-gray-500 mt-2">Requires attention</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Completed Sites</h3>
                        <p className="text-3xl font-bold text-green-500">85</p>
                        <p className="text-sm text-gray-500 mt-2">Total coverage</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <PropertyManager />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <SurveyExecution />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
