package repository

import (
	"context"

	"github.com/jmoiron/sqlx"
	"reverie.town/internal/models"
)

// interface UserRepository
type UserRepository interface {
	GetAllUsers(ctx context.Context) ([]models.User, error)
	GetUserByID(ctx context.Context, userID string) (models.User, error)
}

type userRepo struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) UserRepository {
	return &userRepo{db: db}
}

func (u *userRepo) GetAllUsers(ctx context.Context) ([]models.User, error) {
	users := []models.User{}
	//append(users)
	return users, nil
}

func (u *userRepo) GetUserByID(ctx context.Context, userID string) (models.User, error) {

	user := models.User{}

	return user, nil
}
