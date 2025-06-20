
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  console.log("[ProductList Component] Received products. Count:", products ? products.length : 'undefined');
  if (products && products.length > 0) {
    // Log only a sample to avoid flooding console if many products
    console.log("[ProductList Component] First product sample name:", products[0].name, "ID:", products[0].id, "Price:", products[0].price);
  } else {
    console.warn("[ProductList Component] Received empty or undefined products array.");
  }

  if (!products || products.length === 0) {
    // Adding more specific user-facing message here if this state is reached.
    return (
      <div className="text-center text-muted-foreground py-10">
        <p className="text-lg font-semibold">No Products Found</p>
        <p>We couldn't find any products matching your current filters.</p>
        <p className="text-sm mt-2">(Diagnostic: ProductList component received no products to display.)</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
