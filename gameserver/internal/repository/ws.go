package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"time"

	"github.com/jmoiron/sqlx"
	amqp "github.com/rabbitmq/amqp091-go"
	"reverie.town/internal/models"
)

type WsRepository interface {
	PublishMessageToRoom(ctx context.Context, roomID string, client string, message string)
	ReceiveMessageInRoom(ctx context.Context, roomID string) (<-chan amqp.Delivery, error)
}

// type  wsinterface
type wsRepo struct {
	db       *sqlx.DB
	ampqConn *amqp.Connection
}

func NewWsRepository(db *sqlx.DB, amqpConn *amqp.Connection) WsRepository {
	return &wsRepo{db: db, ampqConn: amqpConn}
	//return &wsRepo{}
}

func (wR *wsRepo) PublishMessageToRoom(ctx context.Context, roomID string, client string, message string) {

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

	roomMessage := models.RoomBroadcastMessage{
		Message:   message,
		RoomID:    roomID,
		Client:    client,
		Timestamp: time.Now().Format(time.RFC3339),
	}

	roomMessageBytes, err := json.Marshal(roomMessage)
	if err != nil {
		slog.Error("Failed to marshal room message", err)
		return
	}
	publishErr := ch.PublishWithContext(ctx,
		"room_exchange",           // exchange
		fmt.Sprintf("%v", roomID), // routing key
		false,                     // mandatory
		false,                     // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte(roomMessageBytes),
		})

	if publishErr != nil {
		slog.Error("Failed to declare an exchange", publishErr)
	}

	//[failOnError(err, "Failed to publish a message")
}

// publishes user status to a room (user joined, left, etc.)
func (wR *wsRepo) PublishUserStatusToRoom(ctx context.Context, roomID string, clientInfo any) {

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

	clientInfoBytes, clErr := json.Marshal(clientInfo)
	if clErr != nil {
		slog.Error("Failed to marshal client info", clErr)
		return
	}

	publishErr := ch.PublishWithContext(ctx,
		"room_exchange",                       // exchange
		fmt.Sprintf("%v.user_joined", roomID), // routing key
		false,                                 // mandatory
		false,                                 // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        clientInfoBytes,
		})

	if publishErr != nil {
		slog.Error("Failed to declare an exchange", publishErr)
	}

	//[failOnError(err, "Failed to publish a message")
}

func (wR *wsRepo) ReceiveMessageInRoom(ctx context.Context, roomID string) (<-chan amqp.Delivery, error) {
	ch, chErr := wR.ampqConn.Channel()
	if chErr != nil {
		slog.Error("Failed to open a channel", chErr)
	}
	// if channel is closed, then receive will not work
	//defer ch.Close()

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
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if qErr != nil {
		slog.Error("Failed to declare a queue", qErr)
	}
	//failOnError(err, "Failed to declare a queue")

	qBindErr := ch.QueueBind(
		q.Name,          // queue name
		roomID,          // routing key
		"room_exchange", // exchange
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
