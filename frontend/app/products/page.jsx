"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";
import SearchFilters from "@/app/components/SearchFilter";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        
        setProducts(data);
        setFilteredProducts(data);
        
        const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams();
        if (searchQuery) params.append("q", searchQuery);
        if (selectedCategory) params.append("category", selectedCategory);
        if (priceRange.min) params.append("minPrice", priceRange.min);
        if (priceRange.max) params.append("maxPrice", priceRange.max);
        
        const res = await fetch(`/api/products/search?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to search products");
        const data = await res.json();
        
        let sortedData = [...data];
        switch (sortBy) {
          case "price-low":
            sortedData.sort((a, b) => a.price - b.price);
            break;
          case "price-high":
            sortedData.sort((a, b) => b.price - a.price);
            break;
          case "name":
            sortedData.sort((a, b) => a.title.localeCompare(b.title));
            break;
          default:
            break;
        }
        
        setFilteredProducts(sortedData);
      } catch (error) {
        console.error("Error searching products:", error);
        filterProductsLocally();
      } finally {
        setLoading(false);
      }
    };

    const filterProductsLocally = () => {
      let filtered = products.filter(product => {
        const matchesSearch = !searchQuery || 
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = !selectedCategory || 
          product.category === selectedCategory;
        
        const matchesMinPrice = !priceRange.min || 
          product.price >= parseInt(priceRange.min);
        
        const matchesMaxPrice = !priceRange.max || 
          product.price <= parseInt(priceRange.max);
        
        return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
      });

      switch (sortBy) {
        case "price-low":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "name":
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          break;
      }

      setFilteredProducts(filtered);
    };

    if (products.length > 0) {
      filterProductsLocally();
    }
  }, [searchQuery, selectedCategory, priceRange, sortBy, products]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSortBy("default");
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Shop Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse our collection of amazing products
          </p>
        </div>

        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          handleSearch={handleSearch}
          clearFilters={clearFilters}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}