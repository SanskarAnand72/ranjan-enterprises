import React from 'react';
import { getEnquiries } from '@/actions/enquiries';
import EnquiryManager from '@/components/admin/EnquiryManager';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Enquiries',
};

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries({ page: 1, pageSize: 100 });

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
          Workspace Leads
        </span>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Customer Enquiries
        </h1>
      </div>

      {/* Enquiry Manager UI client grid component */}
      <EnquiryManager initialEnquiries={enquiries.data} />

    </div>
  );
}
