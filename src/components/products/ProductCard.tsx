'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Tag, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800&auto=format&fit=crop';

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(product.cover_image_url || DEFAULT_PLACEHOLDER);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(DEFAULT_PLACEHOLDER);
    }
  };

  const discount = product.discount_percentage || 0;
  const isFeatured = product.is_featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
      className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-hover border border-stone-250/60 transition-all duration-500 hover:-translate-y-1.5"
    >
      {/* Top Image Box */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 flex-shrink-0">
        
        {/* Loading Skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 skeleton z-0" />
        )}

        {/* Product Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={product.name}
          onLoad={() => setIsLoaded(true)}
          onError={handleImageError}
          className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {/* Shine Overlay */}
        <div className="absolute inset-0 bg-card-shine opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Badges Container */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-start justify-between pointer-events-none">
          <div className="flex flex-col gap-1.5 items-start">
            {isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-primary text-white shadow-md">
                <Star className="w-2.5 h-2.5 fill-current" />
                <span>Signature</span>
              </span>
            )}
            {product.wood_type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-100 backdrop-blur-md shadow-sm border border-amber-800/40">
                Wood: {product.wood_type}
              </span>
            )}
          </div>

          {discount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wider uppercase bg-red-600 text-white shadow-md">
              <Tag className="w-2.5 h-2.5" />
              <span>{discount}% OFF</span>
            </span>
          )}
        </div>

        {/* Category Pill */}
        {product.category?.name && (
          <span className="absolute bottom-3 left-3.5 z-10 inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase bg-stone-900/80 text-white backdrop-blur-sm border border-white/10">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Card Body - Flex Grow to push footer down evenly */}
      <div className="p-5 flex-grow flex flex-col justify-between gap-4">
        
        <div className="flex flex-col gap-2">
          <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-light">
            {product.short_description || product.description || 'Bespoke custom woodwork handcrafted by master artisans.'}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-3.5 border-t border-stone-200/60 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider">Investment</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-primary font-serif">
                {product.price_label || (product.price ? formatPrice(product.price) : 'Price on Request')}
              </span>
              {product.original_price && product.price && product.original_price > product.price && (
                <span className="text-2xs text-stone-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-stone-100 hover:bg-primary hover:text-white text-stone-800 rounded-full text-xs font-semibold tracking-wide transition-all duration-300"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </motion.div>
  );
}
