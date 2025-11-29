package routes

import (
	"ecommerce/backend/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")

	// Users
	api.GET("/users", controllers.GetUsers)
	api.GET("/users/:id", controllers.GetUser)
	api.POST("/users", controllers.CreateUser)
	api.PUT("/users/:id", controllers.UpdateUser)
	api.DELETE("/users/:id", controllers.DeleteUser)

	// Products
	api.GET("/products", controllers.GetProducts)
	api.GET("/products/:id", controllers.GetProduct)
	api.POST("/products", controllers.CreateProduct)
	api.PUT("/products/:id", controllers.UpdateProduct)
	api.DELETE("/products/:id", controllers.DeleteProduct)

	// Orders
	api.GET("/orders", controllers.GetOrders)
	api.GET("/orders/:id", controllers.GetOrder)
	api.POST("/orders", controllers.CreateOrder)
	api.PUT("/orders/:id", controllers.UpdateOrder)
	api.DELETE("/orders/:id", controllers.DeleteOrder)
}
