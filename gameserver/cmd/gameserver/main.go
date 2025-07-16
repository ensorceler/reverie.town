package main

import (
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"reverie.town/internal/config"
	"reverie.town/internal/server"
)

func main() {
	// error
	var err error

	// load config
	cfg, err := config.LoadConfig()
	if err != nil {
		slog.Info("Error loading the config", err)
		os.Exit(1)
	}

	// create new server
	s := server.CreateNewServer(cfg)

	go func() {
		slog.Info("Gameserver is running at ", slog.Any("Address: ", s.Addr))
		if err = s.ListenAndServe(); err != nil {
			slog.Error("Error starting the server", err)
		}
	}()

	// handles graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	slog.Info("Shutting down the server")

}
