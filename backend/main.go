package main

import (
	"ecommerce/backend/database"
	"ecommerce/backend/routes"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"net/http"      
	"os"
)

func createUploadsDir() {
	if err := os.MkdirAll("uploads", 0755); err != nil {
		log.Printf("Warning: Failed to create Uploads directory: %v", err)
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	database.CreateDBIfNotExists()
	database.ConnectDB()
	database.Migrate()

	var tables []string
	database.DB.Raw(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    `).Scan(&tables)

	fmt.Println("Tables in DB:", tables)
	createUploadsDir()

	app := gin.Default()

	wd, _ := os.Getwd()
	fmt.Printf("Current working directory: %s\n", wd)

	app.StaticFS("/uploads", http.Dir("./uploads"))
	
	routes.RegisterRoutes(app)
	
	
	app.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "API Running"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server running on http://localhost:%s\n", port)
	fmt.Printf("Uploads served from: %s/uploads\n", wd)
	
	app.Run(":" + port)
}