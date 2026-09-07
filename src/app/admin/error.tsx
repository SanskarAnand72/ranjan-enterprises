'use client';
import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-sm border border-red-100">
      <h2 className="text-2xl font-bold text-red-650 mb-4">Something went wrong!</h2>
      <p className="text-sm text-stone-500 mb-6 max-w-md">
        {error.message || 'An unexpected error occurred while loading this page. This could be due to missing database tables or network issues.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
