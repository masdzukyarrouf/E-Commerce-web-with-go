"use client";

import { stringify } from "querystring";
import { useState, useEffect } from "react";

export default function ProductForm({ id }) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    imageFile: null,
    currentImageUrl: "" 
  });

  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        setForm({
          title: data.title || "",
          price: data.price || "",
          description: data.description || "",
          category: data.category || "",
          imageFile: null,
          currentImageUrl: data.image || ""
        });
        if (data.image) {
          setImagePreview(data.image);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, imageFile: file }));
      
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const method = id ? "PUT" : "POST";
    const endpoint = id ? `/api/products/${id}` : `/api/products`;
    
    const token = localStorage.getItem('token');
    console.log("Token present:", token);
    
    if (form.imageFile) {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("image", form.imageFile);

      const res = await fetch(endpoint, {
        method,
        headers: token ? {
          'Authorization': `Bearer ${token}`, 
        } : {}, 
        body: formData,
      });

      if (!res.ok) {
  let errorDetails = '';
  try {
    const errorData = await res.json();
    errorDetails = JSON.stringify(errorData);
  } catch {
    errorDetails = await res.text();
  }
  
  console.log("=== FORM DATA DEBUG ===");
  console.log("Response Status:", res.status, res.statusText);
  console.log("Response Error:", errorDetails);
  
  console.log("FormData contents:");
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }
  
  console.log("Request headers:", {
    method: res.url,
    headers: Object.fromEntries(res.headers.entries())
  });
  
  throw new Error(`Failed to save product: ${res.status} ${res.statusText} - ${errorDetails}`);
}
    } else {
      const res = await fetch(endpoint, {
        method,
        headers: token ? {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`, 
        } : {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          price: form.price,
          description: form.description,
          category: form.category,
        }),
      });

      if (!res.ok) throw new Error("Failed to save product" + JSON.stringify({
          title: form.title,
          price: form.price,
          description: form.description,
          category: form.category,
        }));
    }

    window.location.href = "/products";
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
};

  const removeImage = () => {
    setForm(prev => ({ 
      ...prev, 
      imageFile: null,
      currentImageUrl: id ? prev.currentImageUrl : "" 
    }));
    setImagePreview("");
    const fileInput = document.getElementById("imageFile");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {id ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            )}
          </svg>
          {id ? "Edit Product" : "Create New Product"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          {id ? "Update product details" : "Add a new product to your catalog"}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Product Title*
              </div>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter product title"
              required
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Price*
              </div>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400">$</span>
              </div>
              <input
                name="price"
                type="number"
                step="1"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                required
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Category (Optional)
              </div>
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g., Electronics, Clothing, Food"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Product Image (Optional)
              </div>
            </label>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Image File
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <label className="cursor-pointer">
                    <div className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
                      {form.imageFile || (id && form.currentImageUrl) ? "Change Image" : "Choose Image"}
                    </div>
                    <input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {form.imageFile ? form.imageFile.name : "No file chosen"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 10MB. Leave empty to keep current image when editing.
                </p>
              </div>

              {(imagePreview || (id && form.currentImageUrl)) && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {id && !form.imageFile ? "Current Image" : "Preview"}
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="relative">
                    <img 
                      src={imagePreview || form.currentImageUrl} 
                      alt="Product preview" 
                      className="h-128 w-full object-cover rounded-md border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        Failed to load image
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {id && !form.imageFile ? 
                      "To change the image, upload a new file above. To remove the image, click 'Remove'." : 
                      "This is a preview of the selected image."
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Description (Optional)
              </div>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => window.location.href = "/products"}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {id ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {id ? "Update Product" : "Create Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading product details...
          </p>
        </div>
      ):(null)}
    </div>
  );
}