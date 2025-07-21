package models

import "github.com/gorilla/websocket"

type WsConnInfo struct {
	Conn     *websocket.Conn
	RoomID   string
	ClientID string
}
