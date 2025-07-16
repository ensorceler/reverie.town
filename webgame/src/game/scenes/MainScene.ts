import { GameObjects, Scene } from 'phaser';
import { Player } from '../player/Player';

const minZoom = 0.25
const maxZoom = 3

export class MainScene extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    player: Player;
    playerTest: any;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    zoomLevel: number = 1;
    map: Phaser.Tilemaps.Tilemap;

    constructor() {
        super('MainMenu');
        this.player = new Player(this, 1500, 1100, 'johnny')
    }

    preload() {


        // Load all tileset images
        this.load.image("1_Generic_Shadowless32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/1_Generic_Shadowless32x32.png");

        this.load.image("2_LivingRoom_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/2_LivingRoom_Shadowless_32x32.png");

        this.load.image("3_Bathroom_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/3_Bathroom_Shadowless_32x32.png");

        this.load.image("4_Bedroom_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/4_Bedroom_Shadowless_32x32.png");

        this.load.image("5_Classroom_and_library_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/5_Classroom_and_library_Shadowless_32x32.png");

        this.load.image("Room_Builder_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Room_Builder_32x32.png");

        this.load.image("animated_door_bathroom_32x32", "assets/tiles/moderninteriors-win/3_Animated_objects/32x32/spritesheets/animated_door_bathroom_32x32.png");

        this.load.image("animated_door_glass_sliding_32x32", "assets/tiles/moderninteriors-win/3_Animated_objects/32x32/spritesheets/animated_door_glass_sliding_32x32.png");

        this.load.image("14_Basement_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/14_Basement_Shadowless_32x32.png");

        this.load.image("13_Conference_Hall_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/13_Conference_Hall_Shadowless_32x32.png");

        this.load.image("6_Music_and_sport_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/6_Music_and_sport_Shadowless_32x32.png");

        this.load.image("12_Kitchen_Shadowless_32x32", "assets/tiles/moderninteriors-win/1_Interiors/32x32/Theme_Sorter_Shadowless_32x32/12_Kitchen_Shadowless_32x32.png");

        this.load.image("animated_door_vertical_right_1_32x32", "assets/tiles/moderninteriors-win/3_Animated_objects/32x32/spritesheets/animated_door_vertical_right_1_32x32.png");

        // Load your JSON tilemap
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/lobby_scene.json');

        this.player.preloadAnimationConfig();
        this.player.loadPlayer();

    }

    create() {
        this.player.createPlayerAnimation();

        // Create the tilemap
        const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        this.map = map;
        console.log('Map created:', map);
        console.log('Map dimensions:', map.width, '×', map.height, 'tiles');
        console.log('Map pixel size:', map.widthInPixels, '×', map.heightInPixels, 'pixels');
        console.log('Tile size:', map.tileWidth, '×', map.tileHeight, 'pixels');

        // Add all tilesets to the map
        const tilesets: any = [
            map.addTilesetImage('1_Generic_Shadowless32x32', '1_Generic_Shadowless32x32'),
            map.addTilesetImage('2_LivingRoom_Shadowless_32x32', '2_LivingRoom_Shadowless_32x32'),
            map.addTilesetImage('3_Bathroom_Shadowless_32x32', '3_Bathroom_Shadowless_32x32'),
            map.addTilesetImage('4_Bedroom_Shadowless_32x32', '4_Bedroom_Shadowless_32x32'),
            map.addTilesetImage('5_Classroom_and_library_Shadowless_32x32', '5_Classroom_and_library_Shadowless_32x32'),
            map.addTilesetImage('Room_Builder_32x32', 'Room_Builder_32x32'),
            map.addTilesetImage('animated_door_bathroom_32x32', 'animated_door_bathroom_32x32'),
            map.addTilesetImage('animated_door_glass_sliding_32x32', 'animated_door_glass_sliding_32x32'),
            map.addTilesetImage('14_Basement_Shadowless_32x32', '14_Basement_Shadowless_32x32'),
            map.addTilesetImage('13_Conference_Hall_Shadowless_32x32', '13_Conference_Hall_Shadowless_32x32'),
            map.addTilesetImage('6_Music_and_sport_Shadowless_32x32', '6_Music_and_sport_Shadowless_32x32'),
            map.addTilesetImage('12_Kitchen_Shadowless_32x32', '12_Kitchen_Shadowless_32x32'),
            map.addTilesetImage('animated_door_vertical_right_1_32x32', 'animated_door_vertical_right_1_32x32')
        ];

        const tileset = map.addTilesetImage('1_Generic_Shadowless32x32', '1_Generic_Shadowless32x32');

        if (!tileset) {
            console.error('Failed to add tileset!');
            this.add.text(10, 10, 'TILESET FAILED', { fontSize: '32px', color: '#ff0000' });
            return;
        }
        // Method 1: Get all layers from the tilemap
        const allLayers = map.layers;
        console.log('All layers:', allLayers);


        // Method 4: Get layers by iterating through the map's layer data
        const layerObjects: Phaser.Tilemaps.TilemapLayer[] = [];
        for (let i = 0; i < map.layers.length; i++) {
            const layerData = map.layers[i];
            console.log(`Layer ${i}:`, layerData);

            const layer = map.createLayer(layerData.name, tilesets, 0, 0);
            if (layer) {
                layerObjects.push(layer);
            }
        }

        console.log("object layers", map.getObjectLayerNames())
        console.log("collision layer =>", map.getObjectLayer("Collision_Layer"))
        let collisionLayer = map.getObjectLayer("Collision_Layer");

        collisionLayer?.objects.forEach((obj: Phaser.Types.Tilemaps.TiledObject) => {
            // Handle wall and furniture objects
            if (obj.type === "wall" || obj.type === "furniture") {
                console.log('Processing collision object:', obj);

                let wall = null;
                const centerX = obj.x! + (obj.width || 0) / 2;
                const centerY = obj.y! + (obj.height || 0) / 2;

                // Handle different object shapes
                if (obj.ellipse) {
                    // Create circle collision body
                    const radius = Math.min(obj.width || 32, obj.height || 32) / 2;
                    wall = this.matter.add.circle(centerX, centerY, radius, {
                        isStatic: true,
                        label: obj.type,
                        //render: { visible: false } // Hide debug rendering
                    });
                    console.log(`Created circle ${obj.type} at (${centerX}, ${centerY}) with radius ${radius}`);

                } else if (obj.polygon) {
                    // Handle polygon objects
                    console.log("object polygon =>", obj)
                    try {

                        //const poly = this.add.polygon(obj.x, obj.y, obj.polygon)
                        //poly.setOrigin(0, 0)
                        //this.matter.add.gameObject()
                        //this.matter.add.gameObject(poly, { shape: { type: 'fromVerts', verts: obj.polygon, flagInternal: true } });
                        const objPol = obj.polygon;
                        const polygon = new Phaser.Geom.Polygon(objPol)
                        const points: { x: number; y: number }[] = []
                        for (let point of polygon.points) {
                            points.push({
                                x: obj.x! + point.x,
                                y: obj.y! + point.y,
                            })
                        }
                        const sliceCentre = this.matter.vertices.centre(points)
                        const body2 = this.matter.add.fromVertices(sliceCentre.x, sliceCentre.y, points)
                        const poly2 = this.add.polygon(sliceCentre.x, sliceCentre.y, points)
                        const collision = this.matter.add.gameObject(
                            poly2,
                            body2
                        ) as Phaser.Physics.Matter.Sprite
                        collision.setStatic(true)
                        //collision.setCollisionGroup(group)

                        //graphics.strokePoints(points)

                    } catch (error) {
                        console.warn(`Failed to create polygon for ${obj.type}, falling back to rectangle:`, error);
                        // Fallback to rectangle if polygon creation fails
                        wall = this.matter.add.rectangle(
                            centerX,
                            centerY,
                            obj.width || 32,
                            obj.height || 32,
                            {
                                isStatic: true,
                                label: obj.type,
                                //render: { visible: false }
                            }
                        );
                    }

                } else {
                    // Default: create rectangle collision body
                    wall = this.matter.add.rectangle(
                        centerX,
                        centerY,
                        obj.width || 32,
                        obj.height || 32,
                        {
                            isStatic: true,
                            label: obj.type,
                            //  render: { visible: false }
                        }
                    );
                    console.log(`Created rectangle ${obj.type} at (${centerX}, ${centerY}) size ${obj.width}x${obj.height}`);
                }

            }

            if (obj.name === "StartingPoint" && this.player) {
                this.player.updatePlayerPosition(obj.x!, obj.y!)
            }
        })

        this.depthZone();
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.setupMouseWheelZoom();
        //this.matter.world.on("")
        this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            console.log("collision start event =L>", event)
            // if the body collides with one of the zone, the set the 
            // X- Layer(unnamed) depth above the player ?
            // 
            console.log("collision start event =>", event)

            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;

                const isZoneCollisionWithPlayer =
                    (bodyA.label === "Player-X" && bodyB.label === "zone")
                    ||
                    (bodyB.label === "Player-X" && bodyA.label === "zone");


                if (isZoneCollisionWithPlayer) {
                    //const zoneBody = bodyA === this.player?.body ? bodyB : bodyA;
                    console.log("isZone Collision with player =>");
                    console.log("layerObjects =>", layerObjects);
                    layerObjects.forEach((layer) => {
                        //console.log("layer indv=>", layer)
                        if (layer.layer.name === "LivingRoom_0") {
                            console.log("layer =>", layer);
                            layer.setDepth(1001);
                        }
                    })
                }

            });
        })
        this.matter.world.on('collisionend', (event: any) => {
            console.log("collision end event =L>", event)

        })
    }



    update() {
        // Manual frame switching
        this.player.updatePlayerMovement()
    }


    setupMouseWheelZoom() {
        // Listen for mouse wheel events
        this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: any[], deltaX: number, deltaY: number, deltaZ: number) => {
            // deltaY > 0 = scroll down (zoom out)
            // deltaY < 0 = scroll up (zoom in)

            const zoomStep = 0.1;

            if (deltaY > 0) {
                // Zoom out
                this.zoomLevel = Math.max(minZoom, this.zoomLevel - zoomStep);
            } else {
                // Zoom in
                this.zoomLevel = Math.min(maxZoom, this.zoomLevel + zoomStep);
            }

            // Apply zoom to camera
            this.cameras.main.setZoom(this.zoomLevel);

            console.log(`Zoom level: ${this.zoomLevel.toFixed(2)}x`);
        });
    }

    depthZone() {
        //this.map

        let zoneLayer = this.map.getObjectLayer("Zone")
        console.log('zoneLayer =>', zoneLayer);
        zoneLayer?.objects.forEach((obj: Phaser.Types.Tilemaps.TiledObject) => {
            if (obj.type === "zone") {
                console.log("zone objects =>", obj)

                if (obj.polygon) {
                    const objPol = obj.polygon;
                    const polygon = new Phaser.Geom.Polygon(objPol)
                    const points: { x: number; y: number }[] = []
                    for (let point of polygon.points) {
                        points.push({
                            x: obj.x! + point.x,
                            y: obj.y! + point.y,
                        })
                    }
                    const sliceCentre = this.matter.vertices.centre(points)
                    const body2 = this.matter.add.fromVertices(sliceCentre.x, sliceCentre.y, points, {
                        label: "zone",
                        isStatic: true,
                        isSensor: true,
                    })
                    const poly2 = this.add.polygon(sliceCentre.x, sliceCentre.y, points)
                    const collision = this.matter.add.gameObject(
                        poly2,
                        body2,
                    ) as Phaser.Physics.Matter.Sprite
                    ///collision.setSensor(true)
                    //collision.setLabel()
                    //collision.set("zone");
                    //collision.setCollisionGroup(group)
                }

            }
        })
    }
}


