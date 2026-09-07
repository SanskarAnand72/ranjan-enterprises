'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { enquirySchema, type EnquiryFormData } from '@/lib/validations/enquiry';
import { submitEnquiry } from '@/actions/enquiries';
import type { HomepageContent, SiteSettings } from '@/types';

interface ContactSectionProps {
  content?: HomepageContent | null;
  settings: SiteSettings;
}

export default function ContactSection({ content, settings }: ContactSectionProps) {
  const title = content?.title || 'Get in Touch';
  const subtitle = content?.subtitle || "We'd Love to Hear From You";
  const description = content?.description || 'Have a project in mind? Send us a message and we will get back to you within 24 hours.';

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
        setSuccessMsg(res.message || 'Thank you! We will get in touch shortly.');
        reset();
      } else {
        setErrorMsg(res.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setErrorMsg('Failed to submit enquiry. Please check your connection.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section className="py-24 bg-background relative" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
          <span className="section-subtitle">{subtitle}</span>
          <h2 className="section-title">{title}</h2>
          <p className="text-muted-foreground font-light max-w-lg mx-auto mt-2">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Panel: Contact info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Contact Information
            </h3>

            <div className="flex flex-col gap-6 text-sm">
              
              {/* Address */}
              {settings.address && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Workshop & Showroom</span>
                    <span className="text-foreground leading-relaxed font-medium">{settings.address}</span>
                  </div>
                </div>
              )}

              {/* Phone */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Phone Number</span>
                    <span className="text-foreground font-semibold text-base">+91 88591 23538</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-14">
                  <a href="tel:+918859123538" className="btn-primary py-1.5 px-4 text-[10px] uppercase font-bold tracking-wider rounded-lg">
                    Call Now
                  </a>
                  <a href="https://wa.me/918859123538" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-1.5 px-4 text-[10px] uppercase font-bold tracking-wider rounded-lg flex items-center gap-1.5 transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Email */}
              <a href="mailto:ranjan885912@gmail.com" className="flex items-start gap-4 hover:text-primary transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Email Address</span>
                  <span className="text-foreground font-semibold text-base">ranjan885912@gmail.com</span>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Business Hours</span>
                  <span className="text-foreground leading-relaxed font-medium">Mon - Sat: 9:00 AM - 8:00 PM</span>
                </div>
              </div>

            </div>

            {/* Google Maps link / static placeholder map iframe */}
            {settings.google_maps_url && (
              <div className="w-full h-64 rounded-2xl overflow-hidden border border-stone-200 shadow-luxury">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.8354898150493!2d72.82576821538356!3d19.07085798708892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c911a372d621%3A0xe543e3d2c943cb!2sBandra%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1626243292491!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  title="Workshop Map Location"
                ></iframe>
              </div>
            )}
          </div>

          {/* Right Panel: Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-2xl border border-stone-200/60 shadow-luxury">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
              Send an Enquiry
            </h3>

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

              {/* Product Category */}
              <div className="flex flex-col gap-2">
                <label htmlFor="product_category" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Product Category (Optional)</label>
                <select
                  id="product_category"
                  {...register('product_category')}
                  className="input-luxury text-sm"
                >
                  <option value="">Select a category</option>
                  <option value="Wooden Gates">Wooden Gates</option>
                  <option value="Wooden Windows">Wooden Windows</option>
                  <option value="Wooden Door Frames">Wooden Door Frames</option>
                  <option value="Wooden Mandir">Wooden Mandir</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Your Message *</label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message')}
                  placeholder="Describe your design vision, required sizes, wood preferences, etc..."
                  className="input-luxury text-sm resize-none"
                />
                {errors.message && (
                  <span className="text-xs text-red-500 font-medium">{errors.message.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full justify-center transition-all duration-300 disabled:opacity-50 mt-2"
              >
                {isPending ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <span>Submit Inquiry Form</span>
                    <Send className="w-4 h-4 ml-1" />
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
