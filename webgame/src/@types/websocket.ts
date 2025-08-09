
export interface WebSocketMessage {
    id?: string;
    type: string;
    data?: any
    message?: string
    sender?: string
    timestamp?: string
    room?: string
}

export interface UseWebSocketOptions {
    wsUrl?: string
    reconnectDelay?: number
    maxReconnectAttempts?: number
}




export interface RoomPlayerResponse {
    clientId: string;
    roomId: string;
    joinedAt: string;
    lastSeen: string;
    playerState: PlayerState;
}

export interface PlayerState {
    health?: number;
    inventory?: any;
    playerMoving: boolean;
    playerFacingDirection: string;
    playerPosition: { x: number; y: number };
    playerCurrentScene: string;
}

export type PlayerStateResponse = PlayerState
