'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormData } from '@/lib/validations/product';
import { createProduct, updateProduct, addProductImages, deleteProductImage, setCoverImage } from '@/actions/products';
import { Save, Plus, Trash2, Star, Image as ImageIcon, Loader2, ArrowUp, ArrowDown, CheckCircle2, AlertCircle, Sparkles, Tag, Layers, Ruler } from 'lucide-react';
import { slugify, generateSKU, formatPrice } from '@/lib/utils';
import type { Product, Category } from '@/types';
import { uploadFileToCloudinary, deleteFileFromCloudinary } from '@/actions/storage';

interface ProductFormProps {
  initialProduct?: Product | null;
  categories: Category[];
}

const COMMON_WOOD_TYPES = [
  'Teak Wood',
  'Sal Wood',
  'Sheesham Wood',
  'Pine Wood',
  'Mahogany',
  'Rosewood',
  'Mango Wood',
  'White Cedar',
  'Rubberwood',
  'Custom Wood Mix',
];

const COMMON_FINISH_TYPES = [
  'Natural Polish',
  'Dark Walnut Polish',
  'Honey Oak Finish',
  'Matte PU Coating',
  'Gloss Melamine Finish',
  'Antique Wax Polish',
  'Raw Unfinished',
];

export default function ProductForm({ initialProduct, categories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<any[]>(initialProduct?.images || []);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: initialProduct?.name || '',
      slug: initialProduct?.slug || '',
      sku: initialProduct?.sku || '',
      category_id: initialProduct?.category_id || '',
      price: initialProduct?.price ?? null,
      original_price: initialProduct?.original_price ?? null,
      discount_percentage: initialProduct?.discount_percentage ?? null,
      short_description: initialProduct?.short_description || '',
      description: initialProduct?.description || '',
      wood_type: initialProduct?.wood_type || '',
      material_type: initialProduct?.material_type || 'Solid Wood',
      finish_type: initialProduct?.finish_type || '',
      color: initialProduct?.color || '',
      thickness: initialProduct?.thickness || '',
      durability_info: initialProduct?.durability_info || 'Termite Resistant & Water Proof',
      warranty_info: initialProduct?.warranty_info || '5 Years Manufacturer Warranty',
      dimensions: initialProduct?.dimensions || '',
      height: initialProduct?.height || '',
      width: initialProduct?.width || '',
      length: initialProduct?.length || '',
      weight: initialProduct?.weight || '',
      status: initialProduct?.status || 'published',
      stock_status: initialProduct?.stock_status || 'in_stock',
      in_stock: initialProduct?.in_stock ?? true,
      is_featured: initialProduct?.is_featured || false,
      specifications: initialProduct?.specifications || [
        { key: 'Material', value: '100% Seasoned Solid Wood' },
        { key: 'Craftsmanship', value: 'Handcrafted by Master Artisans' },
      ],
    },
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control,
    name: 'specifications',
  });

  const prodName = watch('name');
  const originalPrice = watch('original_price');
  const sellingPrice = watch('price');

  // Auto-generate Slug & SKU
  useEffect(() => {
    if (prodName && !initialProduct) {
      setValue('slug', slugify(prodName));
      if (!watch('sku')) setValue('sku', generateSKU(prodName));
    }
  }, [prodName, setValue, initialProduct, watch]);

  // Auto-calculate discount percentage when prices change
  useEffect(() => {
    if (originalPrice && sellingPrice && originalPrice > sellingPrice) {
      const pct = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
      setValue('discount_percentage', pct);
    } else if (originalPrice && sellingPrice && sellingPrice >= originalPrice) {
      setValue('discount_percentage', 0);
    }
  }, [originalPrice, sellingPrice, setValue]);

  // Handle Cloudinary Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setErrorMsg(null);
    const newImages: any[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await uploadFileToCloudinary('products', formData);
      
      if (uploadRes.error) {
        console.error('Cloudinary Upload error:', uploadRes.error);
        setErrorMsg(`Cloudinary upload failed: ${uploadRes.error}`);
        continue;
      }
      
      const publicUrl = uploadRes.publicUrl || uploadRes.url;
      const publicId = uploadRes.public_id || uploadRes.storage_path;
      
      newImages.push({
        id: 'temp-' + Date.now() + '-' + i,
        public_id: publicId,
        storage_path: publicId,
        url: publicUrl,
        is_cover: images.length === 0 && i === 0,
        display_order: images.length + i,
      });
    }
    
    if (initialProduct && newImages.length > 0) {
      await addProductImages(initialProduct.id, newImages.map((img, i) => ({
        public_id: img.public_id,
        storage_path: img.storage_path,
        url: img.url,
        is_cover: img.is_cover,
        display_order: images.length + i,
      })));
      router.refresh();
    }
    
    setImages(prev => [...prev, ...newImages]);
    setIsUploading(false);
    e.target.value = '';
  };

  const handleSetCover = async (imgId: string) => {
    if (initialProduct && !imgId.startsWith('temp-')) {
      await setCoverImage(imgId, initialProduct.id);
    }
    setImages(images.map(img => ({ ...img, is_cover: img.id === imgId })));
  };

  const handleDeleteImage = async (imgId: string, storagePath: string) => {
    if (!confirm('Are you sure you want to delete this product image?')) return;
    if (initialProduct && !imgId.startsWith('temp-')) {
      await deleteProductImage(imgId, storagePath);
    } else if (storagePath) {
      await deleteFileFromCloudinary(storagePath);
    }
    setImages(images.filter(img => img.id !== imgId));
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newImages.length) return;
    
    const temp = newImages[index];
    newImages[index] = newImages[targetIdx];
    newImages[targetIdx] = temp;

    // Update display orders
    newImages.forEach((img, i) => { img.display_order = i; });
    setImages(newImages);
  };

  const addPresetSpec = (key: string, value: string = '') => {
    appendSpec({ key, value });
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsPending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formattedImages = images.map((img, i) => ({
        id: img.id,
        public_id: img.public_id || img.storage_path || '',
        storage_path: img.public_id || img.storage_path || '',
        url: img.url,
        is_cover: Boolean(img.is_cover),
        display_order: i,
      }));

      const payload = {
        ...data,
        images: formattedImages,
      };

      if (initialProduct) {
        const res = await updateProduct(initialProduct.id, payload);
        if (!res.success) {
          setErrorMsg(res.error || 'Failed to update product');
          return;
        }
        setSuccessMsg('Product updated successfully! Live website updated.');
      } else {
        const res = await createProduct(payload);
        if (!res.success) {
          setErrorMsg(res.error || 'Failed to create product');
          return;
        }
        setSuccessMsg('Product created successfully! Live website updated.');
      }

      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 600);
    } catch (e: any) {
      console.error('Submit Product error:', e);
      setErrorMsg(e.message || 'An unexpected error occurred while saving.');
    } finally {
      setIsPending(false);
    }
  };

  const computedDiscount = originalPrice && sellingPrice && originalPrice > sellingPrice 
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 max-w-5xl pb-24">
      
      {/* Alert Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm font-semibold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 text-sm font-semibold animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Basic Info & Category */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <Layers className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-gray-900">Basic Information & Categorization</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Product Name *
            </label>
            <input
              {...register('name')}
              placeholder="E.g., Royal Hand-Carved Teak Wood Dining Table"
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
            {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              {...register('category_id')}
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            >
              <option value="">Select Category...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              SKU Code
            </label>
            <input
              {...register('sku')}
              placeholder="E.g., RE-TEAK-TBL-001"
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>

          {/* URL Slug */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              URL Slug *
            </label>
            <div className="flex items-center bg-stone-50 border border-gray-300 rounded-xl overflow-hidden px-4 py-3">
              <span className="text-xs text-stone-400 font-mono select-none">/products/</span>
              <input
                {...register('slug')}
                placeholder="royal-hand-carved-teak-wood-dining-table"
                className="w-full bg-transparent text-sm font-mono text-gray-900 focus:outline-none ml-1"
              />
            </div>
            {errors.slug && <span className="text-xs text-red-500 mt-1">{errors.slug.message}</span>}
          </div>
        </div>
      </div>

      {/* 2. Pricing & Discount System */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-gray-900">Pricing & Discount System</h2>
          </div>
          {computedDiscount > 0 && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              {computedDiscount}% OFF APPLIED
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Original Price */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Original Price / MRP (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-stone-400 font-bold text-sm">₹</span>
              <input
                type="number"
                step="0.01"
                {...register('original_price', { valueAsNumber: true })}
                placeholder="10000"
                className="w-full pl-8 pr-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">Maximum Retail Price before discount</span>
          </div>

          {/* Selling Price */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Selling / Starting Price (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-stone-400 font-bold text-sm">₹</span>
              <input
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                placeholder="8000"
                className="w-full pl-8 pr-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-bold text-amber-700 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">Actual customer purchasing price</span>
          </div>

          {/* Discount Percentage */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Discount Percentage (% OFF)
            </label>
            <div className="relative">
              <input
                type="number"
                {...register('discount_percentage', { valueAsNumber: true })}
                placeholder="20"
                className="w-full pr-8 pl-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-bold text-emerald-700 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <span className="absolute right-3.5 top-3 text-stone-400 font-bold text-sm">%</span>
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">Auto-calculated or manually specified</span>
          </div>
        </div>

        {/* Price Preview Card */}
        <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-center justify-between">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Customer Live Price Badge Preview:</span>
          <div className="flex items-center gap-2">
            {originalPrice && originalPrice > (sellingPrice || 0) && (
              <span className="text-sm font-semibold text-stone-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-base font-extrabold text-amber-700">
              {sellingPrice ? formatPrice(sellingPrice) : 'Price on Request'}
            </span>
            {computedDiscount > 0 && (
              <span className="px-2.5 py-0.5 bg-red-600 text-white text-[11px] font-bold rounded-full">
                {computedDiscount}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Wood & Material Specifications */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-gray-900">Wood & Material Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Wood Type */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Wood Type
            </label>
            <input
              list="wood-types-list"
              {...register('wood_type')}
              placeholder="E.g., Teak Wood, Sheesham"
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
            <datalist id="wood-types-list">
              {COMMON_WOOD_TYPES.map(w => <option key={w} value={w} />)}
            </datalist>
          </div>

          {/* Material Type */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Material Type
            </label>
            <input
              {...register('material_type')}
              placeholder="E.g., 100% Solid Teak Wood"
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Finish Type */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Finish Type
            </label>
            <input
              list="finish-types-list"
              {...register('finish_type')}
              placeholder="E.g., Dark Walnut PU Polish"
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
            <datalist id="finish-types-list">
              {COMMON_FINISH_TYPES.map(f => <option key={f} value={f} />)}
            </datalist>
          </div>

          {/* Color / Shade */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Color / Stain
            </label>
            <input
              {...register('color')}
              placeholder="E.g., Natural Golden Teak"
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Thickness */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Wood Thickness
            </label>
            <input
              {...register('thickness')}
              placeholder="E.g., 32 mm Top"
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Warranty Info */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Warranty Information
            </label>
            <input
              {...register('warranty_info')}
              placeholder="E.g., 5 Years Warranty"
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Durability Information */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Durability & Maintenance Info
            </label>
            <input
              {...register('durability_info')}
              placeholder="E.g., Termite Resistant, Water Resistant, Kiln-dried to 8% moisture level."
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Product Dimensions & Weight */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <Ruler className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-gray-900">Dimensions & Weight</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Height
            </label>
            <input
              {...register('height')}
              placeholder="E.g., 30 inches"
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Width
            </label>
            <input
              {...register('width')}
              placeholder="E.g., 36 inches"
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Length
            </label>
            <input
              {...register('length')}
              placeholder="E.g., 72 inches"
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Weight
            </label>
            <input
              {...register('weight')}
              placeholder="E.g., 55 kg"
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-4">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Overall Dimensions Summary
            </label>
            <input
              {...register('dimensions')}
              placeholder="E.g., 72 L x 36 W x 30 H inches (Customizable)"
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 5. Custom Product Specifications */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Custom Technical Specifications</h2>
            <p className="text-xs text-stone-500">Add unlimited key-value specifications for exact detailing.</p>
          </div>
          <button
            type="button"
            onClick={() => appendSpec({ key: '', value: '' })}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Spec</span>
          </button>
        </div>

        {/* Presets Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Quick Presets:</span>
          {['Height', 'Width', 'Length', 'Weight', 'Material', 'Finish', 'Installation Type', 'Seating Capacity'].map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => addPresetSpec(preset)}
              className="px-2.5 py-1 bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-stone-700 hover:text-amber-800 text-xs font-semibold rounded-lg transition-colors"
            >
              + {preset}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {specFields.map((field, idx) => (
            <div key={field.id} className="flex items-center gap-3">
              <input
                {...register(`specifications.${idx}.key` as const)}
                placeholder="Key (e.g. Installation)"
                className="w-1/3 px-4 py-2.5 bg-stone-50 border border-gray-300 rounded-xl text-sm font-semibold"
              />
              <input
                {...register(`specifications.${idx}.value` as const)}
                placeholder="Value (e.g. Pre-Assembled)"
                className="flex-grow px-4 py-2.5 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => removeSpec(idx)}
                className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Remove Spec"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {specFields.length === 0 && (
            <div className="text-center py-6 bg-stone-50 rounded-xl text-xs text-stone-500 font-medium">
              No custom specifications added yet. Click &quot;Add Custom Spec&quot; or use a preset above.
            </div>
          )}
        </div>
      </div>

      {/* 6. Descriptions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Descriptions</h2>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Short Description (Catalog Preview)
          </label>
          <textarea
            {...register('short_description')}
            rows={2}
            placeholder="Brief 1-2 sentence overview of the product for product cards."
            className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Full Description
          </label>
          <textarea
            {...register('description')}
            rows={5}
            placeholder="Detailed description of craftsmanship, wood source, customization options, and features."
            className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* 7. Product Images (Cloudinary) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-900">Cloudinary Product Images</h2>
            <span className="text-xs text-stone-500">Upload multiple images, set cover image, and reorder.</span>
          </div>
          <div>
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-600/20 transition-all ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>{isUploading ? 'Uploading to Cloudinary...' : 'Upload Cloudinary Images'}</span>
            </label>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 text-stone-500 flex flex-col items-center justify-center gap-2">
            <ImageIcon className="w-10 h-10 text-stone-400" />
            <p className="text-sm font-bold text-stone-700">No images uploaded yet</p>
            <p className="text-xs text-stone-400 max-w-sm">
              Click the button above to upload high quality product photos directly to Cloudinary.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className={`relative group aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  img.is_cover
                    ? 'border-amber-500 ring-4 ring-amber-500/20 shadow-lg'
                    : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt="Product"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=400&auto=format&fit=crop';
                  }}
                />

                {img.is_cover && (
                  <span className="absolute top-2 left-2 z-10 bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> COVER IMAGE
                  </span>
                )}

                {/* Hover overlay with action controls */}
                <div className="absolute inset-0 bg-stone-950/75 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between z-20">
                  <div className="flex items-center justify-end gap-1">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'up')}
                        className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-stone-900 rounded-lg text-xs font-bold transition-colors"
                        title="Move Left"
                      >
                        <ArrowUp className="w-3.5 h-3.5 rotate-270" />
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'down')}
                        className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-stone-900 rounded-lg text-xs font-bold transition-colors"
                        title="Move Right"
                      >
                        <ArrowDown className="w-3.5 h-3.5 rotate-270" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {!img.is_cover && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(img.id)}
                        className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold rounded-lg shadow-sm"
                      >
                        Set as Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id, img.public_id || img.storage_path)}
                      className="w-full py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8. Status & Featured Toggle */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Status & Homepage Visibility</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl">
            <input
              type="checkbox"
              id="is_featured"
              {...register('is_featured')}
              className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="is_featured" className="text-sm font-bold text-stone-800 cursor-pointer">
              Mark as Featured Product (Shows on Homepage Showcase)
            </label>
          </div>

          <div className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-200 rounded-xl">
            <input
              type="checkbox"
              id="in_stock"
              {...register('in_stock')}
              className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="in_stock" className="text-sm font-bold text-stone-800 cursor-pointer">
              In Stock & Ready to Dispatch
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Visibility Status
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900"
            >
              <option value="published">Published (Visible on Live Website)</option>
              <option value="draft">Draft (Hidden from Public)</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Stock Availability Tag
            </label>
            <select
              {...register('stock_status')}
              className="w-full px-4 py-3 bg-stone-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900"
            >
              <option value="in_stock">In Stock</option>
              <option value="made_to_order">Made to Order (Custom Order)</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </div>
      </div>

      {/* Floating Save Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-stone-900/95 border-t border-white/10 backdrop-blur-md p-4 px-6 md:px-12 flex items-center justify-between z-30 shadow-2xl">
        <span className="text-xs text-stone-400 font-medium hidden sm:inline">
          {initialProduct ? `Editing Product: ${initialProduct.name}` : 'Creating New Master Product'}
        </span>

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending || isUploading}
            className="px-6 py-2.5 border border-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || isUploading}
            className="px-8 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isPending || isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isUploading ? 'Uploading Media...' : 'Saving to Firestore...'}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{initialProduct ? 'Save Changes' : 'Create Product'}</span>
              </>
            )}
          </button>
        </div>
      </div>

    </form>
  );
}
