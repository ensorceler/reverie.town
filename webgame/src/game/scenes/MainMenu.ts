import { GameObjects, Scene } from 'phaser';


export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    player: Phaser.GameObjects.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('MainMenu');
    }

    create() {

    }


    update() {

    }
}
