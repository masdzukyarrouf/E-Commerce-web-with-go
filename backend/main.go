package main

import (
	"ecommerce/backend/database"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"os"
	"ecommerce/backend/routes"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	database.CreateDBIfNotExists()
	database.ConnectDB()
	database.Migrate()

	// ⬇️ VERIFY TABLES EXIST
	var tables []string
	database.DB.Raw(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    `).Scan(&tables)

	fmt.Println("Tables in DB:", tables)

	app := gin.Default()

	routes.RegisterRoutes(app)

	app.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "API Running"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	app.Run(":" + port)
}
