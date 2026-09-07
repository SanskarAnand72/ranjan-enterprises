'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Package, FolderOpen, Images, 
  MessageSquare, Home, Settings, BarChart3, LogOut, ShieldAlert 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/actions/auth';

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { label: 'Gallery', href: '/admin/gallery', icon: Images },
  { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  { label: 'Homepage', href: '/admin/homepage', icon: Home },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await logout();
    }
  };

  return (
    <aside className="w-64 bg-[#ebebeb] border-r border-[#e0e0e0] text-[#333] flex flex-col justify-between min-h-screen fixed top-0 left-0 bottom-0 z-30 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      
      {/* Brand logo details */}
      <div className="flex flex-col gap-2 p-6 border-b border-[#e0e0e0]">
        <Link href="/admin/dashboard" className="flex flex-col group">
          <span className="font-serif text-lg font-bold tracking-tight text-[#1a1a1a] transition-colors duration-300">
            Ranjan Enterprises
          </span>
          <span className="text-[10px] tracking-wider text-gray-500 font-medium">
            STORE ADMIN
          </span>
        </Link>
      </div>

      {/* Navigation list */}
      <nav className="flex-grow py-4 px-3 flex flex-col gap-1 overflow-y-auto">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-black'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom tools / Log out action */}
      <div className="p-4 border-t border-[#e0e0e0] flex flex-col gap-2">
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-black transition-colors duration-200"
        >
          <Home className="w-4 h-4" />
          <span>View Website</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 w-full text-left"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}
