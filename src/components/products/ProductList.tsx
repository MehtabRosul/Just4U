
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p className="text-lg font-semibold">No Products Found</p>
        <p>We couldn't find any products matching your current selections.</p>
        <p className="text-sm mt-2">Please try adjusting your filters or check back later.</p>
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
