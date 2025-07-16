package handlers

import (
	"log/slog"
	"net/http"

	"reverie.town/internal/services"
)

type UserHandler interface {
	GetUsers(w http.ResponseWriter, r *http.Request) func(http.ResponseWriter, *http.Request)
}

type userHandler struct {
	userService services.UserService
}

func NewuserHandler(us services.UserService) UserHandler {
	return &userHandler{userService: us}
}

func (uH *userHandler) GetUsers(writer http.ResponseWriter, req *http.Request) func(http.ResponseWriter, *http.Request) {
	slog.Info("Get Users =>")
	return func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("users"))
	}
}
