package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"time"

	"github.com/jmoiron/sqlx"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/redis/go-redis/v9"
	"reverie.town/internal/models"
)

type WsRepository interface {
	AddPlayerToRoom(ctx context.Context, roomID string, client string) (err error)
	RemovePlayerFromRoom(ctx context.Context, roomID string, client string) (err error)
	GetPlayersInRoom(ctx context.Context, roomID string) ([]models.RoomPlayer, error)
	UpdatePlayerStateInRoom(ctx context.Context, roomID string, client string, playerState models.PlayerStateData) error

	// handle chatmessages in room
	PublishMessageToRoom(ctx context.Context, roomID string, client string, message string) error
	ReceiveMessageInRoom(ctx context.Context, roomID string) (<-chan amqp.Delivery, error)

	// handle users info in room
	PublishUserInfoToRoom(ctx context.Context, roomID string, client string) error
	ReceiveUsersInfoInRoom(ctx context.Context, roomID string) (<-chan amqp.Delivery, error)

	// handle player state in room
	PublishPlayerStateToRoom(ctx context.Context, roomID string, clientID string, playerState models.PlayerStateData) error
	ReceivePlayerStateInRoom(ctx context.Context, roomID string) (<-chan amqp.Delivery, error)
}

// type  wsinterface
type wsRepo struct {
	db       *sqlx.DB
	ampqConn *amqp.Connection
	rdb      *redis.Client
}

func NewWsRepository(db *sqlx.DB, amqpConn *amqp.Connection, rdb *redis.Client) WsRepository {
	return &wsRepo{db: db, ampqConn: amqpConn, rdb: rdb}
}

func (wR *wsRepo) PublishMessageToRoom(ctx context.Context, roomID string, client string, message string) error {

	ch, chErr := wR.ampqConn.Channel()
	if chErr != nil {
		slog.Error("Failed to open a channel", chErr)
		return chErr
	}
	// defer close the channel in publish
	defer ch.Close()

	exchErr := ch.ExchangeDeclare(
		"room_exchange", // name
		"topic",         // type
		true,            // durable
		false,           // auto-deleted
		false,           // internal
		false,           // no-wait
		nil,             // arguments
	)
	if exchErr != nil {
		slog.Error("Failed to declare an exchange", exchErr)
		return exchErr
	}

	roomMessage := models.RMQRoomBroadcastMessage{
		Message:   message,
		RoomID:    roomID,
		Client:    client,
		Timestamp: time.Now().Format(time.RFC3339),
	}

	roomMessageBytes, err := json.Marshal(roomMessage)
	if err != nil {
		slog.Error("Failed to marshal room message", err)
		return err
	}

	publishErr := ch.PublishWithContext(ctx,
		"room_exchange",                   // exchange
		fmt.Sprintf("%v.message", roomID), // routing key
		false,                             // mandatory
		false,                             // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        roomMessageBytes,
		})

	if publishErr != nil {
		slog.Error("Failed to declare an exchange", publishErr)
	}

	//[failOnError(err, "Failed to publish a message")
	return nil
}

func (wR *wsRepo) ReceiveMessageInRoom(ctx context.Context, roomID string) (<-chan amqp.Delivery, error) {
	ch, chErr := wR.ampqConn.Channel()
	if chErr != nil {
		slog.Error("Failed to open a channel", chErr)
	}

	exchErr := ch.ExchangeDeclare(
		"room_exchange", // name
		"topic",         // type
		true,            // durable
		false,           // auto-deleted
		false,           // internal
		false,           // no-wait
		nil,             // arguments
	)
	if exchErr != nil {
		slog.Error("Failed to declare an exchange", exchErr)
	}

	q, qErr := ch.QueueDeclare(
		"",    // name
		false, // durable
		true,  // delete when unused
		true,  // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if qErr != nil {
		slog.Error("Failed to declare a queue", qErr)
	}
	//failOnError(err, "Failed to declare a queue")

	qBindErr := ch.QueueBind(
		q.Name,                            // queue name
		fmt.Sprintf("%v.message", roomID), // routing key
		"room_exchange",                   // exchange
		false,
		nil)
	//failOnError(err, "Failed to bind a queue")
	if qBindErr != nil {
		slog.Error("Failed to declare a queue", qBindErr)
	}

	msgChan, msgErr := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto ack
		false,  // exclusive
		false,  // no local
		false,  // no wait
		nil,    // args
	)

	if msgErr != nil {
		//l
		slog.Error("Failed to consume a queue", msgErr)
	}
	return msgChan, nil
}

func (wR *wsRepo) PublishPlayerStateToRoom(ctx context.Context, roomID string, clientID string, playerState models.PlayerStateData) error {

	ch, chErr := wR.ampqConn.Channel()
	if chErr != nil {
		slog.Error("Failed to open a channel", chErr)
	}
	// defer close the channel in publish
	defer ch.Close()

	exchErr := ch.ExchangeDeclare(
		"room_exchange", // name
		"topic",         // type
		true,            // durable
		false,           // auto-deleted
		false,           // internal
		false,           // no-wait
		nil,             // arguments
	)
	if exchErr != nil {
		slog.Error("Failed to declare an exchange", exchErr)
	}
	outgoingMsg := models.RMQRoomBroadcastMessage{
		RoomID:      roomID,
		Client:      clientID,
		Timestamp:   time.Now().Format(time.RFC3339),
		PlayerState: playerState,
	}
	outgoingMsgBytes, err := json.Marshal(outgoingMsg)

	if err != nil {
		slog.Error("Failed to marshal room message", err)
		return err
	}

	updateErr := wR.UpdatePlayerStateInRoom(ctx, roomID, clientID, playerState)

	if updateErr != nil {
		return updateErr
	}
	// <roomID>.playerstate <- topic
	routingKey := roomID + ".playerstate"
	publishErr := ch.PublishWithContext(ctx,
		"room_exchange", // exchange
		routingKey,
		false, // mandatory
		false, // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        outgoingMsgBytes,
		})

	if publishErr != nil {
		slog.Error("Failed to declare an exchange", publishErr)
	}

	return nil
}

func (wR *wsRepo) ReceivePlayerStateInRoom(ctx context.Context, roomID string) (<-chan amqp.Delivery, error) {
	ch, chErr := wR.ampqConn.Channel()
	if chErr != nil {
		slog.Error("Failed to open a channel", chErr)
	}

	exchErr := ch.ExchangeDeclare(
		"room_exchange", // name
		"topic",         // type
		true,            // durable
		false,           // auto-deleted
		false,           // internal
		false,           // no-wait
		nil,             // arguments
	)
	if exchErr != nil {
		slog.Error("Failed to declare an exchange", exchErr)
	}

	q, qErr := ch.QueueDeclare(
		"",    // name
		false, // durable
		true,  // delete when unused
		true,  // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if qErr != nil {
		slog.Error("Failed to declare a queue", qErr)
	}

	// <roomID>.playerstate <- topic
	routingKey := roomID + ".playerstate"
	qBindErr := ch.QueueBind(
		q.Name,          // queue name
		routingKey,      // routing key
		"room_exchange", // exchange
		false,
		nil)

	if qBindErr != nil {
		slog.Error("Failed to bind a queue", qBindErr)
	}

	msgChan, msgErr := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto ack
		false,  // exclusive
		false,  // no local
		false,  // no wait
		nil,    // args
	)

	if msgErr != nil {
		slog.Error("Failed to consume a queue", msgErr)
	}
	return msgChan, nil
}

func (wR *wsRepo) PublishUserInfoToRoom(ctx context.Context, roomID string, client string) error {

	ch, chErr := wR.ampqConn.Channel()
	if chErr != nil {
		slog.Error("Failed to open a channel", chErr)
	}
	defer ch.Close()

	exchErr := ch.ExchangeDeclare(
		"room_exchange", // name
		"topic",         // type
		true,            // durable
		false,           // auto-deleted
		false,           // internal
		false,           // no-wait
		nil,             // arguments
	)
	if exchErr != nil {
		slog.Error("Failed to declare an exchange", exchErr)
	}

	roomPlayers, roomPlayerErr := wR.GetPlayersInRoom(ctx, roomID)
	if roomPlayerErr != nil {
		return roomPlayerErr
	}

	userInfo := models.RMQRoomBroadcastMessage{
		Client:      client,
		RoomID:      roomID,
		Timestamp:   time.Now().Format(time.RFC3339),
		RoomPlayers: roomPlayers,
	}

	userInfoBytes, err := json.Marshal(userInfo)
	if err != nil {
		slog.Error("Failed to marshal user info", err)
		return err
	}

	publishErr := ch.PublishWithContext(ctx,
		"room_exchange",                    // exchange
		fmt.Sprintf("%v.userinfo", roomID), // routing key
		false,                              // mandatory
		false,                              // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        userInfoBytes,
		})

	if publishErr != nil {
		slog.Error("Failed to publish user info", publishErr)
	}

	return nil
}

func (wR *wsRepo) ReceiveUsersInfoInRoom(ctx context.Context, roomID string) (<-chan amqp.Delivery, error) {
	ch, chErr := wR.ampqConn.Channel()
	if chErr != nil {
		slog.Error("Failed to open a channel", chErr)
	}

	exchErr := ch.ExchangeDeclare(
		"room_exchange", // name
		"topic",         // type
		true,            // durable
		false,           // auto-deleted
		false,           // internal
		false,           // no-wait
		nil,             // arguments
	)
	if exchErr != nil {
		slog.Error("Failed to declare an exchange", exchErr)
	}

	q, qErr := ch.QueueDeclare(
		"",    // name
		false, // durable
		true,  // delete when unused
		true,  // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if qErr != nil {
		slog.Error("Failed to declare a queue", qErr)
	}

	qBindErr := ch.QueueBind(
		q.Name,                             // queue name
		fmt.Sprintf("%v.userinfo", roomID), // routing key
		"room_exchange",                    // exchange
		false,
		nil)
	if qBindErr != nil {
		slog.Error("Failed to bind a queue", qBindErr)
	}

	msgChan, msgErr := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto ack
		false,  // exclusive
		false,  // no local
		false,  // no wait
		nil,    // args
	)

	if msgErr != nil {
		slog.Error("Failed to consume a queue", msgErr)
	}
	return msgChan, nil
}

func (wR *wsRepo) AddPlayerToRoom(ctx context.Context, roomID string, client string) error {
	// if it's already added, then returns 0, need to just check for err
	_, addPlayerErr := wR.rdb.SAdd(ctx, "room:"+roomID, client).Result()
	// add the empty playerData or something to the HSET
	if addPlayerErr != nil {
		slog.Debug("redis err", slog.Any("error", addPlayerErr))
		return addPlayerErr
	}

	roomPlayer := models.RoomPlayer{}
	roomPlayer.ClientID = client
	roomPlayer.RoomID = roomID
	roomPlayer.JoinedAt = time.Now().Format(time.RFC3339)
	roomPlayer.PlayerState = models.PlayerStateData{
		PlayerMoving:          false,
		PlayerFacingDirection: "front",
		PlayerPosition:        models.PlayerPosition{X: 0, Y: 0},
		PlayerCurrentScene:    "",
	}

	roomPlayerBytes, roomPlayerBytesErr := json.Marshal(roomPlayer)
	if roomPlayerBytesErr != nil {
		slog.Debug("json marshal error", slog.Any("error", roomPlayerBytesErr))
		return roomPlayerBytesErr
	}
	_, hsetRoomPlayerErr := wR.rdb.HSet(ctx, "room:"+roomID+":player:"+client, "data", string(roomPlayerBytes)).Result()
	return hsetRoomPlayerErr
}

func (wR *wsRepo) RemovePlayerFromRoom(ctx context.Context, roomID string, client string) error {
	// remove the client from the set
	_, sRemErr := wR.rdb.SRem(ctx, "room:", client).Result()

	if sRemErr != nil {
		slog.Debug("Remove client error ", slog.Any("error", sRemErr))
		return sRemErr
	}
	// delete the hash set
	_, delErr := wR.rdb.Del(ctx, "room:"+roomID+":player:"+client).Result()

	if delErr != nil {
		slog.Debug("Remove client error ", slog.Any("error", delErr))
		return delErr
	}

	return nil
}

func (wR *wsRepo) GetPlayersInRoom(ctx context.Context, roomID string) ([]models.RoomPlayer, error) {

	clientIDS, clientIDErr := wR.rdb.SMembers(ctx, "room:"+roomID).Result()
	if clientIDErr != nil {
		slog.Debug("room SMEMBERS error: ", slog.Any("error", clientIDErr))
		return nil, clientIDErr
	}

	allPlayersInRoom := []models.RoomPlayer{}
	for _, clientID := range clientIDS {
		// get all the room player information  to
		playerDataStr, playerDataErr := wR.rdb.HGet(ctx, "room:"+roomID+":player:"+clientID, "data").Result()
		if playerDataErr != nil {
			slog.Debug("room player HGET error: ", slog.Any("error", playerDataErr))
			return nil, playerDataErr
		}
		playerData := models.RoomPlayer{}
		if playerDataJsonErr := json.Unmarshal([]byte(playerDataStr), &playerData); playerDataJsonErr != nil {
			slog.Debug("json unmarshal error: ", slog.Any("error", playerDataJsonErr))
			return nil, playerDataJsonErr
		}
		allPlayersInRoom = append(allPlayersInRoom, playerData)
	}

	return allPlayersInRoom, nil

}

func (wR *wsRepo) UpdatePlayerStateInRoom(ctx context.Context, roomID string, client string, playerState models.PlayerStateData) error {

	// get the player data from REDIS Hash
	roomPlayerStr, roomPlayerStrErr := wR.rdb.HGet(ctx, "room:"+roomID+":player:"+client, "data").Result()
	if roomPlayerStrErr != nil {
		slog.Debug("room player HGET err", slog.Any("error", roomPlayerStrErr))
		return roomPlayerStrErr
	}
	roomPlayer := models.RoomPlayer{}

	// unmarshal the str
	roomPlayerErr := json.Unmarshal([]byte(roomPlayerStr), &roomPlayer)
	if roomPlayerErr != nil {
		slog.Debug("room player unmarshal err", slog.Any("error", roomPlayerErr))
		return roomPlayerStrErr
	}

	// update the player state
	roomPlayer.PlayerState = playerState

	// marshal it again, after updating the playerstate
	roomPlayerByte, roomPlayerByteErr := json.Marshal(roomPlayer)
	if roomPlayerByteErr != nil {
		// json marshal error debug
		slog.Debug("json marshal error", slog.Any("error", roomPlayerByte))
		return roomPlayerByteErr
	}

	_, roomPlayerHSETErr := wR.rdb.HSet(ctx, "room:"+roomID+": player:"+client, "data", string(roomPlayerByte)).Result()

	if roomPlayerHSETErr != nil {
		return roomPlayerHSETErr
	}

	return nil
}
