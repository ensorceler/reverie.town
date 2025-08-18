import { useState, useRef, useEffect } from "react";
import bagIcon from "@/../public/assets/images/bag.png";

export const BottomActionBar = () => {
    const [selectedAction, setSelectedAction] = useState(0);

    const actions = [
        { icon: bagIcon, label: 'Inventory', key: 'I' },
        { icon: '📜', label: 'Quests', key: 'Q' },
        { icon: '🗺️', label: 'Map', key: 'M' },
        { icon: '👥', label: 'Party', key: 'P' },
        { icon: '⚔️', label: 'Skills', key: 'K' },
        { icon: '➕', label: 'More', key: '+' },
    ];

    return (
        <div className="fixed bottom-4 right-4">
            <div className="surface-primary border-outset p-1 flex gap-1">
                {actions.map((action, index) => (
                    <button
                        key={action.label}
                        onClick={() => setSelectedAction(index)}
                        className={`
              w-12 h-12 flex flex-col items-center justify-center retro-font text-[8px] transition-all duration-200
              ${selectedAction === index
                                ? 'surface-inset border-inset'
                                : 'surface-raised border-outset hover:surface-hover active:surface-active'
                            }
            `}
                        title={`${action.label} (${action.key})`}
                    >
                        <img
                            src={action.icon}
                        />
                        <div className="text-surface-light leading-none">{action.key}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};