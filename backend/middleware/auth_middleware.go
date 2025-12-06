package middleware

import (
	"ecommerce/backend/utils"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
	"fmt"
)

const userIDKey = "userID"

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Printf("[Auth] Request: %s %s\n", c.Request.Method, c.Request.URL.Path)
		fmt.Printf("[Auth] Authorization header: %s\n", c.GetHeader("Authorization"))
		
		auth := c.GetHeader("Authorization")
		if auth == "" {
			fmt.Println("[Auth] ERROR: No authorization header")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "authorization header required"})
			return
		}

		parts := strings.SplitN(auth, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			fmt.Printf("[Auth] ERROR: Invalid header format. Parts: %v\n", parts)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization header"})
			return
		}

		fmt.Printf("[Auth] Token: %s... (first 20 chars)\n", parts[1][:min(20, len(parts[1]))])
		
		claims, err := utils.ParseToken(parts[1])
		if err != nil {
			fmt.Printf("[Auth] ERROR: Token parse failed: %v\n", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}

		fmt.Printf("[Auth] SUCCESS: UserID=%d\n", claims.UserID)
		c.Set(userIDKey, claims.UserID)
		c.Next()
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func GetUserID(c *gin.Context) (uint, bool) {
	v, ok := c.Get(userIDKey)
	if !ok {
		return 0, false
	}
	id, ok := v.(uint)
	return id, ok
}
