import React from 'react';
import { getProducts } from '@/actions/products';
import ProductListManager from '@/components/admin/ProductListManager';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workshop Products Catalog',
};

export default async function AdminProductsPage() {
  // Fetch up to 100 products for listing in the workspace panel
  const products = await getProducts({ page: 1, pageSize: 100 });

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
          Workspace Catalogue
        </span>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Products Management
        </h1>
      </div>

      {/* Catalog items list Client Component */}
      <ProductListManager initialProducts={products.data} />

    </div>
  );
}
