package controllers

import (
	"ecommerce/backend/database"
	"ecommerce/backend/models"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func GetProducts(c *gin.Context) {
	var products []models.Product
	database.DB.Find(&products)
	c.JSON(http.StatusOK, products)
}

func GetProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := database.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, product)
}


func CreateProduct(c *gin.Context) {
	var product models.Product

	product.Title = c.PostForm("title")
	product.Description = c.PostForm("description")
	price, _ := strconv.Atoi(c.PostForm("price"))
	product.Price = price

	file, err := c.FormFile("image")
	if err == nil {
		filename := "uploads/" + file.Filename
		c.SaveUploadedFile(file, filename)
		product.Image = filename
	}

	database.DB.Create(&product)

	c.JSON(http.StatusCreated, product)
}


func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := database.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	product.Title = c.PostForm("title")
	product.Description = c.PostForm("description")
	price, _ := strconv.Atoi(c.PostForm("price"))
	product.Price = price

	file, err := c.FormFile("image")
	if err == nil {
		filename := "uploads/" + file.Filename
		c.SaveUploadedFile(file, filename)
		product.Image = filename
	}

	database.DB.Save(&product)

	c.JSON(http.StatusOK, product)
}


func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Product{}, id)

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted"})
}
