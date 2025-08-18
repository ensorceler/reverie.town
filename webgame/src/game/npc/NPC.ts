
import { Scene, Input } from "phaser";
import { DEPTH } from "../constants/depth-managment";


export class NPC {
    scene: Scene;
    npcKey: string;
    npcObj: Phaser.Physics.Matter.Sprite;
    npcName: string;
    npcNameTag: any;
    xPos: number;
    yPos: number;
    animationConfig: any = null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    npcFacingDirection: "front" | "back" | "right" | "left" = "front";

    constructor(scene: Scene, x: number, y: number, name: string) {
        this.scene = scene;
        this.npcName = name;
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
        this.npcObj = this.scene.matter.add.sprite(100, 100, 'playerIdle', 4, {
            shape: {
                type: "rectangle",
                width: 32,
                height: 32
            },
            label: 'player_' + this.npcName,
            isStatic: true,
        });

        this.npcNameTag = this.scene.add.text(this.npcObj.x - 16, this.npcObj.y - 32, this.npcName, {
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            strokeThickness: 0.75,
        }).setDepth(1001);


        this.npcObj.setDepth(DEPTH.NPC_DEPTH);
        this.npcObj.setAngularVelocity(0);
        this.npcObj.setFixedRotation(); // Prevents any rotation

    }




}