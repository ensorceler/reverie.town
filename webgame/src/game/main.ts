import { AUTO, Game } from 'phaser';
import { LobbyScene } from './scenes/LobbyScene';
import { RedRoomScene } from './scenes/RedRoomScene';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { InteriorScene } from './scenes/InteriorScene';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    backgroundColor: '#000',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "matter",
        matter: {
            enabled: true,
            debug: true,
            gravity: {
                x: 0,
                y: 0
            },
        }
    },
    scene: [
        Boot,
        Preloader,
        LobbyScene,
        RedRoomScene,
        InteriorScene,
    ]
};

const StartGame = (parent: string) => {
    const container = document.getElementById(parent);
    if (!container) {
        throw new Error(`Container with id "${parent}" not found`);
    }
    
    const containerRect = container.getBoundingClientRect();
    const gameConfig = {
        ...config,
        parent,
        width: containerRect.width || window.innerWidth,
        height: containerRect.height || window.innerHeight
    };
    
    const game = new Game(gameConfig);
    
    // Handle window resize
    const handleResize = () => {
        const newRect = container.getBoundingClientRect();
        game.scale.resize(newRect.width || window.innerWidth, newRect.height || window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return game;
}

export default StartGame;
