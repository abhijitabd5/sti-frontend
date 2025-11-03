import React from 'react';

/**
 * Format role for display
 * @param {string} role - Raw role value from API
 * @returns {string} Formatted role name
 */
const formatRole = (role) => {
  if (!role) return 'N/A';
  
  const roleMap = {
    'super_admin': 'Super Admin',
    'admin': 'Admin',
    'account': 'Account',
    'student': 'Student',
    'instructor': 'Instructor'
  };
  
  return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
};

const ProfileView = ({ profile, onEdit }) => {
  if (!profile) {
    return (
      <div className="text-center text-gray-500">
        <p>No profile data available</p>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden">
        {/* Header with Profile Image and Info */}
        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700/60 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {profile.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-violet-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center border-4 border-violet-500">
                  <span className="text-white text-2xl font-bold">
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </span>
                </div>
              )}
            </div>
            
            {/* Name and Role */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {profile.first_name} {profile.last_name}
              </h2>
              <div className="flex flex-wrap gap-3 mt-2 items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</p>
                <div className="inline-block px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 rounded-full font-medium text-xs">
                  {formatRole(profile.role)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="px-6 py-6 space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                First Name
              </label>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                {profile.first_name || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Last Name
              </label>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                {profile.last_name || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-medium break-all">
                {profile.email || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                {profile.mobile || 'N/A'}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700/60">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Member Since
              </label>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {new Date(profile.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Last Updated
              </label>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {new Date(profile.updatedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Footer with Edit Button */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700/60 flex justify-end">
          <button
            onClick={onEdit}
            className="btn bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700 shadow-lg"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
