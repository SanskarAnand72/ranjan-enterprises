'use client';

import React from 'react';
import { User, Bell, ChevronDown } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import type { Profile } from '@/types';

interface AdminHeaderProps {
  profile: Profile | null;
}

export default function AdminHeader({ profile }: AdminHeaderProps) {
  const adminName = profile?.full_name || 'Workshop Admin';
  const adminEmail = profile?.email || 'admin@ranjanenterprises.com';

  return (
    <header className="h-16 bg-white border-b border-[#e0e0e0] fixed top-0 right-0 left-64 z-20 px-8 flex items-center justify-end shadow-sm">
      {/* User profile controls */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={adminName}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{getInitials(adminName)}</span>
          )}
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-sm font-semibold text-gray-900 leading-none">
            {adminName}
          </span>
          <span className="text-xs text-gray-500 font-medium mt-1 leading-none">
            {profile?.role === 'admin' ? 'Owner' : 'Editor'}
          </span>
        </div>
      </div>
    </header>
  );
}
