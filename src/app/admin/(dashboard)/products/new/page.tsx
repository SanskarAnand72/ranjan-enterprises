import React from 'react';
import { getCategories } from '@/actions/categories';
import ProductForm from '@/components/admin/ProductForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Product Creation',
};

export default async function AdminNewProductPage() {
  const categories = await getCategories(false);

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
          Workspace Catalogue
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-850">
          Create New Product
        </h1>
      </div>

      {/* Creation form component */}
      <ProductForm categories={categories} />

    </div>
  );
}
