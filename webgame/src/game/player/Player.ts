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
            console.log("key=>", key);
            console.log("type=>", type);
            console.log("data =>", data);
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

        //this.scene.anims. 
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
        //this.scene.anims.addMix("idle-front", "walk-front", 100)
        //this.scene.anims.addMix("walk-front", "idle-front", 50)


        //this.playerObj = this.scene.add.sprite(this.xPos, this.yPos, 'playerIdle', 0);
        this.playerObj = this.scene.matter.add.sprite(100, 100, 'Player-X', 0, {
            label: "Player-X"
        });

        //this.scene.matter.add.gameObject(this.player)
        /// Set collision properties
        //this
        this.playerObj.setCollisionCategory(COLLISION_CATEGORIES.PLAYER);
        this.playerObj.setCollidesWith([
            COLLISION_CATEGORIES.WALL,
            COLLISION_CATEGORIES.ENEMY
        ]);

        this.playerObj.setDepth(1000);

        this.scene.cameras.main.startFollow(this.playerObj);


        this.cursors = this.scene.input.keyboard!?.createCursorKeys();

        this.keyShift = this.scene.input.keyboard?.addKey('SHIFT')!;
        this.keyH = this.scene.input.keyboard?.addKey('H')!;
        this.keyC = this.scene.input.keyboard?.addKey('C')!;

        this.playerObj.anims.play("idle-front");
    }

    updatePlayerPosition(x: number, y: number) {
        this.playerObj.setPosition(x, y)
    }
    updatePlayerMovement() {
        let isMoving = false;
        let run = false;
        //let playerFacing
        let speed = 1.3;

        if (this.keyShift.isDown) {
            run = true;
            speed = 3;
        }

        if (this.cursors.down.isDown) {
            // Switch to walk sprite and play walk animation
            console.log("keyboard down =>");
            //this.playerObj.setTexture('playerWalk');
            if (run) {
                this.playerObj.anims.play('run-front', true);
            }
            else {
                this.playerObj.anims.play('walk-front', true);
            }

            this.playerObj.y += speed;
            this.playerFacingDirection = "front";
            isMoving = true;
        } else if (this.cursors.up.isDown) {
            //this.playerObj.setTexture('playerWalk');
            if (run) {
                this.playerObj.anims.play('run-back', true);
            }
            else {
                this.playerObj.anims.play('walk-back', true);
            }
            //this.playerObj.anims.play('walk-back', true);
            this.playerObj.y -= speed;
            this.playerFacingDirection = "back";
            isMoving = true;
        } else if (this.cursors.left.isDown) {
            //this.playerObj.setTexture('playerWalk');
            if (run) {
                this.playerObj.anims.play('run-left', true);
            }
            else
                this.playerObj.anims.play('walk-left', true);

            //this.playerObj.anims.play('walk-left', true);
            this.playerFacingDirection = "left";
            this.playerObj.x -= speed;
            isMoving = true;
        } else if (this.cursors.right.isDown) {
            if (run) {
                this.playerObj.anims.play('run-right', true);
            }
            else
                this.playerObj.anims.play('walk-right', true);
            //this.playerObj.setTexture('playerWalk');
            //this.playerObj.anims.play('walk-right', true);
            this.playerFacingDirection = "right";
            this.playerObj.x += speed;
            isMoving = true;
        }

        // Switch back to idle sprite when not moving
        if (!isMoving) {
            //this.playerObj.setTexture('playerIdle');
            //this.playerObj.anims.play('idle-front', true);
            if (this.keyH.isDown) {
                console.log("H key is down!")
                this.playerObj.anims.play("hurt-heavy", true);
            }
            else if (this.keyC.isDown) {
                console.log("C key is down!")
                this.playerObj.anims.play("sit-front", true);
            }
            else {
                //if(this.playerFacingDirection)
                this.playerObj.anims.play(`idle-${this.playerFacingDirection}`, true);
            }
        }

    }


    getPlayerGameObject() {
        return this.playerObj;
    }
}



