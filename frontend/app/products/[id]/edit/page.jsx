import ProductForm from "@/app/components/ProductForm";

export default async function EditProductPage({ params }) {
  const { id } = await params; 
  
  return <ProductForm id={id} />;
}