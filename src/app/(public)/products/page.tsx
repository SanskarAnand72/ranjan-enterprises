import React from 'react';
import Link from 'next/link';
import { getProducts } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import type { ProductFilters } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
              <button type="submit" className="absolute right-3 text-stone-400 hover:text-primary" aria-label="Submit search">
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
                  {productsData.data.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
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
