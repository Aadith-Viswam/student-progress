// src/components/Navbar.jsx
import { useState } from "react";
import { Menu, LogOut, Home, X, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser } from "../backend/authApi";

export default function Navbar({ profile }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const getRoleColor = (role) => {
        switch (role) {
            case "student":
                return "from-blue-500 to-cyan-500";
            case "teacher":
                return "from-purple-500 to-pink-500";
            case "admin":
                return "from-orange-500 to-red-500";
            default:
                return "from-gray-500 to-slate-500";
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "student":
                return "bg-blue-100 text-blue-700";
            case "teacher":
                return "bg-purple-100 text-purple-700";
            case "admin":
                return "bg-orange-100 text-orange-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-xl shadow-lg shadow-indigo-100/50 sticky top-0 z-50 border-b border-slate-200/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo with Gradient */}
                    <Link to="/dashboard" className="shrink-0 flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative bg-linear-to-r from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg">
                                <Home className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700">
                                EduPortal
                            </span>
                            <span className="text-xs font-medium text-slate-500">Excellence in Education</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Navigation Links */}
                        <Link
                            to="/dashboard"
                            className="relative px-4 py-2 text-slate-700 hover:text-indigo-600 font-medium transition-colors group"
                        >
                            Dashboard
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-indigo-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center space-x-3 px-4 py-2 rounded-2xl hover:bg-slate-50 transition-all duration-300 group"
                            >
                                <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${getRoleColor(profile?.user.role)} flex items-center justify-center shadow-lg`}>
                                    <span className="text-white font-bold text-sm">
                                        {profile?.user.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-sm font-semibold text-slate-800">
                                        {profile?.user.name?.split(' ')[0]}
                                    </span>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRoleBadgeColor(profile?.user.role)}`}>
                                        {profile?.user.role?.charAt(0).toUpperCase() + profile?.user.role?.slice(1)}
                                    </span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden"
                                    >
                                        {/* Profile Header */}
                                        <div className={`bg-linear-to-r ${getRoleColor(profile?.user.role)} p-6 relative overflow-hidden`}>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                            <div className="relative">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                                                        <span className="text-white font-bold text-lg">
                                                            {profile?.user.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-bold text-lg">{profile?.user.name}</h3>
                                                        <p className="text-white/90 text-sm">{profile?.user.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-2">
                                            <Link
                                                to="/profile"
                                                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group"
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                <User className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                                                <span className="text-slate-700 font-medium group-hover:text-slate-900">View Profile</span>
                                            </Link>
                                            <button
                                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group"
                                                onClick={() => {
                                                    setProfileOpen(false)
                                                    logoutUser()
                                                }

                                                }
                                            >
                                                <LogOut className="w-5 h-5 text-slate-600 group-hover:text-red-600 transition-colors" />
                                                <span className="text-slate-700 font-medium group-hover:text-red-600">Logout</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            {mobileOpen ? (
                                <X className="w-6 h-6 text-slate-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-slate-700" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white border-t border-slate-200/60 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {/* Mobile Profile Card */}
                            <div className={`bg-linear-to-r ${getRoleColor(profile?.user.role)} rounded-2xl p-4 relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                                <div className="relative flex items-center space-x-3">
                                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                                        <span className="text-white font-bold text-xl">
                                            {profile?.user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{profile?.user.name}</h3>
                                        <p className="text-white/90 text-sm">{profile?.user.email}</p>
                                        <span className="inline-block mt-1 text-xs font-semibold text-white bg-white/20 px-2 py-1 rounded-full">
                                            {profile?.user.role?.charAt(0).toUpperCase() + profile?.user.role?.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Navigation Links */}
                            <div className="space-y-2">
                                <Link
                                    to="/dashboard"
                                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <Home className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                                    <span className="text-slate-700 font-medium group-hover:text-slate-900">Dashboard</span>
                                </Link>
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <User className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                                    <span className="text-slate-700 font-medium group-hover:text-slate-900">Profile</span>
                                </Link>
                                <button
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <LogOut className="w-5 h-5 text-slate-600 group-hover:text-red-600 transition-colors" />
                                    <span className="text-slate-700 font-medium group-hover:text-red-600">Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}