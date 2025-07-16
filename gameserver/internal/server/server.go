package server

import (
	"fmt"
	"log/slog"
	"net/http"

	"reverie.town/internal/config"
	"reverie.town/internal/middleware"
)

func CreateNewServer(cfg config.Config, db *sqlx.DB) *http.Server {
	routes := SetupRoutes(db)
	loggedRoutes := middleware.LogRequest(routes)

	return &http.Server{
		Addr:         cfg.Server.Host + ":" + cfg.Server.Port,
		Handler:      loggedRoutes,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}
	//slog.Info(viper.Get("host"))

	server := &http.Server{
		Handler: loggedRoutes,
		Addr:    fmt.Sprintf("%v:%v", host, port),
	}

	return server
}
