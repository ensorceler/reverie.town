package server

import (
	"net/http"

	"github.com/jmoiron/sqlx"
	amqp "github.com/rabbitmq/amqp091-go"
	"reverie.town/internal/config"
	"reverie.town/internal/middleware"
)

func CreateNewServer(cfg config.Config, db *sqlx.DB, amqpConn *amqp.Connection) *http.Server {
	routes := SetupRoutes(db, amqpConn)
	loggedRoutes := middleware.LogRequest(routes)

	return &http.Server{
		Addr:         cfg.Server.Host + ":" + cfg.Server.Port,
		Handler:      loggedRoutes,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

}
