package seeds

import (
	"log"
	"math/rand"
	"time"
	"ecommerce/backend/models"
	"gorm.io/gorm"
)

type Seeder struct {
	DB *gorm.DB
}

func NewSeeder(db *gorm.DB) *Seeder {
	rand.Seed(time.Now().UnixNano())
	return &Seeder{DB: db}
}

var imageOptions = []string{
	"uploads/iphone.jpg",
	"uploads/macbook.jpg",
	"uploads/headphones.jpg",
}

var sampleProducts = []models.Product{
	{
		Title:       "iPhone 15 Pro",
		Price:       999,
		Description: "Latest iPhone with A17 Pro chip and titanium design",
		Category:    "Smartphones",
	},
	{
		Title:       "Samsung Galaxy S24",
		Price:       899,
		Description: "Premium Android smartphone with AI features",
		Category:    "Smartphones",
	},
	{
		Title:       "Google Pixel 8 Pro",
		Price:       999,
		Description: "Google's flagship with Tensor G3 chip and advanced camera",
		Category:    "Smartphones",
	},
	{
		Title:       "OnePlus 12",
		Price:       799,
		Description: "Flagship killer with Snapdragon 8 Gen 3",
		Category:    "Smartphones",
	},
	{
		Title:       "Xiaomi 14 Pro",
		Price:       899,
		Description: "Leica co-engineered camera system",
		Category:    "Smartphones",
	},

	{
		Title:       "MacBook Pro 16\" M3 Max",
		Price:       3499,
		Description: "Professional laptop for extreme performance",
		Category:    "Laptops",
	},
	{
		Title:       "Dell XPS 15",
		Price:       1899,
		Description: "Premium Windows laptop with OLED display",
		Category:    "Laptops",
	},
	{
		Title:       "Lenovo ThinkPad X1 Carbon",
		Price:       1699,
		Description: "Business laptop with legendary keyboard",
		Category:    "Laptops",
	},
	{
		Title:       "ASUS ROG Zephyrus G14",
		Price:       1599,
		Description: "Gaming laptop with RTX 4060",
		Category:    "Laptops",
	},
	{
		Title:       "Microsoft Surface Laptop 5",
		Price:       1299,
		Description: "Sleek Windows laptop with touchscreen",
		Category:    "Laptops",
	},

	{
		Title:       "Sony WH-1000XM5",
		Price:       399,
		Description: "Industry-leading noise cancellation",
		Category:    "Headphones",
	},
	{
		Title:       "Apple AirPods Max",
		Price:       549,
		Description: "Premium over-ear headphones with spatial audio",
		Category:    "Headphones",
	},
	{
		Title:       "Bose QuietComfort Ultra",
		Price:       429,
		Description: "Immersive audio with noise cancelling",
		Category:    "Headphones",
	},
	{
		Title:       "Sennheiser Momentum 4",
		Price:       349,
		Description: "Hi-Fi sound with 60-hour battery",
		Category:    "Headphones",
	},
	{
		Title:       "Jabra Elite 85h",
		Price:       229,
		Description: "Smart sound personalization",
		Category:    "Headphones",
	},

	{
		Title:       "iPad Pro 12.9\" M2",
		Price:       1099,
		Description: "Professional tablet with Liquid Retina XDR",
		Category:    "Tablets",
	},
	{
		Title:       "Samsung Galaxy Tab S9 Ultra",
		Price:       1199,
		Description: "Android tablet with S Pen included",
		Category:    "Tablets",
	},
	{
		Title:       "Microsoft Surface Pro 9",
		Price:       1299,
		Description: "2-in-1 laptop and tablet",
		Category:    "Tablets",
	},
	{
		Title:       "Lenovo Tab P12 Pro",
		Price:       899,
		Description: "OLED display with Dolby Vision",
		Category:    "Tablets",
	},

	{
		Title:       "Apple Watch Series 9",
		Price:       399,
		Description: "Smartwatch with advanced health features",
		Category:    "Wearables",
	},
	{
		Title:       "Samsung Galaxy Watch 6 Classic",
		Price:       369,
		Description: "Rotating bezel smartwatch",
		Category:    "Wearables",
	},
	{
		Title:       "Google Pixel Watch 2",
		Price:       349,
		Description: "Fitbit integration and health tracking",
		Category:    "Wearables",
	},
	{
		Title:       "Garmin Fenix 7",
		Price:       699,
		Description: "Premium multisport GPS watch",
		Category:    "Wearables",
	},
}

func (s *Seeder) Seed() error {
	log.Println("🌱 Starting database seeder...")
	log.Printf("📦 Seeding %d products with %d image options\n", len(sampleProducts), len(imageOptions))
	log.Println("🖼️ Available images:", imageOptions)

	if err := s.clean(); err != nil {
		return err
	}

	createdCount, err := s.seedProducts()
	if err != nil {
		return err
	}

	log.Printf("✅ Seeding completed! Created %d products\n", createdCount)
	return nil
}

func (s *Seeder) clean() error {
	log.Println("🧹 Cleaning existing products...")
	
	if err := s.DB.Exec("DELETE FROM products").Error; err != nil {
		return err
	}
	
	if s.DB.Dialector.Name() == "mysql" {
		s.DB.Exec("ALTER TABLE products AUTO_INCREMENT = 1")
	}
	
	log.Println("✅ Cleanup completed")
	return nil
}

func (s *Seeder) seedProducts() (int, error) {
	createdCount := 0

	for i, product := range sampleProducts {
		product.Image = getRandomImage()

		result := s.DB.Create(&product)
		if result.Error != nil {
			log.Printf("❌ Failed to create product %d: %s - %v\n", i+1, product.Title, result.Error)
			continue
		}

		createdCount++
		log.Printf("✅ Created product %d/%d: %s ($%d) - Image: %s\n",
			i+1, len(sampleProducts), product.Title, product.Price, product.Image)
	}

	return createdCount, nil
}

func getRandomImage() string {
	return imageOptions[rand.Intn(len(imageOptions))]
}

func GetSampleProducts() []models.Product {
	products := make([]models.Product, len(sampleProducts))
	copy(products, sampleProducts)
	
	for i := range products {
		products[i].Image = getRandomImage()
	}
	
	return products
}