import React from 'react';
import Link from 'next/link';
import { getProducts } from '@/actions/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { getCategories } from '@/actions/categories';
import { formatPrice } from '@/lib/utils';
import { Search, SlidersHorizontal, ArrowRight, Eye, Star } from 'lucide-react';
import type { ProductFilters } from '@/types';

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const search = resolvedParams.search || '';
  const category = resolvedParams.category || '';
  const sort = (resolvedParams.sort || 'display_order') as any;

  const filters: ProductFilters = {
    search,
    category: category || undefined,
    sort,
    page,
    pageSize: 9,
    status: 'published',
  };

  const [productsData, categories] = await Promise.all([
    getProducts(filters),
    getCategories(true),
  ]);

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="flex flex-col gap-2 mb-10 text-center md:text-left">
          <span className="section-subtitle">Exquisite Catalogue</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
            Our Custom Creations
          </h1>
          <p className="text-muted-foreground max-w-xl font-light text-sm mt-1">
            Browse through our premium handmade wooden products, each tailored to perfection. Make an inquiry directly for customization options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Filter Sidebar (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            
            {/* Search Input Form */}
            <form method="GET" action="/products" className="relative flex items-center">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search collection..."
                className="input-luxury text-xs pr-10"
              />
              {category && <input type="hidden" name="category" value={category} />}
              {sort && <input type="hidden" name="sort" value={sort} />}
              <button type="submit" className="absolute right-3 text-stone-400 hover:text-primary">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Filter Group: Categories */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-stone-250 pb-2 text-stone-800">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span className="font-serif text-sm font-bold uppercase tracking-wider">Categories</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <Link
                  href={`/products?search=${search}&sort=${sort}`}
                  className={`text-xs font-semibold py-2 px-3 rounded-lg transition-all duration-300 ${
                    !category
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  All Masterpieces
                </Link>

                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.id}&search=${search}&sort=${sort}`}
                    className={`text-xs font-semibold py-2 px-3 rounded-lg transition-all duration-300 ${
                      category === cat.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Filter Group: Sorting options */}
            <div className="flex flex-col gap-4">
              <span className="font-serif text-sm font-bold uppercase tracking-wider text-stone-800 border-b border-stone-250 pb-2">
                Sort Collection
              </span>
              <div className="flex flex-col gap-1 text-xs">
                {[
                  { label: 'Display Order', value: 'display_order' },
                  { label: 'Newest Additions', value: 'newest' },
                  { label: 'Oldest Creations', value: 'oldest' },
                  { label: 'Price: Low to High', value: 'price_asc' },
                  { label: 'Price: High to Low', value: 'price_desc' },
                ].map((option) => (
                  <Link
                    key={option.value}
                    href={`/products?sort=${option.value}${category ? `&category=${category}` : ''}${
                      search ? `&search=${search}` : ''
                    }`}
                    className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                      sort === option.value
                        ? 'text-primary bg-primary/5 font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Catalog Grid (9 cols) */}
          <div className="lg:col-span-9 flex flex-col gap-10">
            {productsData.data.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-stone-200/60 shadow-sm flex flex-col items-center justify-center gap-4">
                <p className="text-stone-500 font-serif text-2xl">No products available yet.</p>
                <p className="text-stone-400 font-light max-w-md mx-auto text-sm">
                  {search || category ? 'Try adjusting your filters or search terms.' : 'We are currently updating our catalog with new premium wooden creations. Please check back later.'}
                </p>
                {(search || category) && (
                  <Link href="/products" className="inline-block mt-4 px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-bold uppercase tracking-wider transition-colors">
                    Clear Filters
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsData.data.map((product) => {
                    const fallbackImage = 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=600&auto=format&fit=crop';
                    const imageUrl = product.cover_image_url || fallbackImage;

                    return (
                      <div
                        key={product.id}
                        className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-hover border border-stone-250/50 transition-all duration-500"
                      >
                        {/* Image block */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = fallbackImage;
                            }}
                          />
                          <div className="absolute inset-0 bg-card-shine opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                          {product.is_featured && (
                            <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-primary text-white">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>Signature</span>
                            </span>
                          )}

                          {(product.discount_percentage || 0) > 0 && (
                            <span className="absolute top-4 right-4 z-10 inline-flex px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wider uppercase bg-red-600 text-white shadow-md">
                              {product.discount_percentage}% OFF
                            </span>
                          )}

                          {product.category?.name && (
                            <span className="absolute bottom-4 left-4 z-10 inline-flex px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase bg-stone-900/80 text-white backdrop-blur-sm">
                              {product.category.name}
                            </span>
                          )}
                        </div>

                        {/* Text info content */}
                        <div className="flex-grow p-6 flex flex-col justify-between">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                {product.name}
                              </h3>
                            </div>
                            {product.wood_type && (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 self-start">
                                Wood: {product.wood_type}
                              </span>
                            )}
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {product.short_description || product.description || 'Custom crafted and hand-finished woodworking masterpieces.'}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-stone-200/60 pt-4 mt-6">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">Investment</span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-sm font-bold text-primary">
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
                              className="inline-flex items-center gap-1 px-3.5 py-2 bg-secondary text-primary hover:bg-primary hover:text-white rounded-full text-2xs font-bold tracking-wide transition-all duration-300"
                            >
                              <span>View details</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {productsData.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    {Array.from({ length: productsData.totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      const active = page === pageNum;
                      
                      return (
                        <Link
                          key={pageNum}
                          href={`/products?page=${pageNum}${category ? `&category=${category}` : ''}${
                            search ? `&search=${search}` : ''
                          }${sort ? `&sort=${sort}` : ''}`}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold transition-all duration-300 border ${
                            active
                              ? 'bg-primary border-primary text-white shadow-md'
                              : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
