// src/pages/customer-account-order-history/components/ProfileSection.jsx
import React, { useState } from 'react';
import Icon from '../AppIcon';
import { useRouter } from 'next/navigation';
import axios from 'axios';
function DeleteAccountModal({ isOpen, onClose, onConfirm }) {
    
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) {
        return null;
    }

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error("Failed to delete account:", error);
            setIsLoading(false); 
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-md p-8 m-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                        <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">Delete Account</h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.</p>
                    </div>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleConfirm}
                        className="w-full inline-flex justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Deleting...' : 'Delete Account'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full inline-flex justify-center rounded-lg bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

function ProfileSection({ userProfile, setUserProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(userProfile);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
      const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const router=useRouter();
  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: 'Leaf' },
    { id: 'vegan', label: 'Vegan', icon: 'Sprout' },
    { id: 'gluten-free', label: 'Gluten-Free', icon: 'Wheat' },
    { id: 'keto', label: 'Keto', icon: 'Zap' },
    { id: 'low-sodium', label: 'Low Sodium', icon: 'Heart' },
    { id: 'diabetic', label: 'Diabetic Friendly', icon: 'Activity' }
  ];
const handleAccountDelete = async () => {
      try{
        const response =await axios.delete('/api/users/delete-account');
        if(response.status==200){
            setDeleteModalOpen(false);
            router.push('/customer-login-register');
        }else{
            console.error("Failed to delete account");
        }
      }catch(error){
        console.error("Failed to delete account:", error);
      }
    };


  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm(userProfile);
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name?.startsWith('notifications.')) {
      const notificationType = name?.split('.')[1];
      setEditForm(prev => ({
        ...prev,
        notifications: {
          ...prev?.notifications,
          [notificationType]: checked
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDietaryChange = (dietaryId) => {
    setEditForm(prev => {
      const current = prev?.dietaryPreferences || [];
      const updated = current?.includes(dietaryId)
        ? current?.filter(d => d !== dietaryId)
        : [...current, dietaryId];
      
      return {
        ...prev,
        dietaryPreferences: updated
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editForm?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!editForm?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!editForm?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editForm?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (editForm?.phone && !/^[+]?[1-9]?\d{10,14}$/.test(editForm?.phone?.replace(/[^\d]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAccountAction = (action) => {
    console.log(`${action} clicked`);
    // In real app, these would trigger appropriate modals/flows
    if(action === 'change-password'){
      router.push('/change-password');
      
    }if(action === 'delete-account'){
      router.push('/delete-account');
    }

  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-heading-medium text-text-primary">
            Personal Information
          </h2>
          <button
            onClick={handleEditToggle}
            className="flex items-center space-x-2 px-4 py-2 text-primary hover:bg-primary-50 rounded-lg transition-smooth font-body font-body-medium"
          >
            <Icon name={isEditing ? "X" : "Edit"} size={18} />
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={editForm?.firstName || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                    errors?.firstName ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors?.firstName && (
                  <p className="text-error text-sm font-body mt-1">{errors?.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={editForm?.lastName || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                    errors?.lastName ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors?.lastName && (
                  <p className="text-error text-sm font-body mt-1">{errors?.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={editForm?.email || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                  errors?.email ? 'border-error' : 'border-border'
                }`}
                placeholder="Enter your email"
              />
              {errors?.email && (
                <p className="text-error text-sm font-body mt-1">{errors?.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={editForm?.phone || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth font-body ${
                  errors?.phone ? 'border-error' : 'border-border'
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors?.phone && (
                <p className="text-error text-sm font-body mt-1">{errors?.phone}</p>
              )}
            </div>

            

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-smooth font-body font-body-medium"
              >
                {isSaving && <Icon name="Loader2" size={18} className="animate-spin" />}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                onClick={handleEditToggle}
                className="px-6 py-3 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-smooth font-body font-body-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body text-text-secondary mb-1">
                  Name
                </label>
                <p className="font-body text-text-primary">
                  {userProfile?.firstName} {userProfile?.lastName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-body text-text-secondary mb-1">
                  Email
                </label>
                <p className="font-body text-text-primary">{userProfile?.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body text-text-secondary mb-1">
                  Phone
                </label>
                <p className="font-body text-text-primary">
                  {userProfile?.phone || 'Not provided'}
                </p>
              </div>
        
            </div>
          </div>
        )}
      </div>

      {/* Dietary Preferences */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
          Dietary Preferences
        </h3>
        
        {isEditing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {dietaryOptions?.map((option) => (
              <label
                key={option?.id}
                className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary-50 transition-smooth"
              >
                <input
                  type="checkbox"
                  checked={editForm?.dietaryPreferences?.includes(option?.id) || false}
                  onChange={() => handleDietaryChange(option?.id)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
                <Icon name={option?.icon} size={18} className="text-text-secondary" />
                <span className="text-sm font-body text-text-primary">{option?.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {userProfile?.dietaryPreferences?.length > 0 ? (
              userProfile?.dietaryPreferences?.map((preference) => {
                const option = dietaryOptions?.find(opt => opt?.id === preference);
                return option ? (
                  <span
                    key={preference}
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-success-100 text-success-700 rounded-full text-sm font-body"
                  >
                    <Icon name={option?.icon} size={16} />
                    <span>{option?.label}</span>
                  </span>
                ) : null;
              })
            ) : (
              <p className="text-text-secondary font-body">No dietary preferences set</p>
            )}
          </div>
        )}
      </div>

      

      {/* Account Management */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
          Account Management
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={() => handleAccountAction('change-password')}
            className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary-50 transition-smooth text-left"
          >
            <div className="flex items-center space-x-3">
              <Icon name="Lock" size={20} className="text-text-secondary" />
              <span className="font-body text-text-primary">Change Password</span>
            </div>
            <Icon name="ChevronRight" size={20} className="text-text-secondary" />
          </button>
          
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="w-full flex items-center justify-between p-3 border border-error rounded-lg hover:bg-error-50 transition-smooth text-left"
          >
            <div className="flex items-center space-x-3">
              <Icon name="Trash2" size={20} className="text-error" />
              <span className="font-body text-error">Delete Account</span>
            </div>
            <Icon name="ChevronRight" size={20} className="text-error" />
          </button>
        </div>
      </div>
       <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleAccountDelete}
            />
    </div>
  );
}

export default ProfileSection;