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
        <>
            <style>{`
                .twilight-primary { color: #4e4e8f; }
                .twilight-medium { color: #595998; }
                .twilight-mauve { color: #846b98; }
                .twilight-dusty { color: #806a92; }
                
                .twilight-glass {
                    background: linear-gradient(135deg, 
                        rgba(78, 78, 143, 0.25) 0%, 
                        rgba(89, 89, 152, 0.15) 30%,
                        rgba(132, 107, 152, 0.12) 70%,
                        rgba(128, 106, 146, 0.1) 100%);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(89, 89, 152, 0.3);
                    box-shadow: 
                        0 8px 32px rgba(78, 78, 143, 0.4),
                        inset 0 1px 0 rgba(132, 107, 152, 0.2);
                }
                
                .twilight-input {
                    background: rgba(78, 78, 143, 0.3);
                    border: 1px solid rgba(89, 89, 152, 0.4);
                    backdrop-filter: blur(8px);
                    color: #e8e4f0;
                    transition: all 0.2s ease;
                }
                .twilight-input:focus {
                    border-color: rgba(132, 107, 152, 0.6);
                    box-shadow: 0 0 0 2px rgba(89, 89, 152, 0.2);
                    outline: none;
                }
                .twilight-input::placeholder {
                    color: rgba(232, 228, 240, 0.5);
                }
                
                .twilight-tab {
                    background: rgba(78, 78, 143, 0.4);
                    border: 1px solid rgba(89, 89, 152, 0.4);
                    backdrop-filter: blur(12px);
                    transition: all 0.3s ease;
                }
                .twilight-tab-active {
                    background: rgba(78, 78, 143, 0.8);
                    border-color: rgba(89, 89, 152, 0.6);
                    box-shadow: 0 -2px 8px rgba(78, 78, 143, 0.3);
                }
                .twilight-tab:hover:not(.twilight-tab-active) {
                    background: rgba(89, 89, 152, 0.6);
                }
                
                .twilight-button {
                    background: linear-gradient(135deg, 
                        rgba(78, 78, 143, 0.8) 0%, 
                        rgba(89, 89, 152, 0.6) 50%,
                        rgba(132, 107, 152, 0.5) 100%);
                    border: 1px solid rgba(89, 89, 152, 0.5);
                    backdrop-filter: blur(8px);
                    box-shadow: 0 4px 12px rgba(78, 78, 143, 0.3);
                    transition: all 0.2s ease;
                }
                .twilight-button:hover {
                    background: linear-gradient(135deg, 
                        rgba(89, 89, 152, 0.9) 0%, 
                        rgba(132, 107, 152, 0.7) 50%,
                        rgba(128, 106, 146, 0.6) 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(78, 78, 143, 0.4);
                }
                
                .twilight-server-info {
                    background: rgba(78, 78, 143, 0.3);
                    border: 1px solid rgba(89, 89, 152, 0.2);
                    backdrop-filter: blur(8px);
                }
                
                .twilight-glow {
                    background: radial-gradient(circle at 50% 0%, 
                        rgba(132, 107, 152, 0.15) 0%, 
                        rgba(128, 106, 146, 0.1) 30%,
                        transparent 50%);
                }
                
                .twilight-border {
                    border-color: rgba(89, 89, 152, 0.3);
                }
            `}</style>

            <div className="min-h-screen w-full relative overflow-hidden">
                {/* Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(/assets/reverie_bg.png)'
                    }}
                />

                {/* Enhanced darkening overlay for better glassmorphism contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                    {/* Hero Title */}
                    <div className="text-center mb-16">
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

                    {/* Compact Twilight Glassmorphism Auth Panel */}
                    <div className="w-72 max-w-sm">
                        {/* Compact tab buttons */}
                        <div className="flex mb-1 px-1">
                            <button
                                type="button"
                                onClick={() => setAuthMode('login')}
                                className={`flex-1 py-1.5 px-3 text-xs font-semibold font-condensed rounded-t-lg cursor-pointer twilight-tab ${authMode === 'login' ? 'twilight-tab-active text-white' : 'text-purple-200'
                                    }`}
                            >
                                LOGIN
                            </button>
                            <button
                                type="button"
                                onClick={() => setAuthMode('register')}
                                className={`flex-1 py-1.5 px-3 text-xs font-semibold font-condensed rounded-t-lg cursor-pointer twilight-tab ${authMode === 'register' ? 'twilight-tab-active text-white' : 'text-purple-200'
                                    }`}
                            >
                                REGISTER
                            </button>
                        </div>

                        {/* Main glassmorphism panel */}
                        <div className="rounded-xl p-4 shadow-2xl relative twilight-glass">
                            {/* Subtle inner glow */}
                            <div className="absolute inset-0 rounded-xl opacity-60 twilight-glow" />

                            <div className="relative z-10">
                                {/* Compact form */}
                                <form onSubmit={handleSubmit} className="space-y-2.5">
                                    {/* Username field */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium font-condensed" style={{ color: '#e8e4f0' }}>
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full px-2.5 py-1.5 text-xs font-condensed rounded-md twilight-input"
                                            required
                                        />
                                    </div>

                                    {/* Email field (register only) */}
                                    {authMode === 'register' && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium font-condensed" style={{ color: '#e8e4f0' }}>
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-2.5 py-1.5 text-xs font-condensed rounded-md twilight-input"
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Password field */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium font-condensed" style={{ color: '#e8e4f0' }}>
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full px-2.5 py-1.5 text-xs font-condensed rounded-md twilight-input"
                                            required
                                        />
                                    </div>

                                    {/* Confirm Password field (register only) */}
                                    {authMode === 'register' && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium font-condensed" style={{ color: '#e8e4f0' }}>
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-2.5 py-1.5 text-xs font-condensed rounded-md twilight-input"
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Compact buttons */}
                                    <div className="flex space-x-2 pt-3">
                                        <button
                                            type="submit"
                                            className="flex-1 py-2 text-xs font-semibold font-condensed rounded-md cursor-pointer twilight-button"
                                            style={{ color: '#e8e4f0' }}
                                        >
                                            {authMode === 'login' ? 'ENTER REVERIE' : 'CREATE ACCOUNT'}
                                        </button>
                                    </div>

                                    {/* Forgot password link */}
                                    {authMode === 'login' && (
                                        <div className="text-center pt-1">
                                            <button
                                                type="button"
                                                className="text-xs font-condensed transition-colors duration-200"
                                                style={{
                                                    color: '#d1c4e9',
                                                }}
                                                onMouseEnter={(e: any) => e.target.style.color = '#e8e4f0'}
                                                onMouseLeave={(e: any) => e.target.style.color = '#d1c4e9'}
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                    )}
                                </form>

                                {/* Compact server info */}
                                <div className="mt-4 text-center pt-3 border-t twilight-border">
                                    <div className="inline-block px-3 py-1.5 rounded-lg twilight-server-info">
                                        <p className="text-xs font-medium font-condensed" style={{ color: '#e8e4f0' }}>
                                            🌟 Dream Server
                                        </p>
                                        <p className="text-xs opacity-80 font-condensed" style={{ color: '#d1c4e9' }}>
                                            247 dreamers online
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom tagline */}
                    <div className="mt-6 text-center">
                        <p className="text-violet-200 text-sm opacity-75 font-condensed">
                            Enter a world where dreams become reality
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}