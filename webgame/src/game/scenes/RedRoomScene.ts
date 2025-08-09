import { PlayerStateResponse, RoomPlayerResponse, WebSocketMessage } from "@/@types/websocket";
import { PhaserEventBus } from "../events/PhaserEventBus";
import { Player } from "../player/Player";
import { RemotePlayer } from "../player/RemotePlayer";
import { GameDataManager } from "../state/GameDataManager";


export class RedRoomScene extends Phaser.Scene {
    player: Player;
    zoomLevel: number = 1;
    map: Phaser.Tilemaps.Tilemap;
    layerObjects: Phaser.Tilemaps.TilemapLayer[] = [];
    gameDataManager: GameDataManager;
    collisionObjects = [];
    spawnPoints: any = [];
    constructor() {
        super({ key: 'RedRoomScene' });
    }

    preload() {


    }

    create() {

        this.gameDataManager = new GameDataManager(this.game);

        const map = this.make.tilemap({ key: 'redroom_scene', tileWidth: 32, tileHeight: 32 });
        this.map = map;


        const tilesets: any = [
            //map.addTilesetImage('1_Generic_Shadowless32x32', '1_Generic_Shadowless32x32'),
            map.addTilesetImage('Room_Builder_32x32', 'Room_Builder_32x32'),
        ];

        // create layers from the tilemap and tilesets
        map.layers.forEach((layer: any) => {
            const layerData = map.createLayer(layer.name, tilesets, 0, 0);
            if (layerData) {
                this.layerObjects.push(layerData);
                console.log("Created layer:", layer.name, "Has collision:", layerData.layer.collideIndexes.length > 0);
            }
        })

        this.handleCollision();
        this.handleZones();
        this.handleCollisionEvents();




        PhaserEventBus.on("userJoined", (wsMessage: WebSocketMessage) => {
            console.log("userJoined event received:", wsMessage);
            if (wsMessage?.data) {
                wsMessage?.data?.forEach((player: RoomPlayerResponse) => {
                    if (player.clientId === localStorage.getItem("client") && !this.registry.get('clientPlayer')) {
                        console.log("create client Player=>");

                        this.player = new Player(this, 100, 100, player.clientId);
                        this.player.createPlayer();
                        this.registry.set('clientPlayer', wsMessage.sender);
                        this.gameDataManager.addPlayerToGame(this.player);

                        if (this.spawnPoints) {
                            this.player.updatePlayerPosition(this.spawnPoints[0].x, this.spawnPoints[0].y)
                        }

                    } else if (player.clientId !== localStorage.getItem("client")) {
                        // Remote player 
                        console.log("create remote player")
                        const remotePlayer = new RemotePlayer(this, 100, 100, player.clientId);
                        remotePlayer.createPlayer();
                        this.gameDataManager.addPlayerToGame(remotePlayer);

                        if (player.playerState.playerPosition.x) {
                            remotePlayer.updatePlayerPosition(player.playerState.playerPosition.x, player.playerState.playerPosition.y)
                        } else {
                            remotePlayer.updatePlayerPosition(this.spawnPoints[1].x, this.spawnPoints[1].y)
                        }
                    }
                })
            }

            // spawn the player 
        })

        PhaserEventBus.on("playerState", (wsMessage: WebSocketMessage) => {
            const playerID = wsMessage.sender;
            const playersState = this.game.registry.values.players;
            // keep a state inteface  
            playersState.forEach((player: any) => {
                if (player.playerID === playerID && player.playerType === "remote") {
                    console.log("update remote##=>", player, wsMessage)
                    player.player.updateRemotePlayerMovement(wsMessage.data);
                }
            })

        })
    }


    update() {
        // do the update in game loop
        if (this.registry.get('clientPlayer')) {
            this.player.updatePlayerMovement();
        }

    }

    handleCollision() {

        let collisionLayer = this.map.getObjectLayer("Collision");
        collisionLayer?.objects.forEach((obj: Phaser.Types.Tilemaps.TiledObject) => {
            // Handle wall and furniture objects

            console.log("Processing object:", obj.name, obj.type, obj.x, obj.y, obj.width, obj.height);

            if (obj.type === "wall" || obj.type === "furniture") {
                //console.log('Processing collision object:', obj);

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
                        render: {
                            visible: true,
                            // yellow color fill
                            fillColor: 0xffff00, // Yellow fill 
                            //strokeStyle: 'orange',
                            //lineWidth: 2
                        }
                    });
                    console.log(`Created circle ${obj.type} at (${centerX}, ${centerY}) with radius ${radius}`);

                    console.log('collision: {{}} =>', (wall));
                    //console.log('collision: {{body ID}} =>', (wall as any).body.id);
                } else if (obj.polygon) {

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
                            render: {
                                visible: true,
                                fillColor: 0x0000ff, // Blue fill
                            }
                        }
                    );
                    console.log(`Created rectangle ${obj.type} at (${centerX}, ${centerY}) size ${obj.width}x${obj.height}`);
                    console.log('collision: {{}} =>', (wall));
                    //console.log('collision: {{body ID}} =>', (wall as any).body.id);
                }

            }

        })
    }

    handleZones() {

        let zoneLayer = this.map.getObjectLayer("Zone")
        console.log('zoneLayer =>', zoneLayer);

        zoneLayer?.objects.forEach((obj: Phaser.Types.Tilemaps.TiledObject) => {

            //console.log("obje",obj.)
            if (obj.name === "EndingPosition" && this.player) {

                const centerX = obj.x! + (obj.width || 0) / 2;
                const centerY = obj.y! + (obj.height || 0) / 2;

                this.matter.add.rectangle(
                    centerX,
                    centerY,
                    obj.width || 32,
                    obj.height || 32,
                    {
                        isStatic: true,
                        label: "EndingPosition",
                        isSensor: true,
                    }
                );
                console.log(`Created rectangle ${obj.type} at (${centerX}, ${centerY}) size ${obj.width}x${obj.height}`);
            }
            if (obj.type === "spawnPosition") {
                const centerX = obj.x! + (obj.width || 0) / 2;
                const centerY = obj.y! + (obj.height || 0) / 2;

                this.spawnPoints.push({ x: centerX, y: centerY });
                console.log(`Spawn point added at (${centerX}, ${centerY})`);
            }
        })

    }

    handleCollisionEvents() {

        this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            console.log("collision start event =L>", event)

            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                console.log("DETAILED COLLISION INFO:");
                console.log("Body A - ID:", bodyA.id, "Label:", bodyA.label, "Position:", bodyA.position, "GameObject:", bodyA.gameObject);
                console.log("Body B - ID:", bodyB.id, "Label:", bodyB.label, "Position:", bodyB.position, "GameObject:", bodyB.gameObject);

                // Check if this is a wall collision
                if ((bodyA.label === "Player-X" && bodyB.label === "wall") ||
                    (bodyB.label === "Player-X" && bodyA.label === "wall")) {
                    const wallBody = bodyA.label === "wall" ? bodyA : bodyB;
                    console.log("WALL COLLISION DETECTED!");
                    console.log("Wall Body Details:", {
                        id: wallBody.id,
                        position: wallBody.position,
                        bounds: wallBody.bounds,
                        vertices: wallBody.vertices
                    });

                    // List all bodies in the world to compare
                    console.log("ALL BODIES IN WORLD:");
                    const allBodies = this.matter.world.getAllBodies();
                    allBodies.forEach((body, index) => {
                        console.log(`Body ${index}: ID=${body.id}, Label=${body.label}, Position=${body.position.x},${body.position.y}`);
                    });
                }

                const isZoneCollisionWithPlayer =
                    (bodyA.label === "Player-X" && bodyB.label === "zone")
                    ||
                    (bodyB.label === "Player-X" && bodyA.label === "zone");

                const isCollisionWithFinishPosition =
                    (bodyA.label === "Player-X" && bodyB.label === "EndingPosition") ||
                    (bodyB.label === "Player-X" && bodyA.label === "EndingPosition");

                if (isCollisionWithFinishPosition) {
                    this.scene.start("LobbyScene");
                }
            });
        })

        this.matter.world.on('collisionend', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => { })

    }
}