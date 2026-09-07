import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/actions/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { getSettings } from '@/actions/settings';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  if (!product) return {};

  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.short_description || `Premium handcrafted ${product.name} custom built woodwork by Ranjan Enterprises.`,
    openGraph: {
      title: product.meta_title || product.name,
      description: product.meta_description || product.short_description || `Premium handcrafted ${product.name} custom built woodwork.`,
      images: product.cover_image_url ? [{ url: product.cover_image_url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const [settings, relatedProducts] = await Promise.all([
    getSettings(),
    getRelatedProducts(product.id, product.category_id),
  ]);

  return (
    <ProductDetailClient
      product={product}
      settings={settings}
      relatedProducts={relatedProducts}
    />
  );
}
