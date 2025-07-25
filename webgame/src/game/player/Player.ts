import { Scene, Input } from "phaser";

const COLLISION_CATEGORIES = {
    PLAYER: 1,
    WALL: 2,
    ENEMY: 3,
}

export class Player {
    scene: Scene;
    playerKey: string;
    //playerSprite: Phaser.GameObjects.Sprite;
    playerObj: Phaser.Physics.Matter.Sprite;
    xPos: number;
    yPos: number;
    animationConfig: any = null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    keyShift: Input.Keyboard.Key;
    keyH: Input.Keyboard.Key;
    keyC: Input.Keyboard.Key;
    playerFacingDirection: "front" | "back" | "right" | "left" = "front";

    constructor(scene: Scene, x: number, y: number, playerKey: string) {
        this.scene = scene;
        this.playerKey = playerKey;
        this.xPos = x;
        this.yPos = y;
    }

    preloadAnimationConfig() {
        this.scene.load.json('playerAnimations', 'assets/player-animations.json');
    }


    // Load all spritesheets defined in the JSON
    loadPlayer() {

        this.scene.load.on('filecomplete-json-playerAnimations', (key: any, type: any, data: any) => {
            //this.animationConfig=data;
            this.animationConfig = data;
            const animations = this.animationConfig.animations;

            Object.keys(animations).forEach(animationSetKey => {

                const animSet = animations[animationSetKey];
                const spritesheet = animSet.spritesheet;

                // Load each spritesheet
                this.scene.load.spritesheet(
                    spritesheet.key,
                    spritesheet.path,
                    {
                        frameWidth: spritesheet.frameWidth,
                        frameHeight: spritesheet.frameHeight
                    }
                );
            });
        });

    }

    createPlayerAnimation() {

        if (!this.animationConfig) {
            console.error('Animation config not loaded!');
            return;
        }


        const animations = this.animationConfig.animations;

        Object.keys(animations).forEach(animationSetKey => {
            const animSet = animations[animationSetKey];
            const spritesheetKey = animSet.spritesheet.key;
            const anims = animSet.animations;

            Object.keys(anims).forEach(animKey => {
                const animData = anims[animKey];

                // Create the animation
                this.scene.anims.create({
                    key: animKey,
                    frames: this.scene.anims.generateFrameNumbers(spritesheetKey, {
                        frames: animData.frames
                    }),
                    frameRate: animData.frameRate,
                    repeat: animData.repeat
                });
            });
        });

        console.log('All animations loaded successfully!');
        this.playerObj = this.scene.matter.add.sprite(100, 100, 'Player-X', 0, {
            label: "Player-X"
        });

        this.playerObj.setCollisionCategory(COLLISION_CATEGORIES.PLAYER);
        this.playerObj.setCollidesWith([
            COLLISION_CATEGORIES.WALL,
            COLLISION_CATEGORIES.ENEMY
        ]);

        this.playerObj.setDepth(1000);
        this.scene.cameras.main.startFollow(this.playerObj);
        this.playerObj.setAngularVelocity(0);
        this.playerObj.setFixedRotation(); // Prevents any rotation
        //this.playerObj= Infinity; //
        this.playerObj.anims.play("idle-front");


        this.cursors = this.scene.input.keyboard!?.createCursorKeys();
        this.keyShift = this.scene.input.keyboard?.addKey('SHIFT')!;
        this.keyH = this.scene.input.keyboard?.addKey('H')!;
        this.keyC = this.scene.input.keyboard?.addKey('C')!;

    }

    updatePlayerPosition(x: number, y: number) {
        this.playerObj.setPosition(x, y)
    }

    updatePlayerMovement() {
        let isMoving = false;
        let run = false;
        let speed = 1.3;
        let velocityX = 0;
        let velocityY = 0;

        if (this.keyShift.isDown) {
            run = true;
            speed = 3;
        }

        // Check horizontal movement
        if (this.cursors.left.isDown) {
            velocityX = -speed;
            this.playerFacingDirection = "left";
            isMoving = true;
        } else if (this.cursors.right.isDown) {
            velocityX = speed;
            this.playerFacingDirection = "right";
            isMoving = true;
        }

        // Check vertical movement
        if (this.cursors.up.isDown) {
            velocityY = -speed;
            this.playerFacingDirection = "back";
            isMoving = true;
        } else if (this.cursors.down.isDown) {
            velocityY = speed;
            this.playerFacingDirection = "front";
            isMoving = true;
        }

        // Set the calculated velocity
        this.playerObj.setVelocity(velocityX, velocityY);
        this.playerObj.setAngularVelocity(0);

        // Handle animations based on movement
        if (isMoving) {
            const animPrefix = run ? 'run' : 'walk';
            this.playerObj.anims.play(`${animPrefix}-${this.playerFacingDirection}`, true);
        } else {
            // Idle animations when not moving
            if (this.keyH.isDown) {
                this.playerObj.anims.play("hurt-heavy", true);
            } else if (this.keyC.isDown) {
                this.playerObj.anims.play("sit-front", true);
            } else {
                this.playerObj.anims.play(`idle-${this.playerFacingDirection}`, true);
            }
        }
    }

}



