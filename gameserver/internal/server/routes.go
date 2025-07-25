package server

import (
	"net/http"

	"github.com/jmoiron/sqlx"
	"reverie.town/internal/handlers"
	"reverie.town/internal/repository"
	"reverie.town/internal/services"

	amqp "github.com/rabbitmq/amqp091-go"
)

func SetupRoutes(db *sqlx.DB, amqpConn *amqp.Connection) *http.ServeMux {
	r := http.NewServeMux()

	// Initialize dependency chain
	userRepo := repository.NewUserRepository(db)
	userService := services.NewUserService(userRepo)
	userHandler := handlers.NewuserHandler(userService)

	wsRepo := repository.NewWsRepository(db, amqpConn)
	chatRoomService := services.NewChatRoomService(wsRepo)
	wsHandler := handlers.NewWebsocketHandler(chatRoomService)

	// Register routes
	r.HandleFunc("GET /users", userHandler.GetUsers)
	r.HandleFunc("GET /wschat", wsHandler.ChatHandler)

	return r
}
