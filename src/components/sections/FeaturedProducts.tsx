'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product, Category } from '@/types';

interface FeaturedProductsProps {
  products: Product[];
  categories: Category[];
}

export default function FeaturedProducts({ products, categories }: FeaturedProductsProps) {
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
          {products.map((product, index) => {
            const hasCover = !!product.cover_image_url;
            const fallbackImage = 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=600&auto=format&fit=crop';
            const imageUrl = product.cover_image_url || fallbackImage;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative flex flex-col bg-background rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-hover border border-stone-200/55 transition-all duration-500"
              >
                {/* Image Showcase */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=600&auto=format&fit=crop';
                    }}
                  />
                  {/* Glass Card Gradient Shine */}
                  <div className="absolute inset-0 bg-card-shine opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary text-white shadow-md">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Signature</span>
                    </span>
                  </div>

                  {product.category?.name && (
                    <span className="absolute bottom-4 left-4 z-10 inline-flex px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase bg-stone-900/80 text-white backdrop-blur-sm">
                      {product.category.name}
                    </span>
                  )}
                </div>

                {/* Info Content */}
                <div className="flex-grow p-6 flex flex-col justify-between">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.short_description || product.description || 'Custom hand-finished masterpiece.'}
                    </p>
                  </div>

                  {/* Bottom Panel */}
                  <div className="flex items-center justify-between border-t border-stone-200/60 pt-4 mt-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Price</span>
                      <span className="text-sm font-semibold text-primary">
                        {product.price_label || (product.price ? formatPrice(product.price) : 'Price on Request')}
                      </span>
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-primary hover:bg-primary hover:text-white rounded-full text-xs font-semibold tracking-wide transition-all duration-300"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
