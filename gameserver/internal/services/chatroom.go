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
	CloseConnection(wsConnInfo models.WsConnInfo, closeReasonErrMsg string)
}

func NewChatRoomService(wsRepo repository.WsRepository) ChatRoomService {
	return &chatRoomService{wsRepo: wsRepo}
}

type chatRoomService struct {
	wsRepo repository.WsRepository
}

func (chService *chatRoomService) ReadPump(wsConnInfo models.WsConnInfo) {
	// defer close the connection
	ctx := context.Background()

	defer func() {
		slog.Info("READ PUMP: defer close the connection:")
		wsConnInfo.Conn.Close()
		slog.Info("Connection closed", "room", wsConnInfo.RoomID, "client", wsConnInfo.ClientID)

		removePlayerErr := chService.wsRepo.RemovePlayerFromRoom(ctx, wsConnInfo.RoomID, wsConnInfo.ClientID)
		if removePlayerErr != nil {
			slog.Info("Remove Player FROM REDIS Error: ", slog.Any("error", removePlayerErr))
		}
	}()

	addPlayerErr := chService.wsRepo.AddPlayerToRoom(ctx, wsConnInfo.RoomID, wsConnInfo.ClientID)

	if addPlayerErr != nil {
		chService.CloseConnection(wsConnInfo, addPlayerErr.Error())
	}

	for {
		wsMessage := models.WsReadMessage{}
		err := wsConnInfo.Conn.ReadJSON(&wsMessage)
		slog.Info("message", slog.Any("READ MESSAGE: ", wsMessage))

		if err != nil {
			slog.Error("Error Reading Message", slog.Any("ErrorReadingMessage", err))
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				slog.Info("CLOSING ERROR", slog.Any("error", err))
			}
			break
		}

		switch wsMessage.Type {
		case models.TypeMessage:
			pubMsgErr := chService.wsRepo.PublishMessageToRoom(ctx, wsConnInfo.RoomID, wsConnInfo.ClientID, string(wsMessage.Message))
			if pubMsgErr != nil {
				chService.CloseConnection(wsConnInfo, pubMsgErr.Error())
			}

		case models.TypeSendPlayerState:
			pubPlayerStateErr := chService.wsRepo.PublishPlayerStateToRoom(ctx, wsConnInfo.RoomID, wsConnInfo.ClientID, wsMessage.PlayerState)
			if pubPlayerStateErr != nil {
				chService.CloseConnection(wsConnInfo, pubPlayerStateErr.Error())
			}
		}

	}
}

func (chService *chatRoomService) WritePump(wsConnInfo models.WsConnInfo) {

	ctx := context.Background()

	// defer close the connection
	defer func() {
		slog.Info("WRITE PUMP: defer close the connection:")
		wsConnInfo.Conn.Close()
		slog.Info("Connection closed", "room", wsConnInfo.RoomID, "client", wsConnInfo.ClientID)

		removePlayerErr := chService.wsRepo.RemovePlayerFromRoom(ctx, wsConnInfo.RoomID, wsConnInfo.ClientID)
		if removePlayerErr != nil {
			slog.Info("Remove Player FROM REDIS Error: ", slog.Any("error", removePlayerErr))
		}
	}()

	msgChan, msgChanErr := chService.wsRepo.ReceiveMessageInRoom(ctx, wsConnInfo.RoomID)
	if msgChanErr != nil {
		chService.CloseConnection(wsConnInfo, msgChanErr.Error())
	}

	playerStateChan, playerStateChanErr := chService.wsRepo.ReceivePlayerStateInRoom(ctx, wsConnInfo.RoomID)
	if playerStateChanErr != nil {
		chService.CloseConnection(wsConnInfo, playerStateChanErr.Error())
	}

	userInfoChan, userInfoChanErr := chService.wsRepo.ReceiveUsersInfoInRoom(ctx, wsConnInfo.RoomID)
	if userInfoChanErr != nil {
		// close the connection
		chService.CloseConnection(wsConnInfo, userInfoChanErr.Error())
	}

	// publish user info
	publishUserInfoErr := chService.wsRepo.PublishUserInfoToRoom(ctx, wsConnInfo.RoomID, wsConnInfo.ClientID)
	if publishUserInfoErr != nil {
		chService.CloseConnection(wsConnInfo, publishUserInfoErr.Error())
		//CloseConnection(wsConnInfo)
	}

	for {
		select {
		case message, ok := <-msgChan:
			if !ok {
				slog.Info("ok false =>", ok)
				return
			}
			//slog.Info("message received =>", message)
			broadcastMessage := models.RMQRoomBroadcastMessage{}
			broadcastMessageErr := json.Unmarshal(message.Body, &broadcastMessage)
			if broadcastMessageErr != nil {
				slog.Error("Failed to unmarshal broadcast message", slog.Any("error", broadcastMessageErr))
				return
			}
			messageID := uuid.New().String()
			wsMessage := models.WsWriteMessage{
				ID:        messageID,
				Type:      "message",
				Message:   broadcastMessage.Message,
				Room:      broadcastMessage.RoomID,
				Sender:    broadcastMessage.Client,
				Timestamp: broadcastMessage.Timestamp,
			}

			writeMsgErr := wsConnInfo.Conn.WriteJSON(wsMessage)
			if writeMsgErr != nil {
				slog.Error("Failed to write message", writeMsgErr)
				return
			}

		case playerStateMsg, ok := <-playerStateChan:
			if !ok {
				slog.Info("ok false =>", ok)
				return
			}
			//slog.Info("message received", slog.Any("playerStateMsg", playerStateMsg))
			messageID := uuid.New().String()
			rmqMessage := models.RMQRoomBroadcastMessage{}
			rmqMessageErr := json.Unmarshal(playerStateMsg.Body, &rmqMessage)
			if rmqMessageErr != nil {
				slog.Error("Failed to unmarshal broadcast message", slog.Any("error", rmqMessageErr))
				return
			}
			wsMessage := models.WsWriteMessage{
				ID:        messageID,
				Type:      models.TypeReceivePlayerState,
				Room:      rmqMessage.RoomID,
				Sender:    rmqMessage.Client,
				Timestamp: rmqMessage.Timestamp,
				Data:      rmqMessage.PlayerState,
			}

			writeMsgErr := wsConnInfo.Conn.WriteJSON(wsMessage)
			if writeMsgErr != nil {
				slog.Error("Failed to write message", writeMsgErr)
				return
			}

		case userInfoMsg, ok := <-userInfoChan:
			if !ok {
				slog.Info("ok false =>", ok)
				return
			}
			rmqMessage := models.RMQRoomBroadcastMessage{}
			rmqMessageErr := json.Unmarshal(userInfoMsg.Body, &rmqMessage)
			if rmqMessageErr != nil {
				slog.Error("Failed to unmarshal user info message", slog.Any("error", rmqMessageErr))
				return
			}
			wsMessage := models.WsWriteMessage{
				Type:      models.TypeUserJoined,
				Room:      rmqMessage.RoomID,
				Sender:    rmqMessage.Client,
				Timestamp: rmqMessage.Timestamp,
				Data:      rmqMessage.RoomPlayers,
			}
			slog.Info("userInfoMsg received", slog.Any("wsMessage", wsMessage))

			writeMsgErr := wsConnInfo.Conn.WriteJSON(wsMessage)
			if writeMsgErr != nil {
				slog.Error("Failed to write user info message", writeMsgErr)
				return
			}

		}
	}

}

func (chService *chatRoomService) CloseConnection(wsConnInfo models.WsConnInfo, closeReasonErrMsg string) {
	wsConnInfo.Conn.Close()
	// remove the player from the player actually:
	ctx := context.Background()
	removePlayerErr := chService.wsRepo.RemovePlayerFromRoom(ctx, wsConnInfo.RoomID, wsConnInfo.ClientID)
	if removePlayerErr != nil {
		slog.Info("Remove Player FROM REDIS Error: ", slog.Any("error", removePlayerErr))
	}
	slog.Info("Connection closed", "room", wsConnInfo.RoomID, "client", wsConnInfo.ClientID)
	slog.Info("reason: ", closeReasonErrMsg)
}
