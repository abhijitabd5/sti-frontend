import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '@/services/api/profileApi';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import ProfileView from './ProfileView';
import ProfileForm from './ProfileForm';
import Toast from '@/components/ui/Internal/Toast/Toast';

const Profile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    type: 'info',
    message: '',
  });

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getProfile();
      if (response.success) {
        setProfile(response.data);
      } else {
        showToast('error', response.message || 'Failed to load profile');
      }
    } catch (error) {
      const errorMessage = error?.message || 'An error occurred while fetching profile';
      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSubmitProfile = async (formData) => {
    try {
      setIsSaving(true);
      const response = await updateProfile(formData);
      
      if (response.success) {
        setProfile(response.data);
        // Update the auth context with the new user data
        updateUser(response.data);
        setIsEditing(false);
        showToast('success', response.message || 'Profile updated successfully');
      } else {
        showToast('error', response.message || 'Failed to update profile');
      }
    } catch (error) {
      const errorMessage = error?.message || 'An error occurred while updating profile';
      showToast('error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (type, message) => {
    setToast({
      isVisible: true,
      type,
      message,
    });
  };

  const closeToast = () => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  // Loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      </AdminLayout>
    );
  }

  // Error state (no profile loaded)
  if (!profile) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">Failed to load profile</p>
          <button
            onClick={fetchProfile}
            className="btn bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            {isEditing ? 'Edit Profile' : 'My Profile'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isEditing
              ? 'Update your profile information'
              : 'View and manage your profile details'}
          </p>
        </div>
      </div>

      {/* Profile Content */}
      {isEditing ? (
        <ProfileForm
          profile={profile}
          onSubmit={handleSubmitProfile}
          onCancel={handleCancelEdit}
          isLoading={isSaving}
        />
      ) : (
        <ProfileView profile={profile} onEdit={handleEditProfile} />
      )}

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={closeToast}
        duration={4000}
        autoClose={true}
      />
    </AdminLayout>
  );
};

export default Profile;
