package models

type Product struct {
	ID    uint   `gorm:"primaryKey"`
	Title string
	Price int
	Description string
	Category string
	Image string
}
