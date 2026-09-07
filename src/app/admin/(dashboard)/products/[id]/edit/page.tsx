import React from 'react';
import { notFound } from 'next/navigation';
import { getProductById } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import ProductForm from '@/components/admin/ProductForm';
import type { Metadata } from 'next';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Catalog Product',
};

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = await params;
  
  const [product, categories] = await Promise.all([
    getProductById(resolvedParams.id),
    getCategories(false),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
          Workspace Catalogue
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-850">
          Edit Catalog Product
        </h1>
      </div>

      {/* Editing Form component */}
      <ProductForm 
        initialProduct={product} 
        categories={categories} 
      />



    </div>
  );
}
