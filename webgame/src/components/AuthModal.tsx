import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
    mode: 'login' | 'register';
    onClose: () => void;
    onSwitchMode: (mode: 'login' | 'register') => void;
    onSuccess?: () => void;
}

export function AuthModal({ mode, onClose, onSwitchMode, onSuccess }: AuthModalProps) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(''); // Clear error when user starts typing
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Validation
            if (!formData.username.trim() || !formData.password.trim()) {
                throw new Error('Username and password are required');
            }

            if (mode === 'register') {
                if (!formData.email.trim()) {
                    throw new Error('Email is required');
                }
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                if (formData.password.length < 6) {
                    throw new Error('Password must be at least 6 characters long');
                }
            }

            // TODO: Replace with actual API calls
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            
            // Success - close modal and handle auth
            console.log(`${mode} successful:`, formData);
            onSuccess?.();
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const isLogin = mode === 'login';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-gradient-to-br from-purple-900/95 via-violet-800/95 to-indigo-900/95 backdrop-blur-lg border border-purple-500/30 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="relative p-6 border-b border-purple-500/20">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-purple-600/30 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-purple-200" />
                    </button>
                    
                    <h2 
                        className="text-2xl font-bold text-white text-center"
                        style={{
                            fontFamily: 'MarioAndLuigi, monospace',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                        }}
                    >
                        {isLogin ? 'WELCOME BACK' : 'JOIN REVERIE'}
                    </h2>
                    <p className="text-purple-200 text-center mt-2 text-sm">
                        {isLogin ? 'Enter your world' : 'Create your magical journey'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-purple-800/30 border border-purple-600/40 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-colors"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    {/* Email (Register only) */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-purple-800/30 border border-purple-600/40 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-colors"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    )}

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-purple-800/30 border border-purple-600/40 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-colors"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Confirm Password (Register only) */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-purple-800/30 border border-purple-600/40 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-colors"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:from-purple-600/50 disabled:to-violet-600/50 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                {isLogin ? 'Logging in...' : 'Creating account...'}
                            </div>
                        ) : (
                            isLogin ? 'LOGIN' : 'CREATE ACCOUNT'
                        )}
                    </button>
                </form>

                {/* Switch Mode */}
                <div className="p-6 pt-0 text-center">
                    <p className="text-purple-200 text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            onClick={() => onSwitchMode(isLogin ? 'register' : 'login')}
                            className="ml-2 text-purple-300 hover:text-white font-semibold underline transition-colors"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}