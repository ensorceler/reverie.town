package server

import (
	"net/http"

	"reverie.town/internal/handlers"
)

func SetupRoutes() *http.ServeMux {

	r := http.NewServeMux()

	//r.HandleFunc("GET /users")

	//r.Handle("GET /user/{id}", )

	r.HandleFunc("GET /wschat", handlers.ChatHandler)

	return r
}
