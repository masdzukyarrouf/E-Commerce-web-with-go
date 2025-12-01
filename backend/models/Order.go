package models

type Order struct {
	ID        uint `gorm:"primaryKey" json:"id"`

	UserID    uint `json:"user_id"`
	User      User `gorm:"foreignKey:UserID" json:"user"`

	ProductID uint    `json:"product_id"`
	Product   Product `gorm:"foreignKey:ProductID" json:"product"`

	Quantity  int `json:"quantity"`
}