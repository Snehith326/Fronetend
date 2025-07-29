import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { UserIcon, CameraIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

// Define a type for the stats for better type safety
interface ProfileStats {
  memberSince: string;
  totalTransactions: number;
  savingsGoalsCount: number;
}

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileStats = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/users/profile-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data && response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileStats();
  }, []);

  // Helper function to format the date
  const formatMemberSince = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  // TODO: Implement edit and upload functionality
  const handleEditProfile = () => {
      console.log("TODO: Implement Edit Profile Modal");
  }
  const handleUploadAvatar = () => {
      console.log("TODO: Implement Avatar Upload");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
      
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500"
            />
            <motion.button
              onClick={handleUploadAvatar}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-0 right-0 p-2 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors"
            >
              <CameraIcon className="w-4 h-4" />
            </motion.button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user?.email || 'email@example.com'}</p>
            <p className="text-emerald-600 font-medium mt-1">Premium Member</p>
          </div>
          
          <motion.button
            onClick={handleEditProfile}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            Edit Profile
          </motion.button>
        </div>
      </div>

      {/* Stats Grid - Now dynamically rendered */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Member Since</h3>
          {isLoading ? (
             <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold text-emerald-600">{formatMemberSince(stats?.memberSince)}</p>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Total Transactions</h3>
           {isLoading ? (
             <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold text-blue-600">{stats?.totalTransactions ?? 0}</p>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Savings Goals</h3>
          {isLoading ? (
             <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
          ) : (
             <p className="text-2xl font-bold text-purple-600">{stats?.savingsGoalsCount ?? 0}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}