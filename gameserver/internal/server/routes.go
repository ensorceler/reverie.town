package server

import (
	"net/http"

	"github.com/jmoiron/sqlx"
	"reverie.town/internal/handlers"
	"reverie.town/internal/repository"
	"reverie.town/internal/services"
)

func SetupRoutes(db *sqlx.DB) *http.ServeMux {
	r := http.NewServeMux()

	// Initialize dependency chain
	userRepo := repository.NewUserRepository(db)
	userService := services.NewUserService(userRepo)
	userHandler := handlers.NewuserHandler(userService)

	// Register routes
	r.HandleFunc("GET /users", userHandler.GetUsers)
	r.HandleFunc("GET /wschat", handlers.ChatHandler)

	return r
}
