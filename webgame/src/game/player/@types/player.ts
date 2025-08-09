


export interface PlayerData {
    playerID: string;
    playerName: string;
    health: number;
    mana: number;
    coins: number;
    position: PlayerPositionData;
    inventory: PlayerInventoryData;
    currentScene: string;
}

interface PlayerPositionData {
    playerFacingDirection: string;
    playerMoving: boolean;
    x: number;
    y: number;
}

interface PlayerInventoryData {
    itemID: string;
    itemName: string;
}
