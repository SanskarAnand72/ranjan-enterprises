'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, MessageSquare, ArrowRight, Star, Check, 
  ChevronRight, Calendar, ArrowLeft, Eye, Send, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { formatPrice, whatsappUrl } from '@/lib/utils';
import { enquirySchema, type EnquiryFormData } from '@/lib/validations/enquiry';
import { submitEnquiry } from '@/actions/enquiries';
import type { Product, SiteSettings, ProductImage } from '@/types';

interface ProductDetailClientProps {
  product: Product;
  settings: SiteSettings;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, settings, relatedProducts }: ProductDetailClientProps) {
  const images: ProductImage[] = product.images || [];
  const defaultImage = 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800&auto=format&fit=crop';
  const coverImage = product.cover_image_url || defaultImage;

  // Active gallery image state
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const activeImage = images.length > 0 ? images[activeImageIdx].url : coverImage;

  // Image Zoom Hover state
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  // Pre-filled messages for contact
  const messageText = `Hello Ranjan Enterprises, I am inquiring about your "${product.name}" (${product.sku || 'N/A'}). I would like to know about options and estimated timelines.`;
  const waUrl = whatsappUrl(settings.whatsapp || '', messageText);

  // Inquiry form hook setup
  const [isPending, setIsPending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      product_category: product.category?.name || '',
      message: `I am interested in inquiring about the "${product.name}" (SKU: ${product.sku || 'N/A'}). Please contact me regarding custom options, wood selection, and delivery timelines.`,
      product_id: product.id,
      product_name: product.name,
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsPending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await submitEnquiry(data);
      if (res.success) {
        setSuccessMsg(res.message || 'Thank you! Your inquiry has been submitted.');
        reset();
      } else {
        setErrorMsg(res.error || 'Failed to submit. Please try again.');
      }
    } catch {
      setErrorMsg('Failed to submit enquiry. Check connection.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs font-semibold tracking-wide text-muted-foreground">
          <Link href="/products" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          {product.category?.name && (
            <>
              <Link href={`/products?category=${product.category_id}`} className="hover:text-primary transition-colors">
                {product.category.name}
              </Link>
              <ChevronRight className="w-3 h-3 text-stone-400" />
            </>
          )}
          <span className="text-stone-850 line-clamp-1">{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Image gallery zoom (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Zoom Wrapper */}
            <div 
              className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-luxury border border-stone-250/50 bg-stone-100 cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = defaultImage;
                }}
              />

              {/* Magnifier Glass Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none bg-no-repeat"
                style={zoomStyle}
              />
            </div>

            {/* Thumbnail Nav list */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                      activeImageIdx === idx ? 'border-primary shadow-md scale-95' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = defaultImage;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Metadata info (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              {product.is_featured && (
                <span className="inline-flex self-start items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Signature Product</span>
                </span>
              )}
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                {product.name}
              </h1>
              {product.sku && (
                <span className="text-2xs font-bold text-muted-foreground uppercase tracking-widest">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            {/* Stock Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-2xs font-extrabold uppercase tracking-widest ${
                product.stock_status === 'in_stock'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : product.stock_status === 'made_to_order'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-stone-100 text-stone-700 border border-stone-300'
              }`}>
                {product.stock_status === 'in_stock' ? 'In Stock & Ready' : product.stock_status === 'made_to_order' ? 'Made to Order (Custom)' : product.stock_status.replace('_', ' ')}
              </span>
              {product.wood_type && (
                <span className="px-3 py-1 bg-stone-100 text-stone-800 rounded-full text-2xs font-bold uppercase tracking-wider border border-stone-200">
                  Wood: {product.wood_type}
                </span>
              )}
            </div>

            {/* Price & Discount Box */}
            <div className="py-5 px-6 bg-stone-50/80 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-2xs text-muted-foreground font-bold uppercase tracking-widest">Pricing Investment</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-serif font-extrabold text-primary">
                    {product.price_label || (product.price ? formatPrice(product.price) : 'Price on Request')}
                  </span>
                  {product.original_price && product.price && product.original_price > product.price && (
                    <span className="text-base text-stone-400 line-through font-semibold">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                  {(product.discount_percentage || 0) > 0 && (
                    <span className="px-2.5 py-1 bg-red-600 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                      {product.discount_percentage}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col text-2xs font-semibold text-stone-600 gap-1.5 border-l border-stone-200 pl-4">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-600" />
                  <span>Factory Direct Pricing</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-600" />
                  <span>100% Seasoned Wood</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 text-sm leading-relaxed text-stone-700">
              <h3 className="font-serif text-base font-bold text-stone-850">Description</h3>
              <p className="font-light whitespace-pre-line">{product.description || product.short_description || 'Custom crafted bespoke woodworking masterpiece by Ranjan Enterprises.'}</p>
            </div>

            {/* Wood & Material Details Card */}
            <div className="bg-amber-50/40 border border-amber-200/70 p-5 rounded-2xl flex flex-col gap-3">
              <h3 className="font-serif text-sm font-bold text-amber-950 uppercase tracking-wider">Wood & Material Details</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {product.wood_type && (
                  <div>
                    <span className="text-stone-500 font-medium block text-[10px] uppercase">Wood Type</span>
                    <span className="font-bold text-stone-900">{product.wood_type}</span>
                  </div>
                )}
                {product.material_type && (
                  <div>
                    <span className="text-stone-500 font-medium block text-[10px] uppercase">Material Type</span>
                    <span className="font-bold text-stone-900">{product.material_type}</span>
                  </div>
                )}
                {product.finish_type && (
                  <div>
                    <span className="text-stone-500 font-medium block text-[10px] uppercase">Finish Type</span>
                    <span className="font-bold text-stone-900">{product.finish_type}</span>
                  </div>
                )}
                {product.color && (
                  <div>
                    <span className="text-stone-500 font-medium block text-[10px] uppercase">Color / Stain</span>
                    <span className="font-bold text-stone-900">{product.color}</span>
                  </div>
                )}
                {product.thickness && (
                  <div>
                    <span className="text-stone-500 font-medium block text-[10px] uppercase">Thickness</span>
                    <span className="font-bold text-stone-900">{product.thickness}</span>
                  </div>
                )}
                {product.warranty_info && (
                  <div>
                    <span className="text-stone-500 font-medium block text-[10px] uppercase">Warranty</span>
                    <span className="font-bold text-stone-900">{product.warranty_info}</span>
                  </div>
                )}
                {product.durability_info && (
                  <div className="col-span-2 border-t border-amber-200/50 pt-2 mt-1">
                    <span className="text-stone-500 font-medium block text-[10px] uppercase">Durability & Quality</span>
                    <span className="font-semibold text-stone-800">{product.durability_info}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Dimensions & Weight Card */}
            {(product.dimensions || product.height || product.width || product.length || product.weight) && (
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl flex flex-col gap-3">
                <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider">Dimensions & Weight</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {product.height && (
                    <div>
                      <span className="text-stone-500 font-medium block text-[10px] uppercase">Height</span>
                      <span className="font-bold text-stone-900">{product.height}</span>
                    </div>
                  )}
                  {product.width && (
                    <div>
                      <span className="text-stone-500 font-medium block text-[10px] uppercase">Width</span>
                      <span className="font-bold text-stone-900">{product.width}</span>
                    </div>
                  )}
                  {product.length && (
                    <div>
                      <span className="text-stone-500 font-medium block text-[10px] uppercase">Length</span>
                      <span className="font-bold text-stone-900">{product.length}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <span className="text-stone-500 font-medium block text-[10px] uppercase">Weight</span>
                      <span className="font-bold text-stone-900">{product.weight}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="col-span-2 sm:col-span-4 border-t border-stone-200 pt-2 mt-1">
                      <span className="text-stone-500 font-medium block text-[10px] uppercase">Overall Size</span>
                      <span className="font-semibold text-stone-800">{product.dimensions}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick specifications listing */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="flex flex-col gap-2.5 bg-secondary/35 p-6 rounded-2xl border border-stone-200/50">
                <h3 className="font-serif text-sm font-bold text-stone-850">Technical Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex justify-between border-b border-stone-200/60 py-1.5">
                      <span className="text-muted-foreground">{spec.key}</span>
                      <span className="font-semibold text-stone-800">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick summary specs */}
            <div className="flex flex-col gap-2 bg-stone-50 border border-stone-200 rounded-xl p-4 text-2xs font-semibold text-stone-500">
              {product.delivery_time && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>Estimated Build Time: {product.delivery_time}</span>
                </span>
              )}
              {product.customization_options && (
                <span className="flex items-center gap-2 mt-1 leading-relaxed">
                  <Star className="w-4 h-4 text-accent" />
                  <span>Customization: {product.customization_options}</span>
                </span>
              )}
            </div>

            {/* Call Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp py-4 flex-grow justify-center font-bold tracking-wide shadow-luxury hover:shadow-luxury-hover"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Get Quote on WhatsApp</span>
              </a>

              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="btn-outline py-4 flex-grow justify-center border-stone-200 text-stone-700 hover:bg-stone-50"
                >
                  <Phone className="w-4 h-4 text-accent" />
                  <span>Call Designer</span>
                </a>
              )}
            </div>

          </div>

        </div>

        {/* Divider separator */}
        <div className="my-20 h-px bg-stone-200" />

        {/* Inquiry Form Form Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="inquiry-form">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="section-subtitle">Tailor This Creation</span>
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Submit Design Inquiry
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed font-light">
              Submit the form regarding this creation. Specify your customization sizes, preferred wood type, polishing shade, or custom modifications. Our designer will revert within 24 hours.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white p-8 md:p-10 border border-stone-200/60 shadow-luxury rounded-2xl">
            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-200 text-sm font-medium animate-fade-in">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-200 text-sm font-medium animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Your Name *</label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    placeholder="E.g., Rajesh Sharma"
                    className="input-luxury text-sm"
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500 font-medium">{errors.name.message}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    placeholder="E.g., +91 98765 43210"
                    className="input-luxury text-sm"
                  />
                  {errors.phone && (
                    <span className="text-xs text-red-500 font-medium">{errors.phone.message}</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Email Address (Optional)</label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="E.g., rajesh@gmail.com"
                  className="input-luxury text-sm"
                />
                {errors.email && (
                  <span className="text-xs text-red-500 font-medium">{errors.email.message}</span>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Describe Your Custom Requirements *</label>
                <textarea
                  id="message"
                  rows={4}
                  {...register('message')}
                  placeholder="E.g., I would like to order this Exterior table in Teak Wood with 6 chairs instead of 8. Preferred dimensions: 6ft x 3.5ft..."
                  className="input-luxury text-sm resize-none"
                />
                {errors.message && (
                  <span className="text-xs text-red-500 font-medium">{errors.message.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary justify-center font-bold tracking-wide w-full mt-2"
              >
                {isPending ? 'Submitting Inquiry...' : 'Submit Inquiry Form'}
              </button>
            </form>
          </div>
        </div>

        {/* Related Products Carousel Showcase */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
              Related Handcrafted Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => {
                const fallbackImg = 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=600&auto=format&fit=crop';
                const img = p.cover_image_url || fallbackImg;

                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className="group flex flex-col bg-white border border-stone-200 shadow-luxury rounded-2xl overflow-hidden transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={p.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 flex flex-col gap-1">
                      <h4 className="font-serif font-bold text-stone-850 group-hover:text-primary transition-colors duration-300 text-sm line-clamp-1">
                        {p.name}
                      </h4>
                      <span className="text-xs font-semibold text-primary">
                        {p.price_label || (p.price ? formatPrice(p.price) : 'Price on Request')}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
