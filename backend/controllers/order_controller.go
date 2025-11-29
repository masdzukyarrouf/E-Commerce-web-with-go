package controllers

import (
	"ecommerce/backend/database"
	"ecommerce/backend/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetOrders(c *gin.Context) {
	var orders []models.Order
	database.DB.Preload("User").Preload("Product").Find(&orders)
	c.JSON(http.StatusOK, orders)
}

func GetOrder(c *gin.Context) {
	id := c.Param("id")
	var order models.Order

	if err := database.DB.Preload("User").Preload("Product").First(&order, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, order)
}

func CreateOrder(c *gin.Context) {
	var order models.Order

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Create(&order)
	c.JSON(http.StatusCreated, order)
}

func UpdateOrder(c *gin.Context) {
	id := c.Param("id")
	var order models.Order

	if err := database.DB.First(&order, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.ShouldBindJSON(&order)
	database.DB.Save(&order)

	c.JSON(http.StatusOK, order)
}

func DeleteOrder(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Order{}, id)

	c.JSON(http.StatusOK, gin.H{"message": "Order deleted"})
}
