import { Scene, Input } from "phaser";

const COLLISION_CATEGORIES = {
    PLAYER: 1,
    WALL: 2,
    ENEMY: 3,
}

export class RemotePlayer {
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
            //console.log("animSet =>", animSet, " spritesheetKey =>", spritesheetKey, "anims =>", anims);
            Object.keys(anims).forEach(animKey => {
                const animData = anims[animKey];
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
            label: 'player_' + this.playerName,
            isStatic: true,
        });

        this.playerNameTag = this.scene.add.text(this.playerObj.x - 16, this.playerObj.y - 32, this.playerName, {
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            strokeThickness: 0.75,
        }).setDepth(1001);


        this.playerObj.setCollisionCategory(COLLISION_CATEGORIES.PLAYER);
        this.playerObj.setCollidesWith([
            COLLISION_CATEGORIES.WALL,
            COLLISION_CATEGORIES.ENEMY
        ]);

        this.playerObj.setDepth(1000);
        this.playerObj.setAngularVelocity(0);
        this.playerObj.setFixedRotation(); // Prevents any rotation



    }

    updatePlayerPosition(x: number, y: number) {
        this.playerObj.setPosition(x, y)
        this.playerNameTag.setPosition(x - 16, y - 32);
    }

    updateRemotePlayerMovement(playerData: any) {
        console.log("update Remote Player =>", playerData);
        if (playerData.playerMoving) {
            const animPrefix = 'walk';
            this.playerObj.anims.play(`${animPrefix}-${playerData?.playerFacingDirection}`, true);
            this.playerObj.setPosition(playerData.playerPosition?.x, playerData.playerPosition?.y);
            this.playerNameTag.setPosition(playerData.playerPosition?.x - 16, playerData.playerPosition?.y - 32);
        }
        else {
            this.playerObj.anims.play(`idle-${playerData?.playerFacingDirection || this.playerFacingDirection}`, true);
            this.playerNameTag.setPosition(playerData.playerPosition?.x - 16, playerData.playerPosition?.y - 32);
        }
    }


}



