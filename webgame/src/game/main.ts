import { AUTO, Game } from 'phaser';
import { MainScene } from './scenes/MainScene';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 900,
    parent: 'game-container',
    backgroundColor: '#000',
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
        MainScene
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
