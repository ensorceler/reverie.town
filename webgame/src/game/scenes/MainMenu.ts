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

    preload() {

        this.load.spritesheet('player', 'assets/johnny/standard/idle.png', {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,      // Pixels around the entire spritesheet
            spacing: 0,      // Pixels between each frame
        });


    }

    create() {

        this.player = this.add.sprite(400, 300, 'player', 0);

        // Create animations using the loaded frames
        this.anims.create({
            key: 'idle-back',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 1
            }),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'idle-front',
            frames: this.anims.generateFrameNumbers('player', {
                start: 4,
                end: 5
            }),
            frameRate: 5,
            repeat: -1
        });

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.player.anims.play('idle-front');
    }


    update() {
        // Manual frame switching
        if (this.cursors.down.isDown) {
            console.log("cursor left clicked")
            //this.anims.play('cycle',);
            //this.player.anims.play('idle-front');
        }

    }
}
