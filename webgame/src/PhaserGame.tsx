import { useEffect, useRef } from 'react';
import StartGame from './game/main';


export const PhaserGame = () => {
    const game = useRef<Phaser.Game | null>(null!);
    useEffect(() => {
        if (game.current === null)
            game.current = StartGame("game-container");
    }, []);

    return (
        <div id="game-container" className="cursor-grab overflow-hidden border-2 w-full h-full"></div>
    );
};
