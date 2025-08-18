import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PhaserGame } from './PhaserGame';
import { GameChatbox, PlayerStatusBar, RetroGameChat, StatusBar } from './components/ui/game';
import { Homepage } from './components/Homepage';
import { BottomActionBar } from './components/ui/game/BottomActionBar';
import TestPage from './components/TestPage';

function GameView() {
    return (
        <div className="h-screen w-screen relative">
            <PhaserGame />
            <RetroGameChat />
            <PlayerStatusBar />
            <BottomActionBar />
        </div>
    );
}

function GameViewExample() {
    return (
        <div className="h-screen w-screen relative">
            <PhaserGame />
            <StatusBar />
            <GameChatbox />
        </div>
    );
}



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/test" element={<TestPage />} />
                <Route path="/" element={<GameView />} />
                <Route path="/example" element={<GameViewExample />} />
            </Routes>
        </Router>
    );
}

export default App

