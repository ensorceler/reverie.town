
import { Portal, SceneInitData, SpawnPoint } from "@/@types/game/scene";
import { Player } from "../player/Player";
import { getCustomPropertyFromTiledObject } from "../utils/tiled";
import { DEPTH } from "../constants/depth-managment";



export class ExteriorScene extends Phaser.Scene {
    player: Player;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    zoomLevel: number = 1;
    map: Phaser.Tilemaps.Tilemap;
    mapKey: string;
    spawnKey: string;
    initData: SceneInitData;
    spawnPoints: SpawnPoint[] = [];
    portals: Portal[] = [];

    constructor() {
        // scene_key -> exterior_scene
        super('exterior_scene');
    }

    init(data: SceneInitData) {
        this.initData = data;
        this.mapKey = data.mapKey;
        this.spawnKey = data.spawnKey || "entry_spawn";
        console.log('ExteriorScene initialized with:', data);
    }

    preload() {

    }

    create() {

        const map = this.make.tilemap({ key: this.mapKey, tileWidth: 32, tileHeight: 32 });
        this.map = map;

        console.log('Map created:', map);
        console.log('Map dimensions:', map.width, '×', map.height, 'tiles');
        console.log('Map pixel size:', map.widthInPixels, '×', map.heightInPixels, 'pixels');
        console.log('Tile size:', map.tileWidth, '×', map.tileHeight, 'pixels');

        this.setupTileMapLayers();
        // setup collision 
        this.setupCollisionObjects();
        // collision events 
        this.setupCollisionEvents();
        // zone objects 
        this.setupZoneObjects();
        // map zoom controls with input
        this.setupMapZoomControls();

        // create the player  
        this.player = new Player(this, 100, 100, "Player");
        this.player.createPlayer();

        let flag = false;
        this.spawnPoints.forEach((spawnPoint: SpawnPoint) => {
            //console.log("found spawn position for player", spawnPoint)
            if (this.spawnKey === spawnPoint.name) {
                this.player.updatePlayerPosition(spawnPoint.x, spawnPoint.y)
                flag = true;
                return;
            }
        })
        // just a hack okay, not good
        if (!flag) {
            this.spawnPoints.forEach((spawnPoint: SpawnPoint) => {
                //console.log("found spawn position for player", spawnPoint)
                if (spawnPoint.name === "") {
                    this.player.updatePlayerPosition(spawnPoint.x, spawnPoint.y)
                    return;
                }
            })
        }



    }


    update() {
        // Manual frame switching
        this.player.updatePlayerMovement()
    }

    // handle setup all the tile layers
    setupTileMapLayers() {

        const map = this.map;
        // Add all tilesets to the map
        const tilesets: any = [
            map.addTilesetImage('1_Terrains_and_Fences_32x32', '1_Terrains_and_Fences_32x32'),
            map.addTilesetImage('2_City_Terrains_32x32', '2_City_Terrains_32x32'),
            map.addTilesetImage('4_Generic_Buildings_32x32', '4_Generic_Buildings_32x32'),
            map.addTilesetImage('7_Villas_32x32', '7_Villas_32x32'),
            map.addTilesetImage('17_Garden_32x32', '17_Garden_32x32'),
        ];

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
            if (getCustomPropertyFromTiledObject(layerData, "above_player")) {
                layer?.setDepth(DEPTH.FOREGROUND_LAYER_DEPTH);
            } else {
                layer?.setDepth(DEPTH.LAYER_DEPTH);
            }
        }

    }

    setupCollisionObjects() {

        //console.log("object layers", this.map.getObjectLayerNames())
        console.log("collision layer =>", this.map.getObjectLayer("Collision"))
        let collisionLayer = this.map.getObjectLayer("Collision");

        collisionLayer?.objects.forEach((obj: Phaser.Types.Tilemaps.TiledObject) => {

            if (obj.type === "wall" || obj.type === "obstruction") {

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
                    /*
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
                        */
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
        })

    }

    setupMapZoomControls() {

        this.cursors = this.input.keyboard!.createCursorKeys();
        // Calculate zoom to ensure minimum coverage

        //this.cameras.main.setZoom(minZoom);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);


        //this.cameras.main.roundPixels = true;
        // Listen for mouse wheel events
        /*
        this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: any[], deltaX: number, deltaY: number, deltaZ: number) => {
            // deltaY > 0 = scroll down (zoom out)
            // deltaY < 0 = scroll up (zoom in)

            const zoomStep = 0.1;

            if (deltaY > 0) {
                // Zoom out
                this.zoomLevel = Math.max(0.5, this.zoomLevel - zoomStep);
            } else {
                // Zoom in
                this.zoomLevel = Math.min(3, this.zoomLevel + zoomStep);
            }

            // Apply zoom to camera
            this.cameras.main.setZoom(this.zoomLevel);

            console.log(`Zoom level: ${this.zoomLevel.toFixed(2)}x`);
        });
        */
    }

    setupZoneObjects() {
        //let zoneLayer=
        let zoneLayer = this.map.getObjectLayer("Zone")
        zoneLayer?.objects.forEach((obj: Phaser.Types.Tilemaps.TiledObject) => {
            if (obj.type === "zone") {

                if (obj.polygon) {
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
                        isSensor: true,
                        shape: {
                            type: "fromVertices",
                            verts: vertices,
                        },
                        label: obj.type
                    }) as Phaser.Physics.Matter.Image;
                    const body = polygon2.body as MatterJS.BodyType;
                    gameObject.setPosition(polygon2.x + body.centerOffset.x, polygon2.y + body.centerOffset.y);
                    console.log('zone object polygon## : {{}} =>', (gameObject));
                }

            }

            if (obj.type === "spawn") {
                let X = 0;
                let Y = 0;
                X = obj.x! + (obj.width || 0) / 2;
                Y = obj.y! + (obj.height || 0) / 2;
                // spawn can be rectangle or point 
                if (obj.rectangle) {
                }
                if (obj.point) {
                }
                this.spawnPoints.push({ x: X, y: Y, name: obj.name });
            }

            if (obj.type === "portal") {
                // portals are rectangles for now, but we have to make this logic extensible
                const centerX = obj.x! + (obj.width || 0) / 2;
                const centerY = obj.y! + (obj.height || 0) / 2;

                // create invisible body
                const gameObj = this.matter.add.rectangle(
                    centerX,
                    centerY,
                    obj.width || 32,
                    obj.height || 32,
                    {
                        isStatic: true,
                        isSensor: true,
                        label: obj.type,
                        //  render: { visible: false }
                    }
                );

                const portal: Portal = {
                    name: obj.name,
                    class: obj.type,
                    targetScene: getCustomPropertyFromTiledObject(obj, "target_scene"),
                    targetMap: getCustomPropertyFromTiledObject(obj, "target_map"),
                    targetSpawn: getCustomPropertyFromTiledObject(obj, "target_spawn"),
                    direction: getCustomPropertyFromTiledObject(obj, "direction"),
                }
                // @ts-ignore
                gameObj.portalConfig = portal;
                this.portals.push(portal);
                console.log("object #=>", obj)
                console.log("portal #=>", portal,)
                console.log("gameobj #=>", gameObj)
                console.log("total portals #", this.portals)
            }
        })
    }


    setupCollisionEvents() {
        // this matter world will handle the collision events 
        this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            console.log("collision start event =>", event)
            event.pairs.forEach((pair) => {

                const { bodyA, bodyB } = pair;

                const isPortalCollisionWithPlayer =
                    (bodyA.label?.startsWith("player_") && bodyB.label === "portal")
                    ||
                    (bodyB.label?.startsWith("player_") && bodyA.label === "portal");

                const portal = bodyB.label === "portal" ? bodyB : bodyA;
                console.log("isPortalCollision with player =>", isPortalCollisionWithPlayer);
                if (isPortalCollisionWithPlayer) {
                    // switch the scene 
                    const portalConfig: Portal = (portal as any)?.portalConfig;
                    console.log("portal ", portal, portalConfig);
                    if (portal) {
                        this.scene.start(portalConfig?.targetScene, {
                            mapKey: portalConfig.targetMap,
                            spawnKey: portalConfig.targetSpawn
                        })
                    }
                }
            });
        })
        this.matter.world.on('collisionend', (event: any) => {
            console.log("collision end event =>", event)

        })
    }
}