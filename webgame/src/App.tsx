import { useState } from 'react';
import { StatusBar } from './components/ui/game/StatusBars';
import { PhaserGame } from './PhaserGame';
import { GameChatbox } from './components/ui/game';
import { Homepage } from './components/Homepage';
import GameInventorySystem from './components/ui/game/GameInventoryUI';

function App() {
    const [currentView, setCurrentView] = useState<'homepage' | 'game'>('homepage');

    if (currentView === 'homepage') {
        /*
        */
        return <Homepage onEnterGame={() => setCurrentView("game")} />
    }

    return (
        <div className="h-screen w-screen relative">
            <PhaserGame />
            <StatusBar health={20} maxHealth={100} experience={40} maxExperience={100} mana={40} maxMana={100} gold={40} />
            <GameChatbox />
            <GameInventorySystem />
        </div>
    );
}

export default App

