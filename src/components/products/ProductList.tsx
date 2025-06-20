
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  console.log("[ProductList Component] Received products count:", products ? products.length : 'undefined'); // DIAGNOSTIC
  if (!products || products.length === 0) {
    // Enhanced message for clarity during debugging
    return <p className="text-center text-muted-foreground py-10">No products found to display (message from ProductList component).</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
