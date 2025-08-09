import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });


    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        //this.load.setPath('assets');

        this.load.image('logo', 'assets/logo.png');
        this.load.image('star', 'assets/star.png');

        this.load.image("1_Generic_Shadowless32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/1_Generic_Shadowless32x32.png");

        this.load.image("2_LivingRoom_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/2_LivingRoom_Shadowless_32x32.png");

        this.load.image("3_Bathroom_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/3_Bathroom_Shadowless_32x32.png");

        this.load.image("4_Bedroom_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/4_Bedroom_Shadowless_32x32.png");

        this.load.image("5_Classroom_and_library_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/5_Classroom_and_library_Shadowless_32x32.png");

        this.load.image("Room_Builder_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Room_Builder_32x32.png");

        this.load.image("14_Basement_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/14_Basement_Shadowless_32x32.png");

        this.load.image("13_Conference_Hall_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/13_Conference_Hall_Shadowless_32x32.png");

        this.load.image("6_Music_and_sport_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/6_Music_and_sport_Shadowless_32x32.png");

        this.load.image("12_Kitchen_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/12_Kitchen_Shadowless_32x32.png");

        // lobby scene
        this.load.tilemapTiledJSON('lobby_scene', 'assets/tilemaps/lobby_scene.json');

        this.load.tilemapTiledJSON('redroom_scene', 'assets/tilemaps/red_room.json');

        this.load.tilemapTiledJSON('building_A_interior_A1', 'assets/tilemaps/building_A_interior_A1.json');
        this.load.tilemapTiledJSON('building_A_interior_A2', 'assets/tilemaps/building_A_interior_A2.json');


        // load the player animations
        this.load.json('playerAnimations', `assets/player-animations.json`);

        // load player spritesheets and animations
        this.load.once('filecomplete-json-playerAnimations', (key: any, type: any, data: any) => {
            console.log("load  json complete playerAnimations=>", key, data);
            const animations = data.animations;
            console.log('Loaded player animations:', animations);

            Object.keys(animations).forEach(animationSetKey => {

                const animSet = animations[animationSetKey];
                const spritesheet = animSet.spritesheet;
                //this.scene.load.start();
                //const spritesheetPath = `${spritesheet.path}?v=${Date.now()}`;

                // Load each spritesheet
                this.load.spritesheet(
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

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        //this.scene.start('RedRoomScene');
        this.scene.start("InteriorScene", {
            mapKey: "building_A_interior_A2",
            spawnKey: "entry_spawn"
        })
    }
}
