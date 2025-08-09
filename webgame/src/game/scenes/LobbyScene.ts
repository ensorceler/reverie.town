import { GameObjects, Scene } from 'phaser';
import { Player } from '../player/Player';

const minZoom = 0.25
const maxZoom = 3

export class LobbyScene extends Scene {
    background: GameObjects.Image;
    player: Player;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    zoomLevel: number = 1;
    map: Phaser.Tilemaps.Tilemap;

    constructor() {
        super('LobbyScene');
        this.player = new Player(this, 1500, 1100, 'johnny')
    }


    preload() {
    }

    create() {

        // create the player  
        this.player.createPlayer();


        const map = this.make.tilemap({ key: 'lobby_scene', tileWidth: 32, tileHeight: 32 });
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

            if (obj.type === "wall" || obj.type === "furniture") {

                let wall = null;
                const centerX = obj.x! + (obj.width || 0) / 2;
                const centerY = obj.y! + (obj.height || 0) / 2;

                if (obj.ellipse) {
                    // Create circle collision body
                    const radius = Math.min(obj.width || 32, obj.height || 32) / 2;
                    wall = this.matter.add.circle(centerX, centerY, radius, {
                        isStatic: true,
                        label: obj.type,
                    });
                } else if (obj.polygon) {
                    // Handle polygon objects
                    function getVertices(items: Phaser.Types.Math.Vector2Like[]) {
                        return items.reduce((accumulator, item, index) => {
                            return `${accumulator}${item.x} ${item.y} `;
                        }, "").slice(0, -1);
                    }
                    const vertices = getVertices(obj.polygon);
                    const polygon2 = this.add.polygon(obj.x, obj.y, vertices);
                    const gameObject = this.matter.add.gameObject(polygon2, {
                        isStatic: true,
                        shape: {
                            type: "fromVertices",
                            verts: vertices,
                        },
                    }) as Phaser.Physics.Matter.Image;
                    const body = polygon2.body as MatterJS.BodyType;

                    gameObject.setPosition(polygon2.x + body.centerOffset.x, polygon2.y + body.centerOffset.y);
                    console.log('gameObject polygon## : {{}} =>', (gameObject));

                } else if (obj.rectangle) {
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
                }

            }

            if (obj.name === "StartingPoint" && this.player) {
                this.player.updatePlayerPosition(obj.x!, obj.y!)
            }
            if (obj.name === "FinishPosition" && this.player) {

                const centerX = obj.x! + (obj.width || 0) / 2;
                const centerY = obj.y! + (obj.height || 0) / 2;

                this.matter.add.rectangle(
                    centerX,
                    centerY,
                    obj.width || 32,
                    obj.height || 32,
                    {
                        isStatic: true,
                        label: "FinishPosition",
                        isSensor: true,
                    }
                );
            }
        })

        this.depthZone();
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.setupMouseWheelZoom();

        // this matter world will handle the collision events 
        this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            console.log("collision start event =>", event)

            // if the body collides with one of the zone, the set the 
            // X- Layer(unnamed) depth above the player ?
            console.log("collision start event =>", event)

            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                console.log("collision pair =>", bodyA, bodyB);
                const isZoneCollisionWithPlayer =
                    (bodyA.label === "Player-X" && bodyB.label === "zone")
                    ||
                    (bodyB.label === "Player-X" && bodyA.label === "zone");


                const isCollisionWithFinishPosition =
                    (bodyA.label === "Player-X" && bodyB.label === "FinishPosition") ||
                    (bodyB.label === "Player-X" && bodyA.label === "FinishPosition");

                if (isZoneCollisionWithPlayer) {
                    //const zoneBody = bodyA === this.player?.body ? bodyB : bodyA;
                    console.log("isZone Collision with player =>");
                    console.log("layerObjects =>", layerObjects);
                }
                //const 
                //console.log("isColli")
                if (isCollisionWithFinishPosition) {
                    //EventBus.emit("playerReachedFinish", "You reached the finish position!");
                    console.log("player reached finish position");
                    this.scene.start("RedRoomScene");
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

            if (obj.type === "position" && obj.name === "FinishPosition") {
                const centerX = obj.x! + (obj.width || 0) / 2;
                const centerY = obj.y! + (obj.height || 0) / 2;

                this.matter.add.rectangle(
                    centerX,
                    centerY,
                    obj.width || 32,
                    obj.height || 32,
                    {
                        isStatic: true,
                        label: "FinishPosition",
                        isSensor: true,
                    }
                );
            }
        })
    }
}


