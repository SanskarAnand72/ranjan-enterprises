'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import type { Product, Category } from '@/types';

interface FeaturedProductsProps {
  products: Product[];
  categories: Category[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return (
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
          <div className="flex flex-col gap-2 mb-8">
            <span className="section-subtitle">Exquisite Creations</span>
            <h2 className="section-title">Featured Masterpieces</h2>
          </div>
          <div className="py-12 px-6 w-full max-w-2xl bg-stone-50 border border-stone-200/60 rounded-3xl flex flex-col items-center gap-4 shadow-sm">
            <Star className="w-8 h-8 text-stone-300" />
            <p className="text-stone-500 font-serif text-xl">No products available yet.</p>
            <p className="text-stone-400 text-sm font-light max-w-md">
              We are currently updating our collection of signature wooden masterpieces. Please check back soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <span className="section-subtitle">Exquisite Creations</span>
            <h2 className="section-title">Featured Masterpieces</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm group hover:text-primary-dark transition-colors duration-300"
          >
            <span>View All Custom Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
