package handlers

import (
	"log"
	"log/slog"
	"net/http"

	"github.com/gorilla/websocket"
	"reverie.town/internal/models"
	"reverie.town/internal/response"
	"reverie.town/internal/services"
)

type WebsocketsHandler interface {
	ChatHandler(w http.ResponseWriter, r *http.Request)
}

type wsHandler struct {
	chatRoomService services.ChatRoomService
}

func NewWebsocketHandler(wsChatRoomService services.ChatRoomService) WebsocketsHandler {
	return &wsHandler{chatRoomService: wsChatRoomService}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func (wh *wsHandler) ChatHandler(w http.ResponseWriter, r *http.Request) {
	//r.Param("roomID")
	roomID := r.URL.Query().Get("roomID")
	client := r.URL.Query().Get("client")

	slog.Info("roomID: ", roomID)
	slog.Info("client: ", client)

	if roomID == "" || client == "" {
		//http.Error(w, "Room ID and Client Name are required", http.StatusBadRequest)
		response.SendJSONResponse(w, http.StatusBadRequest, nil)
		return
	}
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	wsConnInfo := models.WsConnInfo{
		//chan type
		Conn:     conn,
		RoomID:   roomID,
		ClientID: client,
	}

	go wh.chatRoomService.ReadPump(wsConnInfo)
	go wh.chatRoomService.WritePump(wsConnInfo)

}
