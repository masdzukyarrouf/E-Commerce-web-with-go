package database

import (
	"fmt"
	"ecommerce/backend/models"
)

func Migrate() {
	fmt.Println("Running migrations...")

	err := DB.AutoMigrate(
		&models.User{},
		&models.Product{},
		&models.Order{},
	)

	if err != nil {
		fmt.Println("Migration error:", err)
	} else {
		fmt.Println("Migration done.")
	}
}
