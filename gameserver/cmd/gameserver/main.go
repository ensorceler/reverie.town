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

	// Load config
	cfg, err := config.LoadConfig()
	if err != nil {
		slog.Error("Error loading config", err)
		os.Exit(1)
	}

	// Initialize DB connection pool
	db, err := sqlx.Connect("postgres", buildDSN(cfg.Database))
	if err != nil {
		slog.Error("Database connection failed", err)
		os.Exit(1)
	}
	defer db.Close()

	// Configure connection pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Verify DB connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		slog.Error("Database ping failed", err)
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
func buildDSN(cfg config.DatabaseConfig) string {
	return "host=" + cfg.Host +
		" port=" + strconv.Itoa(cfg.Port) +
		" user=" + cfg.Username +
		" password=" + cfg.Password +
		" dbname=" + cfg.DBName +
		" sslmode=" + cfg.SSLMode
}
