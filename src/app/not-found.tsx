'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Hammer } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 noise z-0" />
      <div className="absolute top-1/2 left-1/2 w-[35rem] h-[35rem] bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 -z-10" />

      <div className="max-w-md w-full text-center flex flex-col items-center gap-6 relative z-10">
        
        {/* Animated Hammer Logo */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1 }}
          className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shadow-luxury"
        >
          <Hammer className="w-8 h-8" />
        </motion.div>

        <h1 className="font-serif text-8xl font-extrabold text-primary animate-pulse">
          404
        </h1>

        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Creation Not Found
          </h2>
          <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-sm">
            The page you are looking for has been moved, archived, or is still in the planning stages at our woodworking Workshop.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link
            href="/"
            className="btn-primary justify-center w-full sm:w-auto text-xs px-6 py-3"
          >
            <Home className="w-4 h-4" />
            <span>Workshop Home</span>
          </Link>

          <Link
            href="/products"
            className="btn-outline justify-center w-full sm:w-auto text-xs px-6 py-3 border-stone-250 hover:bg-stone-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
