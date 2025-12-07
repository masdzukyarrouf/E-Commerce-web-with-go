package middleware

import (
	"ecommerce/backend/database"
	"ecommerce/backend/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := GetUserID(c)
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
			return
		}
		
		var user models.User
		if err := database.DB.First(&user, userID).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		
		if user.Role != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "admin access required"})
			return
		}
		
		c.Next()
	}
}