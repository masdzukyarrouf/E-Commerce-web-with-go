package models

type Order struct {
	ID        uint `gorm:"primaryKey"`

	UserID    uint
	User      User `gorm:"foreignKey:UserID"`

	ProductID uint
	Product   Product `gorm:"foreignKey:ProductID"`

	Quantity  int
}
