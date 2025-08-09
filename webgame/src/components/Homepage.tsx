import React, { useState } from 'react';

interface HomepageProps {
    onEnterGame?: () => void;
}

export function Homepage({ onEnterGame }: HomepageProps) {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username.trim() || !formData.password.trim()) return;

        // Simulate login/register
        await new Promise(resolve => setTimeout(resolve, 500));
        onEnterGame?.();
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden">
            {/* Background - using your reverie_bg.png naturally */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(/assets/reverie_bg.png)'
                }}
            />

            {/* Subtle darkening overlay to ensure text readability, matching the sky colors */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                {/* Hero Title */}
                <div className="text-center mb-12">
                    <h1
                        className="text-7xl md:text-9xl font-bold text-white mb-4 font-mario"
                        style={{
                            textShadow: '4px 4px 0px rgba(139, 92, 246, 0.7), 8px 8px 0px rgba(91, 33, 182, 0.5)',
                            transform: 'perspective(500px) rotateX(15deg)',
                        }}
                    >
                        REVERIE
                    </h1>
                    <p className="text-lg text-purple-100 font-medium tracking-wider font-mario">
                        WORLD
                    </p>
                </div>

                {/* Very Small Stein.world Style Auth Panel */}
                <div className="w-64 max-w-xs">
                    <div className="flex px-4">
                        <button
                            type="button"
                            onClick={() => setAuthMode('login')}
                            className={`flex-1 py-1 px-2 text-xs font-semibold font-condensed rounded-t-sm border transition-all duration-200 cursor-pointer  ${authMode === 'login'
                                ? 'bg-violet-600 border-violet-700 text-white shadow-sm'
                                : 'bg-purple-200/80 border-purple-300 text-purple-800 hover:bg-purple-300/80'
                                }`}
                        >
                            LOGIN
                        </button>
                        <button
                            type="button"
                            onClick={() => setAuthMode('register')}
                            className={`flex-1 py-1 px-2 text-xs font-semibold font-condensed rounded-t-sm border transition-all duration-200 cursor-pointer ${authMode === 'register'
                                ? 'bg-violet-600 border-violet-700 text-white shadow-sm'
                                : 'bg-purple-200/80 border-purple-300 text-purple-800 hover:bg-purple-300/80'
                                }`}
                        >
                            REGISTER
                        </button>
                    </div>

                    <div
                        className="border-2 rounded-md p-3 shadow-lg relative backdrop-blur-sm"
                        style={{
                            background: 'rgba(184, 169, 217, 0.15)',
                            borderColor: 'rgba(114, 90, 122, 0.5)',
                            boxShadow: '0 3px 15px rgba(114, 90, 122, 0.3)'
                        }}
                    >
                        {/* Subtle texture */}
                        <div
                            className="absolute inset-0 opacity-8 rounded-md"
                            style={{
                                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(114, 90, 122, 0.08) 2px, rgba(114, 90, 122, 0.08) 4px)'
                            }}
                        />

                        <div className="relative z-10">
                            {/* Login/Register buttons like stein.world */}

                            {/* Stein.world style form - labels and inputs side by side */}
                            <form onSubmit={handleSubmit} className="space-y-1.5">
                                {/* Username row */}
                                <div className="flex items-center space-x-2">
                                    <label className="text-xs font-medium text-white w-16 text-right font-condensed">
                                        User:
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="flex-1 px-1.5 py-1 text-xs font-condensed bg-purple-100/40 border border-purple-300/50 rounded-sm text-purple-100 focus:outline-none focus:ring-1 focus:ring-violet-400/50 placeholder-violet-500/70"
                                        required
                                    />
                                </div>

                                {/* Email row (register only) */}
                                {authMode === 'register' && (
                                    <div className="flex items-center space-x-2">
                                        <label className="text-xs font-medium text-white w-16 text-right font-condensed">
                                            Email:
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="flex-1 px-1.5 py-1 text-xs font-condensed bg-purple-100/40 border border-purple-300/50 rounded-sm text-purple-100 focus:outline-none focus:ring-1 focus:ring-violet-400/50 placeholder-violet-500/70"
                                            required
                                        />
                                    </div>
                                )}

                                {/* Password row */}
                                <div className="flex items-center space-x-2">
                                    <label className="text-xs font-medium text-white w-16 text-right font-condensed">
                                        Pass:
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="flex-1 px-1.5 py-1 text-xs font-condensed bg-purple-100/40 border border-purple-300/50 rounded-sm text-purple-100 focus:outline-none focus:ring-1 focus:ring-violet-400/50 placeholder-violet-500/70"
                                        required
                                    />
                                </div>

                                {/* Confirm Password row (register only) */}
                                {authMode === 'register' && (
                                    <div className="flex items-center space-x-2">
                                        <label className="text-xs font-medium text-white w-16 text-right font-condensed">
                                            Confirm:
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="flex-1 px-1.5 py-1 text-xs font-condensed bg-purple-100/40 border border-purple-300/50 rounded-sm text-purple-100 focus:outline-none focus:ring-1 focus:ring-violet-400/50 placeholder-violet-500/70"
                                            required
                                        />
                                    </div>
                                )}

                                {/* Buttons row */}
                                <div className="flex space-x-2 pt-2">
                                    <button
                                        type="submit"
                                        className="px-3 py-0.5 text-purple-100 text-xs font-medium font-condensed rounded-sm transition-all duration-200 border border-purple-700 shadow-sm hover:bg-purple-700 bg-purple-600 cursor-pointer"
                                    >
                                        {authMode === 'login' ? 'PLAY' : 'REGISTER'}
                                    </button>
                                    {authMode === 'login' && (
                                        <button
                                            type="button"
                                            className="px-2 py-0.5 text-xs font-condensed text-purple-200 hover:text-purple-500 transition-colors cursor-pointer"
                                        >
                                            Forgot?
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Very compact server info */}
                            <div className="mt-2 text-center pt-2 border-t border-purple-400/30">
                                <p className="text-purple-100 text-xs font-medium font-condensed">
                                    🌟 Dream Server
                                </p>
                                <p className="text-purple-200 text-xs opacity-75 font-condensed">
                                    247 online
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom tagline */}
                <div className="mt-4 text-center">
                    <p className="text-violet-200 text-xs opacity-75 font-condensed">
                        Enter a world where dreams become reality
                    </p>
                </div>
            </div>
        </div>
    );
}