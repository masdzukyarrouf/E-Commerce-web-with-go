package routes

import (
	"ecommerce/backend/controllers"
	"ecommerce/backend/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")

	// public 
	api.POST("/register", controllers.Register)
	api.POST("/login", controllers.Login)
	api.GET("/products", controllers.GetProducts)
	api.GET("/products/:id", controllers.GetProduct)
	
	// auth
	protected := api.Group("/")
	protected.Use(middleware.AuthRequired())
	{
		protected.GET("/me", func(c *gin.Context) {
			if id, ok := middleware.GetUserID(c); ok {
				c.JSON(200, gin.H{"user_id": id})
				return
			}
			c.JSON(500, gin.H{"error": "could not get user id"})
		})

		protected.GET("/users/:id", controllers.GetUser)
		protected.PUT("/users/:id", controllers.UpdateUser)
		protected.DELETE("/users/:id", controllers.DeleteUser)

		protected.GET("/orders", controllers.GetOrders)
		protected.GET("/orders/:id", controllers.GetOrder)
		protected.POST("/orders", controllers.CreateOrder)
		protected.PUT("/orders/:id", controllers.UpdateOrder)
		protected.DELETE("/orders/:id", controllers.DeleteOrder)
		
		// admin
		admin := protected.Group("/")
		admin.Use(middleware.AdminOnly())
		{
			admin.POST("/products", controllers.CreateProduct)
			admin.PUT("/products/:id", controllers.UpdateProduct)
			admin.DELETE("/products/:id", controllers.DeleteProduct)
		}
	}
}