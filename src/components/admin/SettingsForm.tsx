'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, type SettingsFormData } from '@/lib/validations/settings';
import { updateSettings } from '@/actions/settings';
import { uploadFileToServer } from '@/actions/storage';
import { Save, Loader2, Check } from 'lucide-react';

export default function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getSetting = (key: string) => initialSettings[key] || '';

  const { register, handleSubmit, setValue, watch } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema) as any,
    defaultValues: {
      business_name: getSetting('business_name') || 'Ranjan Enterprises',
      logo_url: getSetting('logo_url'),
      phone: getSetting('phone'),
      whatsapp: getSetting('whatsapp'),
      email: getSetting('email'),
      address: getSetting('address'),
      google_maps_url: getSetting('google_maps_url'),
      working_hours: getSetting('working_hours'),
    },
  });

  const logoUrl = watch('logo_url');

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadRes = await uploadFileToServer('logos', filePath, formData);
    
    if (uploadRes.error) {
      console.error('Upload error:', uploadRes.error);
      alert('Error uploading logo.');
    } else {
      setValue('logo_url', uploadRes.publicUrl);
    }
    
    setIsUploading(false);
    e.target.value = '';
  };

  const onSubmit = async (data: SettingsFormData) => {
    setIsPending(true);
    setSuccessMsg(null);
    try {
      const res = await updateSettings(data);
      if (res.success) {
        setSuccessMsg('Settings saved successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch {
      alert('Error saving settings');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-3xl pb-20">
      
      {successMsg && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm font-medium">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Business Information</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
          <input {...register('business_name')} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (or Upload)</label>
          <div className="flex gap-2">
            <input {...register('logo_url')} placeholder="https://..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
            <div className="relative">
              <input type="file" id="logo-upload" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploading} />
              <label htmlFor="logo-upload" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer flex items-center gap-2">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
              </label>
            </div>
          </div>
          {logoUrl && (
            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 inline-block">
              <img src={logoUrl} alt="Logo Preview" className="h-10 object-contain" />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Contact Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input {...register('phone')} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
            <input {...register('whatsapp')} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" {...register('email')} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Location & Hours</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
          <textarea {...register('address')} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
          <input {...register('google_maps_url')} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
          <input {...register('working_hours')} placeholder="e.g. Mon-Sat: 9AM - 8PM" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
        </div>
      </div>

      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 p-4 px-8 flex justify-end z-10">
        <button type="submit" disabled={isPending || isUploading} className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 shadow-sm">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

    </form>
  );
}
