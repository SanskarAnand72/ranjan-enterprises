'use client';

import React, { useState } from 'react';
import { Search, Eye, Trash2, X } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { deleteEnquiry, updateEnquiry } from '@/actions/enquiries';
import type { Enquiry } from '@/types';

export default function EnquiryManager({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [search, setSearch] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [viewEnquiry, setViewEnquiry] = useState<Enquiry | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    setIsPending(true);
    const res = await deleteEnquiry(id);
    if (res.success) setEnquiries(enquiries.filter(e => e.id !== id));
    setIsPending(false);
  };

  const filtered = enquiries.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.phone.includes(search)
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl relative">
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative w-full max-w-sm flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 font-medium text-gray-500">Phone</th>
              <th className="px-6 py-3 font-medium text-gray-500">Category</th>
              <th className="px-6 py-3 font-medium text-gray-500">Date</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map(enq => (
              <tr key={enq.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{enq.name}</td>
                <td className="px-6 py-4 text-gray-600">{enq.phone}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold uppercase tracking-wider">
                    {enq.product_category || 'General'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{formatDateTime(enq.created_at)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => {
                        setViewEnquiry(enq);
                        if (enq.status === 'new') {
                          updateEnquiry(enq.id, { status: 'reviewed' }).then(() => {
                            setEnquiries(enquiries.map(e => e.id === enq.id ? { ...e, status: 'reviewed' as any } : e));
                          });
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(enq.id)}
                      disabled={isPending}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewEnquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 flex flex-col gap-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900">Enquiry Details</h3>
              <button onClick={() => setViewEnquiry(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</span>
                  <span className="font-medium text-gray-900">{viewEnquiry.name}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</span>
                  <span className="font-medium text-gray-900">{viewEnquiry.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Interest</span>
                  <span className="font-medium text-gray-900">{viewEnquiry.product_category || 'General Enquiry'}</span>
                </div>
              </div>
              
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</span>
                <p className="text-gray-700 whitespace-pre-wrap">{viewEnquiry.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
