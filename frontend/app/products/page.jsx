import ProductTable from "@/app/components/ProductTable";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await fetch(process.env.VITE_API_URL + "/products").then((r) =>
    r.json()
  );

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </Link>
      </div>

      <ProductTable products={products} />
    </div>
  );
}
