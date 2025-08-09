import { Player } from "../player/Player";
import { RemotePlayer } from "../player/RemotePlayer";


interface GameState {
    players: PlayerData[]
}

interface PlayerData {
    playerID: string;
    health: number;
    position: { x: number, y: number };
    currentScene: string;
}




export class GameDataManager {
    gameState: GameState;
    game: Phaser.Game;
    //gameState
    constructor(game: Phaser.Game) {
        this.game = game;
    }

    initializeGameState() {
        //this.game.registry.set('players', );
    }

    addPlayerToGame(player: Player | RemotePlayer) {
        let players = this.game.registry.values.players;
        if (players) {
            players.push({
                playerID: player.playerName,
                playerType: player instanceof Player ? "local" : "remote",
                roomKey: "test",
                player: player
            })
        }
        else {
            this.game.registry.set('players', [{
                playerID: player.playerName,
                playerType: player instanceof Player ? "local" : "remote",
                roomKey: "test",
                player: player
            }]);
        }

    }


    updatePlayerData(playerID: string, health: number, position: { x: number, y: number }, currentScene: string) {
        const playerData: PlayerData = {
            playerID,
            health,
            position,
            currentScene
        };

        // Check if player already exists
        const existingPlayerIndex = this.gameState.players.findIndex(p => p.playerID === playerID);
        if (existingPlayerIndex !== -1) {
            // Update existing player data
            this.gameState.players[existingPlayerIndex] = playerData;
        } else {
            // Add new player data
            this.gameState.players.push(playerData);
        }

        // Update the game registry
        this.game.registry.set('gameState', this.gameState);
    }

}        