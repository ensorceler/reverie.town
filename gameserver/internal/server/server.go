package server

import (
	"fmt"
	"log/slog"
	"net/http"

	"reverie.town/internal/config"
	"reverie.town/internal/middleware"
)

func CreateNewServer(cfg config.Config) *http.Server {

	routes := SetupRoutes()

	//SetupRoutes()
	loggedRoutes := middleware.LogRequest(routes)

	host := cfg.Server.Host
	port := cfg.Server.Port
	slog.Info(fmt.Sprintf("%v:%v", host, port))
	//slog.Info(viper.Get("host"))

	server := &http.Server{
		Handler: loggedRoutes,
		Addr:    fmt.Sprintf("%v:%v", host, port),
	}

	return server
}
