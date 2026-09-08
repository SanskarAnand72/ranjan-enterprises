'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';
import { enquirySchema, type EnquiryFormData } from '@/lib/validations/enquiry';
import { submitEnquiry } from '@/actions/enquiries';
import { whatsappUrl } from '@/lib/utils';
import type { HomepageContent, SiteSettings } from '@/types';

interface ContactSectionProps {
  content?: HomepageContent | null;
  settings: SiteSettings;
}

export default function ContactSection({ content, settings }: ContactSectionProps) {
  const title = content?.title || 'Consult With Our Master Joiner';
  const subtitle = content?.subtitle || 'Private Workshops & Direct Inquiries';
  const description = content?.description || 'Discuss custom sizes, timber selection, architectural blueprints, or request an on-site consultation.';

  const [isPending, setIsPending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const waUrl = whatsappUrl(
    settings.whatsapp || settings.phone || '+918859123538',
    'Hello Ranjan Enterprises, I would like to book a consultation for a custom woodwork project.'
  );

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
      product_category: '',
      message: '',
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsPending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await submitEnquiry(data);
      if (res.success) {
        setSuccessMsg(res.message || 'Thank you! Your custom joinery inquiry has been submitted. Our master craftsman will reach out to you within 24 hours.');
        reset();
      } else {
        setErrorMsg(res.error || 'Something went wrong while submitting. Please try again or reach us via WhatsApp.');
      }
    } catch {
      setErrorMsg('A connection error occurred. Please contact us directly via WhatsApp.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-background relative" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-3">
          <div className="section-tag mb-1">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>BESPOKE CONSULTATION</span>
          </div>
          <span className="font-display text-base font-light text-primary tracking-widest uppercase italic">
            {subtitle}
          </span>
          <h2 className="section-title">{title}</h2>
          <p className="text-stone-600 font-light max-w-lg mx-auto mt-1 text-sm sm:text-base">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Panel: Contact Credentials (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-2xl font-bold text-stone-950">
                Workshop Credentials
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light">
                Visit our craftsman workshop or request direct consultation for architectural drawings.
              </p>
            </div>

            <div className="flex flex-col gap-6 text-sm">
              
              {/* Address Card */}
              {settings.address && (
                <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-luxury flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-wood-700/10 border border-amber-800/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Workshop & Showroom</span>
                    <span className="text-stone-900 leading-relaxed font-semibold text-sm">{settings.address}</span>
                  </div>
                </div>
              )}

              {/* Phone Card */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-luxury flex flex-col gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-wood-700/10 border border-amber-800/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Direct Line</span>
                    <span className="text-stone-950 font-bold text-base">{settings.phone || '+91 88591 23538'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
                  <a href={`tel:${settings.phone || '+918859123538'}`} className="btn-primary py-2 px-4 text-2xs uppercase tracking-wider">
                    Call Workshop
                  </a>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp py-2 px-4 text-2xs uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-luxury flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-wood-700/10 border border-amber-800/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Email Inquiry</span>
                  <a href={`mailto:${settings.email || 'ranjan885912@gmail.com'}`} className="text-stone-900 font-bold text-sm hover:text-primary transition-colors">
                    {settings.email || 'ranjan885912@gmail.com'}
                  </a>
                </div>
              </div>

              {/* Business Hours Card */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-luxury flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-wood-700/10 border border-amber-800/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Workshop Schedule</span>
                  <span className="text-stone-900 font-medium text-xs sm:text-sm">Monday - Saturday: 9:00 AM - 8:00 PM</span>
                  <span className="text-stone-500 text-xs">Sunday: By Prior Appointment</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Panel: Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-luxury">
            <h3 className="font-serif text-2xl font-bold text-stone-950 mb-2">
              Send a Design Request
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-light mb-8">
              Fill out your project details below. We guarantee confidential, expert guidance.
            </p>

            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-2xl flex items-center gap-3 border border-green-200 text-xs font-semibold animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-2xl flex items-center gap-3 border border-red-200 text-xs font-semibold animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
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

                {/* Phone */}
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

              {/* Email */}
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

              {/* Product Category */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="product_category" className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Project Scope / Category</label>
                <select
                  id="product_category"
                  {...register('product_category')}
                  className="input-luxury"
                >
                  <option value="">Select project category...</option>
                  <option value="Teak Wooden Doors">Teak Wooden Entrance Doors</option>
                  <option value="Wooden Windows & Frames">Wooden Windows & Frames</option>
                  <option value="Bespoke Carved Mandir">Bespoke Carved Mandir</option>
                  <option value="Luxury Wardrobes & Storage">Luxury Wardrobes & Storage</option>
                  <option value="Custom Living & Dining Furniture">Custom Living & Dining Furniture</option>
                  <option value="Commercial Interior Joinery">Commercial Interior Joinery</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Design Details / Dimensions *</label>
                <textarea
                  id="message"
                  rows={4}
                  {...register('message')}
                  placeholder="Share details regarding your space, dimensions, wood type preferences (Teak, Rosewood, Sheesham), or custom carving ideas..."
                  className="input-luxury resize-none"
                />
                {errors.message && (
                  <span className="text-[11px] text-red-600 font-medium">{errors.message.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full justify-center text-xs uppercase tracking-wider py-4 mt-2 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isPending ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <span>Submit Design Inquiry</span>
                    <Send className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

