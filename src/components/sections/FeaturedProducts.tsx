'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Sparkles } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import type { Product, Category } from '@/types';

interface FeaturedProductsProps {
  products: Product[];
  categories: Category[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return (
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
          <div className="flex flex-col gap-2 mb-8 items-center">
            <div className="section-tag mb-1">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>CURATED COLLECTION</span>
            </div>
            <h2 className="section-title">Signature Wooden Masterpieces</h2>
          </div>
          <div className="py-16 px-6 w-full max-w-xl bg-white border border-stone-200/80 rounded-3xl flex flex-col items-center gap-4 shadow-luxury">
            <Star className="w-10 h-10 text-accent/50" />
            <p className="text-stone-800 font-serif text-2xl font-semibold">Catalog Updating</p>
            <p className="text-stone-500 text-xs sm:text-sm font-light max-w-md">
              Our workshop is currently finishing a new collection of handcrafted doors and carved mandirs. Contact us directly for active workshop inquiries.
            </p>
            <Link href="/contact" className="btn-primary mt-2 text-xs uppercase tracking-wider">
              Request Custom Catalog
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-stone-200/60 pb-8">
          <div className="flex flex-col gap-2">
            <div className="section-tag w-fit mb-1">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>CURATED COLLECTION</span>
            </div>
            <h2 className="section-title">Signature Masterpieces</h2>
            <p className="text-stone-600 text-sm font-light max-w-lg mt-1">
              Each piece is carved from hand-selected solid timber, kiln-dried and polished to perfection by our master joiners.
            </p>
          </div>
          <Link
            href="/products"
            className="btn-outline text-xs uppercase tracking-wider hover-lift self-start md:self-auto"
          >
            <span>Explore Complete Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
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

