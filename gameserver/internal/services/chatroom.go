package services

import (
	"context"
	"encoding/json"
	"log/slog"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"reverie.town/internal/models"
	"reverie.town/internal/repository"
)

type ChatRoomService interface {
	ReadPump(wsConnInfo models.WsConnInfo)
	WritePump(wsConnInfo models.WsConnInfo)
}

func NewChatRoomService(wsRepo repository.WsRepository) ChatRoomService {
	return &chatRoomService{wsRepo: wsRepo}
}

type chatRoomService struct {
	wsRepo repository.WsRepository
}

func (chService *chatRoomService) ReadPump(wsConnInfo models.WsConnInfo) {
	// defer close the connection
	defer func() {
		wsConnInfo.Conn.Close()
		slog.Info("Connection closed", "room", wsConnInfo.RoomID, "client", wsConnInfo.ClientID)
	}()

	for {
		wsMessage := models.WebSocketMessage{}
		err := wsConnInfo.Conn.ReadJSON(&wsMessage)
		slog.Info("messageType", "type", wsMessage.Type)
		slog.Info("message", slog.Any("wsMessage", wsMessage))

		if err != nil {
			slog.Error("Error Reading message", slog.Any("error", err))
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				slog.Info("CLOSING ERROR", slog.Any("error", err))
			}
			break
		}

		// publish message to a topic
		ctx := context.Background()
		chService.wsRepo.PublishMessageToRoom(ctx, wsConnInfo.RoomID, wsConnInfo.ClientID, string(wsMessage.Message))
	}
}

func (chService *chatRoomService) WritePump(wsConnInfo models.WsConnInfo) {
	// defer close the connection
	defer func() {
		wsConnInfo.Conn.Close()
		slog.Info("Connection closed", "room", wsConnInfo.RoomID, "client", wsConnInfo.ClientID)
	}()

	//messageType, message
	// publish message to a topic
	ctx := context.Background()
	msgChan, msgChanErr := chService.wsRepo.ReceiveMessageInRoom(ctx, wsConnInfo.RoomID)

	if msgChanErr != nil {
		// close the connection
		wsConnInfo.Conn.Close()
		slog.Error("receive message error", slog.Any("error", msgChanErr))
	}

	for {
		select {
		case message, ok := <-msgChan:
			if !ok {
				slog.Info("ok false =>", ok)
				return
			}
			slog.Info("message received =>", message)
			broadcastMessage := models.RoomBroadcastMessage{}
			broadcastMessageErr := json.Unmarshal(message.Body, &broadcastMessage)
			if broadcastMessageErr != nil {
				slog.Error("Failed to unmarshal broadcast message", slog.Any("error", broadcastMessageErr))
				return
			}
			messageID := uuid.New().String()
			wsMessage := models.WebSocketMessage{
				ID:        messageID,
				Type:      "message",
				Message:   broadcastMessage.Message,
				Room:      broadcastMessage.RoomID,
				Sender:    broadcastMessage.Client,
				Timestamp: broadcastMessage.Timestamp,
			}

			_, wsMsgMarshalErr := json.Marshal(wsMessage)
			if wsMsgMarshalErr != nil {
				slog.Error("Failed to marshal WebSocket message", wsMsgMarshalErr)
				return
			}
			writeMsgErr := wsConnInfo.Conn.WriteJSON(wsMessage)
			if writeMsgErr != nil {
				slog.Error("Failed to write message", writeMsgErr)
				return
			}

		default:
			//slog.Info("default=>")
		}
	}

}

/*
func (ws *WsConn) readPump() {
}

func (ws *WsConn) writeMessage() {

}
*/
