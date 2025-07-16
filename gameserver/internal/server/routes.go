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

	// Initialize user handler chain
	userHandler := handlers.NewuserHandler(
		services.NewUserService(
			repository.NewUserRepository(db),
		)

	// Register API routes
	r.HandleFunc("GET /users", userHandler.GetUsers)
	r.HandleFunc("GET /users/{id}", userHandler.GetUserByID)  // Add this if implemented
	
	// Register WebSocket route
	r.HandleFunc("GET /wschat", handlers.ChatHandler)

	return r
}
