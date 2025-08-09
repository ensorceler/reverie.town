import React from 'react';

export interface StatusBarProps {
  health: number;
  maxHealth?: number;
  mana: number;
  maxMana?: number;
  experience: number;
  maxExperience?: number;
  gold?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  health,
  maxHealth = 1000,
  mana,
  maxMana = 500,
  experience,
  maxExperience = 10000,
  gold = 0
}) => {
  return (
    <div className="absolute top-2 left-2 w-96 max-w-md max-h-[320px] bg-black/20 z-50 backdrop-blur-sm rounded-lg p-4 border border-white/10 ">
      {/* Health Bar */}
      <ResourceBar
        current={health}
        max={maxHealth}
        color="red"
        icon="❤️"
        label="Health"
        iconBg="#dc2626"
      />

      {/* Mana Bar */}
      <ResourceBar
        current={mana}
        max={maxMana}
        color="blue"
        icon="🔮"
        label="Mana"
        iconBg="#2563eb"
      />

      {/* Experience Bar */}
      <ResourceBar
        current={experience}
        max={maxExperience}
        color="green"
        icon="⭐"
        label="Experience"
        iconBg="#059669"
      />

      {/* Gold/Currency Bar (only show if gold is provided) */}
      {gold !== undefined && (
        <ResourceBar
          current={gold}
          max={gold} // Gold doesn't have a max, so we use current as max to show 100%
          color="yellow"
          icon="💰"
          label="Gold"
          iconBg="#d97706"
          showMax={false} // Don't show max for gold since it doesn't have one
        />
      )}
    </div>
  );
};


const ResourceBar = ({
  current,
  max,
  color,
  icon,
  label,
  iconBg = '#4a5568',
  showMax = true
}: any) => {
  const percentage = (current / max) * 100;

  const getGradientClass = (color: string) => {
    switch (color) {
      case 'red': return 'from-red-400 via-red-500 to-red-600';
      case 'blue': return 'from-blue-400 via-blue-500 to-blue-600';
      case 'green': return 'from-green-400 via-green-500 to-green-600';
      case 'yellow': return 'from-yellow-300 via-yellow-400 to-yellow-500';
      default: return 'from-blue-400 via-blue-500 to-blue-600';
    }
  };

  return (
    <div className="flex items-center gap-2 mb-3">
      {/* Icon Container */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg relative flex-shrink-0"
        style={{
          background: `linear-gradient(145deg, ${iconBg}, #2d3748)`,
          boxShadow: `0 2px 6px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)`
        }}
      >
        {icon}
        <div
          className="absolute inset-0 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 70%)`
          }}
        />
      </div>

      {/* Progress Bar Container */}
      <div className="flex-1 relative">
        {/* Glassmorphism outer container */}
        <div
          className="h-8 rounded-md relative overflow-hidden backdrop-blur-md"
          style={{
            background: `
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.1) 0%,
                  rgba(255, 255, 255, 0.05) 50%,
                  rgba(0, 0, 0, 0.1) 100%
                )`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1)
              `
          }}
        >
          {/* Inner glass chamber */}
          <div
            className="absolute inset-1 overflow-hidden backdrop-blur-sm"
            style={{
              borderRadius: '4px',
              background: `
                  linear-gradient(180deg, 
                    rgba(255, 255, 255, 0.03) 0%,
                    rgba(0, 0, 0, 0.05) 50%,
                    rgba(0, 0, 0, 0.1) 100%
                  )`,
              border: '0.5px solid rgba(255, 255, 255, 0.1)',
              boxShadow: `
                  inset 0 2px 4px rgba(0, 0, 0, 0.3),
                  inset 0 -1px 2px rgba(255, 255, 255, 0.05)
                `
            }}
          >
            {/* Progress fill with glassmorphism */}
            <div
              className={`h-full bg-gradient-to-r ${getGradientClass(color)} transition-all duration-500 ease-out relative overflow-hidden backdrop-blur-sm`}
              style={{
                width: `${Math.min(percentage, 100)}%`,
                borderRadius: '3px',
                background: `
                    linear-gradient(135deg, 
                      ${color === 'red' ? 'rgba(248, 113, 113, 0.9)' :
                    color === 'blue' ? 'rgba(59, 130, 246, 0.9)' :
                      color === 'green' ? 'rgba(52, 211, 153, 0.9)' :
                        color === 'yellow' ? 'rgba(251, 191, 36, 0.9)' : 'rgba(59, 130, 246, 0.9)'} 0%,
                      ${color === 'red' ? 'rgba(239, 68, 68, 0.8)' :
                    color === 'blue' ? 'rgba(37, 99, 235, 0.8)' :
                      color === 'green' ? 'rgba(16, 185, 129, 0.8)' :
                        color === 'yellow' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(37, 99, 235, 0.8)'} 50%,
                      ${color === 'red' ? 'rgba(220, 38, 38, 0.9)' :
                    color === 'blue' ? 'rgba(29, 78, 216, 0.9)' :
                      color === 'green' ? 'rgba(5, 150, 105, 0.9)' :
                        color === 'yellow' ? 'rgba(217, 119, 6, 0.9)' : 'rgba(29, 78, 216, 0.9)'} 100%
                    )`,
                border: `0.5px solid ${color === 'red' ? 'rgba(248, 113, 113, 0.3)' :
                  color === 'blue' ? 'rgba(59, 130, 246, 0.3)' :
                    color === 'green' ? 'rgba(52, 211, 153, 0.3)' :
                      color === 'yellow' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                boxShadow: `
                    0 0 20px ${color === 'red' ? 'rgba(248, 113, 113, 0.4)' :
                    color === 'blue' ? 'rgba(59, 130, 246, 0.4)' :
                      color === 'green' ? 'rgba(52, 211, 153, 0.4)' :
                        color === 'yellow' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(59, 130, 246, 0.4)'},
                    inset 0 1px 0 rgba(255, 255, 255, 0.3),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.2)
                  `
              }}
            >
              {/* Animated liquid shimmer */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background: `
                      linear-gradient(90deg, 
                        transparent 0%, 
                        rgba(255, 255, 255, 0.6) 30%,
                        rgba(255, 255, 255, 0.8) 50%,
                        rgba(255, 255, 255, 0.6) 70%,
                        transparent 100%
                      )`,
                  animation: 'shimmer 4s infinite ease-in-out'
                }}
              />

              {/* Glass surface reflection */}
              <div
                className="absolute top-0 left-0 right-0 opacity-60"
                style={{
                  height: '40%',
                  borderRadius: '3px 3px 0 0',
                  background: `
                      linear-gradient(180deg, 
                        rgba(255, 255, 255, 0.5) 0%,
                        rgba(255, 255, 255, 0.2) 60%,
                        transparent 100%
                      )`
                }}
              />

              {/* Liquid depth effect */}
              <div
                className="absolute bottom-0 left-0 right-0 opacity-30"
                style={{
                  height: '20%',
                  borderRadius: '0 0 3px 3px',
                  background: `
                      linear-gradient(180deg, 
                        transparent 0%,
                        rgba(0, 0, 0, 0.4) 100%
                      )`
                }}
              />

              {/* Bubble effects for liquid realism */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `
                      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.3) 1px, transparent 2px),
                      radial-gradient(circle at 60% 70%, rgba(255, 255, 255, 0.2) 1.5px, transparent 2.5px),
                      radial-gradient(circle at 80% 85%, rgba(255, 255, 255, 0.4) 0.8px, transparent 1.5px)
                    `,
                  backgroundSize: '20px 20px, 30px 30px, 15px 15px'
                }}
              />
            </div>

            {/* Glass tube reflection overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: '4px',
                background: `
                    linear-gradient(130deg, 
                      rgba(255, 255, 255, 0.15) 0%, 
                      rgba(255, 255, 255, 0.08) 25%, 
                      transparent 40%, 
                      transparent 60%,
                      rgba(255, 255, 255, 0.03) 75%, 
                      rgba(255, 255, 255, 0.1) 100%
                    )`
              }}
            />

            {/* Left glass edge highlight */}
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 opacity-50"
              style={{
                borderRadius: '4px 0 0 4px',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))'
              }}
            />

            {/* Right glass edge shadow */}
            <div
              className="absolute right-0 top-0 bottom-0 w-0.5 opacity-30"
              style={{
                borderRadius: '0 4px 4px 0',
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))'
              }}
            />
          </div>

          {/* Text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-white font-bold text-xs px-1 py-0.5 rounded"
              style={{
                textShadow: '1px 1px 1px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.5)',
                background: 'rgba(0,0,0,0.2)',
                backdropFilter: 'blur(1px)'
              }}
            >
              {showMax ? `${current.toLocaleString()} / ${max.toLocaleString()}` : current.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Glassmorphism glow effect */}
        <div
          className="absolute inset-0 opacity-20 blur-md -z-10"
          style={{
            borderRadius: '6px',
            background: `
                radial-gradient(ellipse at center, 
                  ${color === 'red' ? 'rgba(248, 113, 113, 0.4)' :
                color === 'blue' ? 'rgba(59, 130, 246, 0.4)' :
                  color === 'green' ? 'rgba(52, 211, 153, 0.4)' :
                    color === 'yellow' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(59, 130, 246, 0.4)'} 0%,
                  transparent 70%
                )`,
            boxShadow: `
                0 0 30px ${color === 'red' ? 'rgba(248, 113, 113, 0.3)' :
                color === 'blue' ? 'rgba(59, 130, 246, 0.3)' :
                  color === 'green' ? 'rgba(52, 211, 153, 0.3)' :
                    color === 'yellow' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(59, 130, 246, 0.3)'}
              `
          }}
        />
      </div>
    </div>
  );
};

