


export interface SceneInitData {
    mapKey: string;
    spawnKey?: string;
    playerDirection?: string;
    previousScene?: string;
    playerOffset?: { x: number; y: number };
}

export interface SpawnPoint {
    name: string;
    x: number;
    y: number;
}

export interface Portal {
    name: string;
    class?: string;
    direction?: string;
    targetMap: string;
    // targetScene represents the mapKey
    targetScene: string;
    targetSpawn: string;
}