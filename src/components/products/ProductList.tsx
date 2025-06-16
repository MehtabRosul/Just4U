import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  onViewDetails?: (product: Product) => void;
}

export function ProductList({ products, onViewDetails }: ProductListProps) {
  if (!products || products.length === 0) {
    return <p className="text-center text-muted-foreground py-10">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}
