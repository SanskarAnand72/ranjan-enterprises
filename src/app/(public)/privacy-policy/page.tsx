import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-2xl border border-stone-200 shadow-luxury">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">
          Privacy Policy
        </h1>
        <div className="flex flex-col gap-6 text-sm text-stone-600 leading-relaxed font-light">
          <p>
            At Ranjan Enterprises, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Ranjan Enterprises and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>
          <h2 className="font-serif text-xl font-bold text-foreground mt-4">
            Consent
          </h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
          <h2 className="font-serif text-xl font-bold text-foreground mt-4">
            Information We Collect
          </h2>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <p>
            If you contact us directly via our Inquiry Form or WhatsApp, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>
          <h2 className="font-serif text-xl font-bold text-foreground mt-4">
            How We Use Your Information
          </h2>
          <ul className="list-disc list-inside flex flex-col gap-2 pl-2">
            <li>Provide, operate, and maintain our website and catalog</li>
            <li>Improve, personalize, and expand our catalog</li>
            <li>Understand and analyze how you use our website</li>
            <li>Respond to your design inquiries, questions, and requests</li>
            <li>Send you updates regarding your custom woodwork orders</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
