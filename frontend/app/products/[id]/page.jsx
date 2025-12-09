import ProductDetailClient from "@/app/products/ProductDetailClient";
import { Suspense } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { stringify } from "querystring";

async function getProduct(id) {
  try {
    const res = await fetch(
      `${
        process.env.VITE_API_URL || "http://localhost:3000"
      }/products/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  
  const product = await getProduct(id);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductDetailClient initialProduct={product} />
    </Suspense>
  );
}
