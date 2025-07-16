package services

import (
	"context"

	"reverie.town/internal/models"
	"reverie.town/internal/repository"
)

type UserService interface {
	//UserRepo repository.UserRepository
	GetUsers(ctx context.Context) ([]models.User, error)
}

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{
		userRepo: userRepo,
	}
}

func (us *userService) GetUsers(ctx context.Context) ([]models.User, error) {

	users := []models.User{}
	return users, nil
}
