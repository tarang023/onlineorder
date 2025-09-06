"use client";
import { useState } from 'react';
import axios from 'axios';
// A simple eye icon component to be used for toggling password visibility
const EyeIcon = () => (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.02 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);

 
const EyeOffIcon = () => (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zM10 12a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" />
        <path d="M2 4.272l2.272 2.272A9.956 9.956 0 0010 9a2 2 0 012 2 9.956 9.956 0 004.458 2.458l2.272 2.272a1 1 0 01-1.414 1.414L2 5.686A1 1 0 012 4.272z" />
    </svg>
);


export default function ChangePasswordPage() {
    
    // State for form fields
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // State for password visibility
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State for messages (e.g., errors, success)
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage({ type: '', text: '' }); // Reset message

        // Basic validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage({ type: 'error', text: 'Please fill in all fields.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
            return;
        }

      
        console.log({ oldPassword, newPassword });
        const response=axios.post('/api/users/change-password', { oldPassword, newPassword });
        if(response.status==200){

            setMessage({ type: 'success', text: 'Password updated successfully!' });
        }else{
            setMessage({ type: 'error', text:  'please enter a valid old password.' });
        }

        // Clear the form
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <>
            <main 
                className="bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-screen"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                 <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <div className="w-full max-w-md mx-auto p-4">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Change Password</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Update your password for better security.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Old Password */}
                            <div>
                                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Old Password</label>
                                <div className="mt-1 relative">
                                    <input
                                        id="oldPassword"
                                        type={showOldPassword ? 'text' : 'password'}
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    <button type="button" className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 dark:text-gray-500" onClick={() => setShowOldPassword(!showOldPassword)}>
                                        {showOldPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                                <div className="mt-1 relative">
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    <button type="button" className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 dark:text-gray-500" onClick={() => setShowNewPassword(!showNewPassword)}>
                                        {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                                <div className="mt-1 relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    <button type="button" className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 dark:text-gray-500" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300">
                                    Update Password
                                </button>
                            </div>
                        </form>

                        {/* Message area */}
                        {message.text && (
                            <div className={`mt-4 text-center text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {message.text}
                            </div>
                        )}
                        
                        {/* Back to Account Link */}
                        <div className="text-center mt-6">
                            <button onClick={() => window.history.back()} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                &larr; Back to Account
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

