package handlers

import (
	"log/slog"
	"net/http"

	"reverie.town/internal/services"
)

type UserHandler interface {
	GetUsers(w http.ResponseWriter, r *http.Request)
}

type userHandler struct {
	userService services.UserService
}

func NewuserHandler(us services.UserService) UserHandler {
	return &userHandler{userService: us}
}

func (uH *userHandler) GetUsers(w http.ResponseWriter, req *http.Request) {
	slog.Info("Get Users =>")
	w.Write([]byte("users"))
}
