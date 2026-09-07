import React from 'react';
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/actions/auth';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getUserProfile();

  // Extra safety check in layout: proxy.ts ensures user is authenticated, 
  // so if profile is null, the user lacks a database profile row.
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-red-650 mb-2">Profile Not Found</h1>
        <p className="text-muted-foreground text-sm max-w-md">
          Your account is authenticated, but no profile was found in the database. Please contact an administrator.
        </p>
      </div>
    );
  }

  // Double check if roles match admin or editor permissions
  if (profile.role !== 'admin' && profile.role !== 'editor') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-red-650 mb-2">Access Denied</h1>
        <p className="text-muted-foreground text-sm max-w-md">
          Your account does not possess admin or editor permissions to access this workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Panel Content Frame */}
      <div className="flex-grow pl-64 pt-16 flex flex-col">
        {/* Header */}
        <AdminHeader profile={profile} />

        {/* Content Box */}
        <main className="p-8 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
