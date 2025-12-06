package controllers

import (
	"ecommerce/backend/database"
	"ecommerce/backend/models"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"strings"
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

	contentType := c.GetHeader("Content-Type")

	if strings.Contains(contentType, "multipart/form-data") {
		if err := c.Request.ParseMultipartForm(10 << 20); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form data"})
			return
		}

		product.Title = c.PostForm("title")
		product.Description = c.PostForm("description")
		priceStr := c.PostForm("price")
		if priceStr != "" {
			price, _ := strconv.Atoi(priceStr)
			product.Price = price
		}
		product.Category = c.PostForm("category")

		file, err := c.FormFile("image")
		if err == nil {
			filename := "uploads/" + file.Filename
			if err := c.SaveUploadedFile(file, filename); err == nil {
				product.Image = filename
			}
		}
	} else {
		if err := c.ShouldBindJSON(&product); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
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

	contentType := c.GetHeader("Content-Type")

	if strings.Contains(contentType, "multipart/form-data") {
		if err := c.Request.ParseMultipartForm(10 << 20); err != nil { 
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form data"})
			return
		}

		if title := c.PostForm("title"); title != "" {
			product.Title = title
		}
		if description := c.PostForm("description"); description != "" {
			product.Description = description
		}
		if priceStr := c.PostForm("price"); priceStr != "" {
			price, _ := strconv.Atoi(priceStr)
			product.Price = price
		}
		if category := c.PostForm("category"); category != "" {
			product.Category = category
		}

		file, err := c.FormFile("image")
		if err == nil {
			filename := "uploads/" + file.Filename
			if err := c.SaveUploadedFile(file, filename); err == nil {
				product.Image = filename
			}
		}
	} else {
		var updateData models.Product
		if err := c.ShouldBindJSON(&updateData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if updateData.Title != "" {
			product.Title = updateData.Title
		}
		if updateData.Description != "" {
			product.Description = updateData.Description
		}
		if updateData.Price != 0 {
			product.Price = updateData.Price
		}
		if updateData.Category != "" {
			product.Category = updateData.Category
		}
		if updateData.Image != "" {
			product.Image = updateData.Image
		}
	}

	if err := database.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save product"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Product{}, id)

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted"})
}