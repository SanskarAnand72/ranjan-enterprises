'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Trash2, Edit2, Plus, Image as ImageIcon, Star, Tag, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { deleteProduct, updateProductStatus, toggleFeatured } from '@/actions/products';
import type { Product } from '@/types';

export default function ProductListManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isPending, setIsPending] = useState(false);

  // Delete Modal State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsPending(true);
    const res = await deleteProduct(deleteTargetId);
    if (res.success) {
      setProducts(products.filter(p => p.id !== deleteTargetId));
    } else {
      alert(`Delete failed: ${res.error}`);
    }
    setIsPending(false);
    setDeleteTargetId(null);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setIsPending(true);
    const res = await updateProductStatus(id, newStatus);
    if (res.success) {
      setProducts(products.map(p => p.id === id ? { ...p, status: newStatus as any } : p));
    }
    setIsPending(false);
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    setIsPending(true);
    const res = await toggleFeatured(id, !currentFeatured);
    if (res.success) {
      setProducts(products.map(p => p.id === id ? { ...p, is_featured: !currentFeatured } : p));
    }
    setIsPending(false);
  };

  // Filter products
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku?.toLowerCase().includes(search.toLowerCase()) ||
                          p.wood_type?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category_id === categoryFilter || p.category?.id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      {/* Action Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search products by name, SKU, or wood type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
          />
        </div>
        
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-amber-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Product</span>
        </Link>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-500 w-16">Cover</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-500">Product Name & SKU</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-500">Category & Wood</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-500">Price & Discount</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-500">Featured</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-500">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(product => {
                const discountPct = product.discount_percentage || (
                  product.original_price && product.price && product.original_price > product.price
                    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                    : 0
                );

                return (
                  <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-xl border border-stone-200 overflow-hidden bg-stone-100 flex items-center justify-center shadow-xs">
                        {product.cover_image_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={product.cover_image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=400&auto=format&fit=crop';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-stone-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</span>
                        <div className="flex items-center gap-2 text-2xs text-stone-500">
                          {product.sku && <span className="font-mono uppercase">SKU: {product.sku}</span>}
                          <span className="text-stone-300">•</span>
                          <span className="font-mono text-stone-400">/{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-stone-800">{product.category?.name || 'General'}</span>
                        {product.wood_type && (
                          <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 self-start">
                            {product.wood_type}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          {product.original_price && product.price && product.original_price > product.price && (
                            <span className="text-2xs text-stone-400 line-through">
                              {formatPrice(product.original_price)}
                            </span>
                          )}
                          <span className="font-extrabold text-amber-700 text-sm">
                            {product.price ? formatPrice(product.price) : 'Price on Request'}
                          </span>
                        </div>
                        {discountPct > 0 && (
                          <span className="text-[10px] font-bold text-red-600">
                            {discountPct}% OFF
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                        disabled={isPending}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          product.is_featured 
                            ? 'bg-amber-100 border-amber-300 text-amber-700' 
                            : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700'
                        }`}
                        title={product.is_featured ? 'Featured on Homepage' : 'Click to Feature'}
                      >
                        <Star className={`w-4 h-4 ${product.is_featured ? 'fill-amber-600 text-amber-600' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={product.status}
                        onChange={(e) => handleStatusChange(product.id, e.target.value)}
                        disabled={isPending}
                        className={`text-xs font-bold border rounded-lg py-1 px-2.5 focus:ring-0 cursor-pointer ${
                          product.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(product.id)}
                          disabled={isPending}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-stone-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm font-bold text-stone-700">No products found</p>
                      <p className="text-xs text-stone-400">Try adjusting your search criteria or create a new product.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-stone-200 shadow-2xl flex flex-col gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete Product</h3>
              <p className="text-xs text-stone-500 mt-1">
                Are you sure you want to delete this product? This will remove the Firestore document and associated Cloudinary images permanently.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                disabled={isPending}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isPending}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-red-600/20"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>{isPending ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
