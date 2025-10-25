import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { getUserProfile } from "../backend/authApi";
import CreateClass from "./Class";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const data = await getUserProfile();
      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "teacher":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "admin":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar profile={profile} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Welcome Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700 mb-2">
            Welcome back, {profile?.user.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-600 text-lg">Here's your profile overview</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden border border-slate-200/60">
              {/* Header with Gradient */}
              <div className={`h-32 bg-linear-to-r ${getRoleColor(profile?.user.role)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-grid-white/10"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              {/* Profile Content */}
              <div className="px-8 py-6 -mt-16 relative">
                {/* Avatar */}
                <div className="w-28 h-28 rounded-2xl bg-linear-to-br from-white to-slate-50 shadow-2xl flex items-center justify-center mb-6 border-4 border-white">
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-br from-indigo-600 to-purple-600">
                    {profile?.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* User Info */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-1">
                      {profile?.user.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(profile?.user.role)}`}>
                        {profile?.user.role?.charAt(0).toUpperCase() + profile?.user.role?.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">{profile?.user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Role-Specific Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 border border-slate-200/60 h-full">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className={`w-2 h-8 rounded-full bg-linear-to-b ${getRoleColor(profile?.user.role)}`}></div>
                Role Details
              </h3>

              <div className="space-y-4">
                {profile?.user.role === "student" && profile?.roleData && (
                  <>
                    <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                        Registration Number
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        {profile.roleData.regno}
                      </p>
                    </div>
                    <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                      <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                        Class
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        {profile.roleData.classId?.classname || "Not Assigned"}
                      </p>
                    </div>
                  </>
                )}

                {profile?.user.role === "teacher" && profile?.roleData && (
                  <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
                      Department
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {profile.roleData.department}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white rounded-2xl shadow-lg shadow-blue-100/50 p-6 border border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Account Status</p>
                <p className="text-2xl font-bold text-slate-900">Active</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-100/50 p-6 border border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Profile Complete</p>
                <p className="text-2xl font-bold text-slate-900">100%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-purple-100/50 p-6 border border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Last Login</p>
                <p className="text-2xl font-bold text-slate-900">Today</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        <CreateClass/>
      </main>
    </div>
  );
}