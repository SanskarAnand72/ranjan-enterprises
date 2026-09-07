import React from 'react';
import Link from 'next/link';
import { getDashboardStats } from '@/actions/analytics';
import { 
  Package, Images, MessageSquare, 
  Plus, ExternalLink 
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Ranjan Enterprises',
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    {
      title: 'Total Products',
      value: stats.total_products,
      icon: Package,
      href: '/admin/products',
    },
    {
      title: 'Total Enquiries',
      value: stats.total_enquiries,
      icon: MessageSquare,
      href: '/admin/enquiries',
    },
    {
      title: 'Total Gallery Images',
      value: stats.total_gallery_images,
      icon: Images,
      href: '/admin/gallery',
    },
  ];

  return (
    <div className="flex flex-col gap-10 max-w-5xl">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your store.
          </p>
        </div>

        {/* Action Panel */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Website</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              href={card.href}
              className="p-6 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 text-gray-500 group-hover:text-black transition-colors">
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{card.title}</span>
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {card.value}
              </span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
