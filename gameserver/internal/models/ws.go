package models

import (
	"github.com/gorilla/websocket"
)

type WsConnInfo struct {
	Conn     *websocket.Conn
	RoomID   string
	ClientID string
}

type WebSocketMessageType string

const (
	TypeJoin               WebSocketMessageType = "join"
	TypeMessage            WebSocketMessageType = "message"
	TypeSendPlayerState    WebSocketMessageType = "sendPlayerState"
	TypeReceivePlayerState WebSocketMessageType = "playerState"

	TypeUserJoined WebSocketMessageType = "userJoined"
	TypeUserLeft   WebSocketMessageType = "userLeft"
	TypeError      WebSocketMessageType = "error"
)

// Reads the incoming message from the websocket connection
type WsReadMessage struct {
	//ID      string               `json:"id,omitempty"`   // Optional, used for tracking messages
	Type        WebSocketMessageType `json:"type"`                  // Required
	PlayerState PlayerStateData      `json:"playerState,omitempty"` // Optional
	Message     string               `json:"message,omitempty"`     // Optional
}

// writes the outgoing message to the websocket connection
type WsWriteMessage struct {
	ID        string               `json:"id,omitempty"`        // Optional, used for tracking messages
	Type      WebSocketMessageType `json:"type"`                // Required
	Data      interface{}          `json:"data,omitempty"`      // Optional
	Message   string               `json:"message"`             // Optional
	Sender    string               `json:"sender,omitempty"`    // Optional
	Timestamp string               `json:"timestamp,omitempty"` // Optional
	Room      string               `json:"room,omitempty"`      // Optional
}

// used in rabbitmq exchange to publish information about the room
type RMQRoomBroadcastMessage struct {
	Message     string          `json:"message,omitempty"`
	RoomID      string          `json:"roomID"`
	Client      string          `json:"client"`
	Timestamp   string          `json:"timestamp"`
	PlayerState PlayerStateData `json:"playerState,omitempty"`
	RoomPlayers []RoomPlayer    `json:"roomPlayers,omitempty"`
}

type PlayerStateData struct {
	PlayerMoving          bool           `json:"playerMoving,omitempty"`
	PlayerFacingDirection string         `json:"playerFacingDirection,omitempty"`
	PlayerPosition        PlayerPosition `json:"playerPosition,omitempty"`
	PlayerCurrentScene    string         `json:"playerCurrentScene,omitempty"`
}

type PlayerPosition struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type RoomPlayer struct {
	ClientID    string          `json:"clientId" redis:"clientId"`
	RoomID      string          `json:"roomId" redis:"roomId"`
	JoinedAt    string          `json:"joinedAt" redis:"joinedAt"`
	LastSeen    string          `json:"lastSeen" redis:"lastSeen"`
	PlayerState PlayerStateData `json:"playerState" redis:"playerState"`
}
