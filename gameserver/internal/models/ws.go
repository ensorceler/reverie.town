package models

import "github.com/gorilla/websocket"

type WsConnInfo struct {
	Conn     *websocket.Conn
	RoomID   string
	ClientID string
}
package models

type WebSocketMessageType string

const (
	TypeJoin       WebSocketMessageType = "join"
	TypeMessage    WebSocketMessageType = "message"
	TypeUserJoined WebSocketMessageType = "user_joined"
	TypeUserLeft   WebSocketMessageType = "user_left"
	TypeError      WebSocketMessageType = "error"
)

type WebSocketMessage struct {
	Type      WebSocketMessageType `json:"type"`                // Required
	Data      interface{}          `json:"data,omitempty"`       // Optional
	Message   string               `json:"message,omitempty"`    // Optional
	Sender    string               `json:"sender,omitempty"`     // Optional
	Timestamp string               `json:"timestamp,omitempty"`  // Optional
	Room      string               `json:"room,omitempty"`       // Optional
}
