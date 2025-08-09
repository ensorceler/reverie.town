import { useState } from 'react';
import { StatusBar } from './components/ui/game/StatusBars';
import { PhaserGame } from './PhaserGame';

function App() {
    const [currentView, setCurrentView] = useState<'homepage' | 'game'>('homepage');

    if (currentView === 'homepage') {
        /*
        */
    }

    return (
        <div className="h-screen w-screen relative">
            <PhaserGame />
            <StatusBar health={20} maxHealth={100} experience={40} maxExperience={100} mana={40} maxMana={100} />
        </div>
    );
}

export default App

