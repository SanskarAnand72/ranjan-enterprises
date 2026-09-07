import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
};

export default function TermsPage() {
  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-2xl border border-stone-200 shadow-luxury">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">
          Terms & Conditions
        </h1>
        <div className="flex flex-col gap-6 text-sm text-stone-600 leading-relaxed font-light">
          <p>
            Welcome to Ranjan Enterprises. These Terms & Conditions outline the rules and regulations for the use of Ranjan Enterprises' Website.
          </p>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use Ranjan Enterprises if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <h2 className="font-serif text-xl font-bold text-foreground mt-4">
            Custom Orders & Customization
          </h2>
          <p>
            All products listed on this website are customizable. Since every piece of wood has unique grain patterns, colors, and textures, final wooden items may vary slightly in appearance from catalog photographs. This is an inherent trait of natural solid wood and is considered a signature of authenticity.
          </p>
          <h2 className="font-serif text-xl font-bold text-foreground mt-4">
            Pricing & Inquiry Quotations
          </h2>
          <p>
            Pricing displayed in our catalog represents estimated base investment prices. Final quotes will be shared in writing following review of customization sizes, wood species selection, delivery destination, and complex carvings.
          </p>
          <h2 className="font-serif text-xl font-bold text-foreground mt-4">
            Build Time & Delivery
          </h2>
          <p>
            Estimated build times represent guidelines. Since all Woodwork is handcrafted individually, unforeseen delays in timber seasoning or premium lacquering may happen. We prioritize quality over speed.
          </p>
        </div>
      </div>
    </div>
  );
}
