import { useState } from "react";

// Updated Player Status Bar Component
export const PlayerStatusBar = () => {
    const [playerName] = useState('player');
    const [level] = useState(2);
    const [health] = useState({ current: 61, max: 61 });
    const [mana] = useState({ current: 67, max: 100 });
    const [experience] = useState({ current: 18, max: 24 });

    const getBarWidth = (current: number, max: number) => {
        return Math.max(0, Math.min(100, (current / max) * 100));
    };

    return (
        <div className="fixed z-10 top-2 left-2">
            <div className="surface-primary border-outset p-0.5 w-36">
                {/* Player Name and Level Row */}
                <div className="flex gap-0.5 mb-0.5">
                    <div className="surface-raised border-inset flex-1 text-center px-1 py-0.5 retro-font">
                        {playerName}
                    </div>
                    <div className="surface-raised border-outset w-6 text-center px-0.5 py-0.5 retro-font">
                        {level}
                    </div>
                </div>

                {/* Health Bar */}
                <div className="status-bg border-inset h-4 mb-0.5 relative overflow-hidden">
                    <div
                        className="status-health h-full transition-all duration-300"
                        style={{ width: `${getBarWidth(health.current, health.max)}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-surface-light retro-font text-[10px] z-10"
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}>
                        {health.current}/{health.max}
                    </div>
                </div>

                {/* Mana Bar */}
                <div className="status-bg border-inset h-4 mb-0.5 relative overflow-hidden">
                    <div
                        className="status-mana h-full transition-all duration-300"
                        style={{ width: `${getBarWidth(mana.current, mana.max)}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-surface-light retro-font text-[10px] z-10"
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}>
                        {mana.current}/{mana.max}
                    </div>
                </div>

                {/* Experience Bar */}
                <div className="status-bg border-inset h-4 mb-0.5 relative overflow-hidden">
                    <div
                        className="status-experience h-full transition-all duration-300"
                        style={{ width: `${getBarWidth(experience.current, experience.max)}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-surface-light retro-font text-[10px] z-10"
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}>
                        {experience.current}/{experience.max}
                    </div>
                </div>

                {/* Expand Button */}
                <div className="flex justify-center">
                    <button className="surface-raised border-outset w-4 h-4 mt-0.5 flex items-center justify-center retro-font hover:surface-hover active:surface-active text-[8px]">
                        ↗
                    </button>
                </div>
            </div>
        </div>
    );
};

