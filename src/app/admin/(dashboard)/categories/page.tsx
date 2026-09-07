import React from 'react';
import { getCategories } from '@/actions/categories';
import CategoryManager from '@/components/admin/CategoryManager';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories Management',
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories(false); // Fetch active and hidden categories

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
          Workspace Catalogue
        </span>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Category Management
        </h1>
      </div>

      {/* Category Manager UI client element */}
      <CategoryManager initialCategories={categories} />

    </div>
  );
}
