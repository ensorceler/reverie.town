import React from 'react';
import { GameChatbox, StatusBar } from './ui/game';
import { Panel } from './ui/game/Panel';
import { ActionButton } from './ui/game/ActionButton';

export const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <StatusBar />
      <div className="mb-4"></div>
      <GameChatbox />
    </div>
  );
};

export default TestPage;