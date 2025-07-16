package handlers

import (
	"log"
	"log/slog"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type WsConn struct {
	conn *websocket.Conn
}

func ChatHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	//... Use conn to send and receive messages.
	ws := WsConn{
		conn: conn,
	}
	go ws.readMessage()
	go ws.writeMessage()
}

func (ws *WsConn) readMessage() {
	for {
		messageType, message, err := ws.conn.ReadMessage()
		slog.Info("messageType, ", messageType)
		slog.Info("message ", string(message))

		if err != nil {
			slog.Error("Error reading message", slog.Any("error", err))
			if wsCloseErr := ws.conn.Close(); wsCloseErr != nil {
				slog.Error("Error closing connection", wsCloseErr)
			}
		}

		//messageType, message

		if err := ws.conn.WriteMessage(messageType, message); err != nil {
			slog.Error("Error writing message", err)
		}
	}
}

func (ws *WsConn) writeMessage() {

}
