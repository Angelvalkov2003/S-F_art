import { ProductList } from "@/components/product-list";
import { getProductsList } from "@/data/products";
import { Suspense } from "react";

export default async function ProductsPage() {
  const products = getProductsList();

  return (
    <div className="pb-8">
      <h1 className="text-3xl font-bold leading-none tracking-tight bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent text-center mb-8">
        Нашите произведения
      </h1>
      <Suspense fallback={<div className="text-center py-8">Зареждане...</div>}>
        <ProductList products={products.data} />
      </Suspense>
    </div>
  );
}
