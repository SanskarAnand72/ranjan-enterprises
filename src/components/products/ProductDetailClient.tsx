'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, MessageSquare, Star, 
  ChevronRight, Calendar, ArrowLeft, Maximize2, X,
  ShieldCheck, Sparkles, Hammer, Award, CheckCircle2, AlertCircle, RefreshCw, Compass
} from 'lucide-react';
import { formatPrice, whatsappUrl } from '@/lib/utils';
import { enquirySchema, type EnquiryFormData } from '@/lib/validations/enquiry';
import { submitEnquiry } from '@/actions/enquiries';
import ProductCard from './ProductCard';
import type { Product, SiteSettings, ProductImage } from '@/types';

interface ProductDetailClientProps {
  product: Product;
  settings: SiteSettings;
  relatedProducts: Product[];
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop';

export default function ProductDetailClient({ product, settings, relatedProducts }: ProductDetailClientProps) {
  // Images list preparation
  const rawImages: ProductImage[] = product.images || [];
  const coverUrl = product.cover_image_url || DEFAULT_IMAGE;

  // Build combined images array ensuring cover image is index 0
  const images: string[] = rawImages.length > 0
    ? rawImages.map(img => img.url)
    : [coverUrl];

  if (!images.includes(coverUrl) && coverUrl) {
    images.unshift(coverUrl);
  }

  // Active thumbnail state
  const [activeIdx, setActiveIdx] = useState(0);
  const activeImage = images[activeIdx] || coverUrl;

  // Lightbox Modal state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Zoom magnifier state
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '220%',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  // Direct contact message
  const waText = `Hello Ranjan Enterprises, I am inquiring about "${product.name}" (SKU: ${product.sku || 'N/A'}). Please guide me with pricing, customization options, and estimated timeline.`;
  const waLink = whatsappUrl(settings.whatsapp || settings.phone || '+918859123538', waText);

  // Inquiry Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      product_category: product.category?.name || 'Custom Furniture',
      message: `I am interested in inquiring about "${product.name}" (SKU: ${product.sku || 'N/A'}). Please share customization and delivery details.`,
      product_id: product.id,
      product_name: product.name,
    },
  });

  const onInquirySubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const res = await submitEnquiry(data);
      if (res.success) {
        setSubmitSuccess(res.message || 'Thank you! Your custom design inquiry has been submitted. Our master craftsman will contact you shortly.');
        reset();
      } else {
        setSubmitError(res.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch {
      setSubmitError('An unexpected connection error occurred. Please try contacting us via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-2 mb-8 text-xs font-semibold tracking-wide text-stone-500 uppercase">
          <Link href="/products" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Masterpieces</span>
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
          <span className="text-stone-900 line-clamp-1 font-bold">{product.name}</span>
        </nav>

        {/* Product Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Gallery Showcase (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Main Image Viewport with Magnifier */}
            <div 
              className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-luxury border border-stone-200/80 bg-stone-100 cursor-zoom-in group"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsLightboxOpen(true)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE;
                }}
              />

              {/* Magnifier Glass Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none bg-no-repeat rounded-3xl"
                style={zoomStyle}
              />

              {/* Expand Lightbox Button */}
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute bottom-4 right-4 p-3 rounded-full bg-stone-950/80 hover:bg-stone-950 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-105"
                title="Open Fullscreen View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Badge Overlay */}
              {product.is_featured && (
                <span className="absolute top-4 left-4 z-10 badge-gold">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Signature Piece</span>
                </span>
              )}
            </div>

            {/* Thumbnails Navigation Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                      activeIdx === idx 
                        ? 'border-primary ring-2 ring-primary/20 shadow-md scale-95' 
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Metadata & Order Panel (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Title & Category Header */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {product.category?.name && (
                  <span className="badge-gold">
                    {product.category.name}
                  </span>
                )}
                {product.wood_type && (
                  <span className="badge-wood">
                    <Compass className="w-3 h-3 text-accent" />
                    <span>Timber: {product.wood_type}</span>
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950 leading-tight">
                {product.name}
              </h1>

              {product.sku && (
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  SKU / Identifier: {product.sku}
                </span>
              )}
            </div>

            {/* Price & Investment Card */}
            <div className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-luxury flex flex-col gap-4">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Investment</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-primary">
                      {product.price_label || (product.price ? formatPrice(product.price) : 'Bespoke Quote')}
                    </span>
                    {product.original_price && product.price && product.original_price > product.price && (
                      <span className="text-base text-stone-400 line-through font-semibold">
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                  </div>
                </div>

                {(product.discount_percentage || 0) > 0 && (
                  <span className="px-3.5 py-1 bg-red-700 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {product.discount_percentage}% OFF
                  </span>
                )}
              </div>

              {/* Status & Delivery Pill */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-stone-100 text-xs">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                  product.stock_status === 'in_stock'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : product.stock_status === 'made_to_order'
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'bg-stone-100 text-stone-700 border border-stone-200'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{product.stock_status === 'in_stock' ? 'In Stock Workshop' : product.stock_status === 'made_to_order' ? 'Handcrafted Made to Order' : product.stock_status?.replace('_', ' ')}</span>
                </span>

                {product.delivery_time && (
                  <span className="text-stone-500 flex items-center gap-1.5 font-medium text-xs">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    <span>Est. Delivery: {product.delivery_time}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp py-4 flex-grow justify-center font-bold tracking-wider text-xs uppercase shadow-md hover:shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
              </a>

              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="btn-outline py-4 flex-grow justify-center font-bold text-xs uppercase tracking-wider"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Master Craftsman</span>
                </a>
              )}
            </div>

            {/* Short Overview */}
            <div className="flex flex-col gap-2 pt-2">
              <h3 className="font-serif text-base font-bold text-stone-900">Craft Overview</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light whitespace-pre-line">
                {product.description || product.short_description || 'Handcrafted from seasoned solid timber, custom engineered for timeless durability and heirloom luxury.'}
              </p>
            </div>

            {/* Wood & Material Details Card */}
            <div className="p-6 bg-stone-50 rounded-3xl border border-stone-200/80 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-primary border-b border-stone-200/80 pb-3">
                <Hammer className="w-4 h-4" />
                <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-stone-900">Wood & Material Specifications</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                {product.wood_type && (
                  <div>
                    <span className="text-stone-400 font-bold block text-[10px] uppercase tracking-wider">Primary Timber</span>
                    <span className="font-semibold text-stone-900">{product.wood_type}</span>
                  </div>
                )}
                {product.material_type && (
                  <div>
                    <span className="text-stone-400 font-bold block text-[10px] uppercase tracking-wider">Material Type</span>
                    <span className="font-semibold text-stone-900">{product.material_type}</span>
                  </div>
                )}
                {product.finish_type && (
                  <div>
                    <span className="text-stone-400 font-bold block text-[10px] uppercase tracking-wider">Finish / Polish</span>
                    <span className="font-semibold text-stone-900">{product.finish_type}</span>
                  </div>
                )}
                {product.color && (
                  <div>
                    <span className="text-stone-400 font-bold block text-[10px] uppercase tracking-wider">Color / Stain</span>
                    <span className="font-semibold text-stone-900">{product.color}</span>
                  </div>
                )}
                {product.thickness && (
                  <div>
                    <span className="text-stone-400 font-bold block text-[10px] uppercase tracking-wider">Timber Thickness</span>
                    <span className="font-semibold text-stone-900">{product.thickness}</span>
                  </div>
                )}
                {product.warranty_info && (
                  <div>
                    <span className="text-stone-400 font-bold block text-[10px] uppercase tracking-wider">Warranty</span>
                    <span className="font-semibold text-stone-900">{product.warranty_info}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Atelier Quality Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-900 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-stone-900">Seasoned Timber</span>
                  <span className="text-[10px] text-stone-500">Kiln dried & termite proof</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-900 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-stone-900">Custom Built</span>
                  <span className="text-[10px] text-stone-500">Made to exact dimensions</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Divider */}
        <div className="my-20 divider-gold" />

        {/* Custom Inquiry Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="inquiry-form">
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="section-tag w-fit mb-1">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>CUSTOM ORDER</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
              Request Custom Dimensions
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">
              Need specific timber thickness, custom carving patterns, or modified finish shades? Send your specifications directly to our master workshop.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white p-8 sm:p-10 border border-stone-200/80 shadow-luxury rounded-3xl">
            {submitSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center gap-3 border border-emerald-200 text-xs font-semibold animate-fade-in">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3 border border-red-200 text-xs font-semibold animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onInquirySubmit)} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    placeholder="E.g., Rajesh Sharma"
                    className="input-luxury"
                  />
                  {errors.name && (
                    <span className="text-[11px] text-red-600 font-medium">{errors.name.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    placeholder="E.g., +91 98765 43210"
                    className="input-luxury"
                  />
                  {errors.phone && (
                    <span className="text-[11px] text-red-600 font-medium">{errors.phone.message}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Email Address (Optional)</label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="E.g., rajesh@domain.com"
                  className="input-luxury"
                />
                {errors.email && (
                  <span className="text-[11px] text-red-600 font-medium">{errors.email.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Custom Sizing & Notes *</label>
                <textarea
                  id="message"
                  rows={4}
                  {...register('message')}
                  placeholder="Specify custom sizing (e.g., Height 7ft x Width 3.5ft), wood type preference, or special carving requests..."
                  className="input-luxury resize-none"
                />
                {errors.message && (
                  <span className="text-[11px] text-red-600 font-medium">{errors.message.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary justify-center font-bold text-xs uppercase tracking-wider w-full py-4 text-sm mt-2 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </span>
                ) : (
                  'Submit Custom Quote Request'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Related Products Showcase */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24">
            <div className="flex flex-col gap-2 mb-10">
              <span className="section-subtitle">Complementary Masterpieces</span>
              <h2 className="font-serif text-3xl font-bold text-stone-950">
                Related Handcrafted Creations
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Fullscreen Image Viewer Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Lightbox Top Control Bar */}
            <div className="flex items-center justify-between z-10 text-white">
              <span className="font-serif text-lg font-bold">
                {product.name} <span className="text-stone-400 text-xs font-sans font-normal ml-2">({activeIdx + 1} of {images.length})</span>
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Image Preview */}
            <div className="relative flex-grow flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Lightbox Bottom Thumbnails */}
            {images.length > 1 && (
              <div 
                className="flex items-center justify-center gap-3 overflow-x-auto py-2 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeIdx === idx ? 'border-primary scale-110' : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

