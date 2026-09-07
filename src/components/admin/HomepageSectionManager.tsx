'use client';

import React, { useState } from 'react';
import { updateHomepageSection } from '@/actions/settings';
import { Save, Check } from 'lucide-react';
import type { HomepageContent } from '@/types';

export default function HomepageSectionManager({ sections }: { sections: HomepageContent[] }) {
  const [localSections, setLocalSections] = useState(sections);
  const [isPending, setIsPending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const hero = localSections.find(s => s.section === 'hero') || { section: 'hero', title: '', subtitle: '', content_json: { image_url: '' } };
  const featured = localSections.find(s => s.section === 'featured_products') || { section: 'featured_products', title: 'Featured Products', is_visible: true };
  const about = localSections.find(s => s.section === 'about') || { section: 'about', title: 'About Us', description: '' };

  const handleUpdate = async (sectionKey: string, data: any) => {
    setIsPending(true);
    setSuccessMsg(null);
    const res = await updateHomepageSection(sectionKey, data);
    if (res.success) {
      setSuccessMsg(`Updated ${sectionKey} section!`);
      setLocalSections(prev => prev.map(s => s.section === sectionKey ? { ...s, ...data } : s));
      setTimeout(() => setSuccessMsg(null), 3000);
    }
    setIsPending(false);
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {successMsg && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm font-medium">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* HERO SECTION */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Hero Section</h2>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleUpdate('hero', {
              section: 'hero',
              title: formData.get('title'),
              subtitle: formData.get('subtitle'),
              content_json: { image_url: formData.get('image_url') }
            });
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
            <input name="title" defaultValue={hero.title || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
            <input name="subtitle" defaultValue={hero.subtitle || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
            <input name="image_url" defaultValue={(hero.content_json as any)?.image_url || ''} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
          </div>
          <button type="submit" disabled={isPending} className="self-start px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Hero Section
          </button>
        </form>
      </div>

      {/* FEATURED PRODUCTS SECTION */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Featured Products</h2>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleUpdate('featured_products', {
              section: 'featured_products',
              title: formData.get('title'),
              is_visible: formData.get('is_visible') === 'on'
            });
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input name="title" defaultValue={featured.title || 'Featured Products'} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="is_visible" id="is_visible" defaultChecked={featured.is_visible} className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black" />
            <label htmlFor="is_visible" className="text-sm font-medium text-gray-700">Show Featured Products on Homepage</label>
          </div>
          <button type="submit" disabled={isPending} className="self-start px-4 py-2 mt-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Featured Settings
          </button>
        </form>
      </div>

      {/* ABOUT SECTION */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900">About Section</h2>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleUpdate('about', {
              section: 'about',
              title: formData.get('title'),
              description: formData.get('description'),
            });
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Title</label>
            <input name="title" defaultValue={about.title || 'About Us'} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Description</label>
            <textarea name="description" defaultValue={about.description || ''} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
          </div>
          <button type="submit" disabled={isPending} className="self-start px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save About Section
          </button>
        </form>
      </div>

    </div>
  );
}
