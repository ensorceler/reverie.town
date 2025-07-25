package models

import "github.com/gorilla/websocket"

type WsConnInfo struct {
	Conn     *websocket.Conn
	RoomID   string
	ClientID string
}

type WebSocketMessageType string

const (
	TypeJoin       WebSocketMessageType = "join"
	TypeMessage    WebSocketMessageType = "message"
	TypeUserJoined WebSocketMessageType = "user_joined"
	TypeUserLeft   WebSocketMessageType = "user_left"
	TypeError      WebSocketMessageType = "error"
)

type WebSocketMessage struct {
	ID        string               `json:"id,omitempty"`        // Optional, used for tracking messages
	Type      WebSocketMessageType `json:"type"`                // Required
	Data      interface{}          `json:"data,omitempty"`      // Optional
	Message   string               `json:"message"`             // Optional
	Sender    string               `json:"sender,omitempty"`    // Optional
	Timestamp string               `json:"timestamp,omitempty"` // Optional
	Room      string               `json:"room,omitempty"`      // Optional
}

// used in rabbitmq exchange to publish information about the room
type RoomBroadcastMessage struct {
	Message   string `json:"message"`
	RoomID    string `json:"room_id"`
	Client    string `json:"client"`
	Timestamp string `json:"timestamp"`
}

/*
Example JSON Requests/Responses:

// Join Room Request
{
  "type": "join",
  "room": "game-lobby-1",
  "sender": "player123"
}

// Join Room Success Response
{
  "type": "user_joined",
  "message": "Welcome to game-lobby-1",
  "room": "game-lobby-1",
  "sender": "server",
  "timestamp": "2023-11-15T14:30:00Z"
}

// Chat Message
{
  "type": "message",
  "message": "Hello everyone!",
  "room": "game-lobby-1",
  "sender": "player123",
  "timestamp": "2023-11-15T14:31:22Z"
}

// Error Response
{
  "type": "error",
  "message": "Room is full",
  "timestamp": "2023-11-15T14:32:10Z"
}

// User Left Notification
{
  "type": "user_left",
  "message": "player456 has left",
  "room": "game-lobby-1",
  "sender": "server",
  "timestamp": "2023-11-15T14:35:00Z"
}
*/
