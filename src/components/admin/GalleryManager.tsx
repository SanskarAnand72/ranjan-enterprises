'use client';

import React, { useState } from 'react';
import { Trash2, Edit2, Plus, Image as ImageIcon, Loader2, UploadCloud } from 'lucide-react';
import { createGalleryAlbum, deleteGalleryAlbum, updateGalleryAlbum, addGalleryImages } from '@/actions/gallery';
import { slugify } from '@/lib/utils';
import type { Gallery } from '@/types';
import { uploadFileToServer } from '@/actions/storage';

export default function GalleryManager({ initialAlbums }: { initialAlbums: Gallery[] }) {
  const [albums, setAlbums] = useState<Gallery[]>(initialAlbums);
  const [isPending, setIsPending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', category: '' });
  const [uploadingAlbumId, setUploadingAlbumId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    
    const res = await createGalleryAlbum({
      title,
      slug: slugify(title),
      category,
      is_featured: false,
      is_visible: true,
      display_order: albums.length,
    });
    
    if (res.success && res.data) {
      setAlbums([...albums, { ...res.data, images: [] }]);
      (e.target as HTMLFormElement).reset();
    }
    setIsPending(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery album?')) return;
    setIsPending(true);
    const res = await deleteGalleryAlbum(id);
    if (res.success) setAlbums(albums.filter(a => a.id !== id));
    setIsPending(false);
  };

  const startEdit = (album: Gallery) => {
    setEditingId(album.id);
    setEditForm({ title: album.title, category: album.category || '' });
  };

  const saveEdit = async (id: string) => {
    setIsPending(true);
    const res = await updateGalleryAlbum(id, {
      title: editForm.title,
      slug: slugify(editForm.title),
      category: editForm.category,
    });
    if (res.success && res.data) {
      setAlbums(albums.map(a => a.id === id ? { ...res.data, images: a.images } : a));
      setEditingId(null);
    }
    setIsPending(false);
  };

  const handleUploadImages = async (albumId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingAlbumId(albumId);
    
    const album = albums.find(a => a.id === albumId);
    if (!album) return;
    
    const newImages: any[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await uploadFileToServer('gallery', filePath, formData);
      
      if (uploadRes.error) {
        console.error('Upload error:', uploadRes.error);
        continue;
      }
      
      const publicUrl = uploadRes.publicUrl;
      
      newImages.push({
        storage_path: uploadRes.storage_path,
        url: publicUrl,
        is_cover: (album.images?.length || 0) === 0 && i === 0,
        display_order: (album.images?.length || 0) + i,
      });
    }
    
    if (newImages.length > 0) {
      const res = await addGalleryImages(albumId, newImages);
      if (res.success && res.data) {
        setAlbums(albums.map(a => {
          if (a.id === albumId) {
            return {
              ...a,
              images: [...(a.images || []), ...res.data],
              cover_image_url: a.cover_image_url || res.data[0].url
            };
          }
          return a;
        }));
      }
    }
    
    setUploadingAlbumId(null);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Add Gallery Album</h2>
        <form onSubmit={handleCreate} className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Album Title</label>
            <input name="title" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" required />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input name="category" placeholder="e.g. Wooden Gates" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black" />
          </div>
          <button type="submit" disabled={isPending} className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Album
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {albums.map((album) => (
          <div key={album.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col group relative">
            <div className="aspect-video bg-gray-100 flex items-center justify-center relative group-hover:bg-gray-200 transition-colors">
              {album.cover_image_url ? (
                <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <input 
                  type="file" 
                  id={`upload-${album.id}`} 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e: any) => handleUploadImages(album.id, e)} 
                  disabled={uploadingAlbumId === album.id} 
                />
                <label 
                  htmlFor={`upload-${album.id}`} 
                  className="px-4 py-2 bg-white text-black font-semibold text-sm rounded cursor-pointer shadow-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  {uploadingAlbumId === album.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  {uploadingAlbumId === album.id ? 'Uploading...' : 'Upload Images'}
                </label>
              </div>
            </div>
            
            <div className="p-4 flex-grow flex flex-col">
              {editingId === album.id ? (
                <div className="flex flex-col gap-2">
                  <input
                    value={editForm.title}
                    onChange={(e: any) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    placeholder="Title"
                  />
                  <input
                    value={editForm.category}
                    onChange={(e: any) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    placeholder="Category"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => setEditingId(null)} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded">Cancel</button>
                    <button onClick={() => saveEdit(album.id)} disabled={isPending} className="px-2 py-1 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded">Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{album.title}</h3>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {album.category || 'Uncategorized'} • {album.images?.length || 0} Images
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(album)} className="p-1 text-gray-400 hover:text-black">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(album.id)} className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        {albums.length === 0 && (
          <div className="col-span-full py-10 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-500 text-sm font-medium">
            No gallery albums found. Create one above.
          </div>
        )}
      </div>
    </div>
  );
}
