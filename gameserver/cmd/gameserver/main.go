package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"reverie.town/internal/config"
	"reverie.town/internal/server"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	amqp "github.com/rabbitmq/amqp091-go"
	redis "github.com/redis/go-redis/v9"
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

	// Simple ping check
	if err := db.Ping(); err != nil {
		slog.Error("Database ping failed - connection not working", err)
		os.Exit(1)
	}

	slog.Info("Database connection established successfully")

	amqpConn, amqpError := amqp.Dial("amqp://guest:guest@localhost:5672/")
	//failOnError(err, "Failed to connect to RabbitMQ")
	if amqpError != nil {
		slog.Error("amqp connection failed - connection not working", err)
		os.Exit(1)
	}

	defer amqpConn.Close()

	// Initialize Redis connection
	rdb := redis.NewClient(&redis.Options{
		Addr:     cfg.Redis.Host + ":" + strconv.Itoa(cfg.Redis.Port),
		Password: cfg.Redis.Password,
		DB:       cfg.Redis.DB,
	})

	// Test Redis connection
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := rdb.Ping(ctx).Err(); err != nil {
		slog.Error("Redis connection failed", err)
		os.Exit(1)
	}
	defer rdb.Close()

	slog.Info("Redis connection established successfully")

	// create new server
	s := server.CreateNewServer(cfg, db, amqpConn, rdb)

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
