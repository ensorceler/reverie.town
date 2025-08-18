import { Scene, Input } from "phaser";
import { PhaserEventBus } from "../events/PhaserEventBus";
import { PlayerState } from "@/@types/websocket";
import { DEPTH } from "../constants/depth-managment";


export class Player {
    scene: Scene;
    playerKey: string;
    playerObj: Phaser.Physics.Matter.Sprite;
    playerName: string;
    playerNameTag: any;
    xPos: number;
    yPos: number;
    animationConfig: any = null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    keyShift: Input.Keyboard.Key;
    keyH: Input.Keyboard.Key;
    keyC: Input.Keyboard.Key;
    playerFacingDirection: "front" | "back" | "right" | "left" = "front";

    constructor(scene: Scene, x: number, y: number, playerName: string) {
        this.scene = scene;
        this.playerName = playerName;
        this.xPos = x;
        this.yPos = y;
        this.animationConfig = null;
    }


    // Load all spritesheets defined in the JSON
    loadPlayerSpriteSheet() {
        this.scene.load.once('filecomplete-json-playerAnimations', (key: any, type: any, data: any) => {
            //this.animationConfig=data;
            console.log("key,data animations =>", key, data);
            this.animationConfig = data;
            const animations = this.animationConfig.animations;

            Object.keys(animations).forEach(animationSetKey => {

                const animSet = animations[animationSetKey];
                const spritesheet = animSet.spritesheet;
                //this.scene.load.start();
                const spritesheetPath = `${spritesheet.path}?v=${Date.now()}`;

                // Load each spritesheet
                this.scene.load.spritesheet(
                    spritesheet.key,
                    spritesheetPath,
                    {
                        frameWidth: spritesheet.frameWidth,
                        frameHeight: spritesheet.frameHeight
                    }
                );
            });
        });
    }

    loadPlayer() {
        this.animationConfig = this.scene.cache.json.get('playerAnimations');
    }

    createPlayer() {

        this.loadPlayer();
        if (!this.animationConfig) {
            console.error('Player Animation config not loaded!');
            return;
        }


        const animations = this.animationConfig.animations;

        Object.keys(animations).forEach(animationSetKey => {
            const animSet = animations[animationSetKey];
            const spritesheetKey = animSet.spritesheet.key;
            const anims = animSet.animations;
            console.log("animSet =>", animSet, " spritesheetKey =>", spritesheetKey, "anims =>", anims);
            Object.keys(anims).forEach(animKey => {
                const animData = anims[animKey];

                // Create the animation
                //HTMLFormControlsCollection.lo
                console.log("animations =>key", animKey);
                console.log("animation data =>data", animData);
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

        this.playerObj = this.scene.matter.add.sprite(100, 100, 'playerIdle', 4, {
            shape: {
                type: "rectangle",
                width: 32,
                height: 32
            },
            label: "player_" + this.playerName
        });
        this.playerObj.setDepth(DEPTH.PLAYER_DEPTH);

        this.playerNameTag = this.scene.add.text(this.playerObj.x - 16, this.playerObj.y - 32, this.playerName, {
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            strokeThickness: 0.75,
        }).setDepth(DEPTH.PLAYER_NAME_TAG_DEPTH);



        this.scene.cameras.main.startFollow(this.playerObj);
        this.playerObj.setAngularVelocity(0);
        this.playerObj.setFixedRotation(); // Prevents any rotation


        this.cursors = this.scene.input.keyboard!?.createCursorKeys();
        this.keyShift = this.scene.input.keyboard?.addKey('SHIFT')!;
        this.keyH = this.scene.input.keyboard?.addKey('H')!;
        this.keyC = this.scene.input.keyboard?.addKey('C')!;

    }

    updatePlayerPosition(x: number, y: number) {
        this.playerObj.setPosition(x, y)
        this.playerNameTag.setPosition(x - 16, y - 32);
    }


    updatePlayerMovement() {

        // send the player position/ direction everything when some key is pressed atleast 
        // complete the code 
        let isMoving = false;
        let run = false;
        let speed = 1.3;
        let velocityX = 0;
        let velocityY = 0;
        this.playerNameTag.setPosition(this.playerObj.x - 16, this.playerObj.y - 32);
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
        else if (this.cursors.up.isDown) {
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

        if (isMoving || this.keyH.isDown || this.keyC.isDown) {
            const playerState: PlayerState = {
                playerPosition: {
                    x: this.playerObj.x,
                    y: this.playerObj.y
                },
                playerFacingDirection: this.playerFacingDirection,
                playerCurrentScene: this.scene.scene.key,
                playerMoving: isMoving,
            };

            PhaserEventBus.emit('sendPlayerState', playerState);
        }


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



