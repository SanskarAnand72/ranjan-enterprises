'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { categorySchema, type CategoryFormData } from '@/lib/validations/category';
import { createCategory, updateCategory, deleteCategory } from '@/actions/categories';
import type { Category } from '@/types';
import { slugify } from '@/lib/utils';

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isPending, setIsPending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: { name: '', slug: '', description: '', icon: 'Folder', is_active: true, display_order: 0 },
  });

  const catName = watch('name');
  React.useEffect(() => {
    if (catName && !editingId) setValue('slug', slugify(catName));
  }, [catName, setValue, editingId]);

  const { register: registerEdit, handleSubmit: handleSubmitEdit, setValue: setEditValue } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as any,
  });

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditValue('name', cat.name);
    setEditValue('slug', cat.slug);
    setEditValue('description', cat.description || '');
    setEditValue('icon', cat.icon || 'Folder');
    setEditValue('is_active', cat.is_active);
    setEditValue('display_order', cat.display_order);
  };

  const handleCreate = async (data: CategoryFormData) => {
    setIsPending(true);
    const res = await createCategory(data);
    if (res.success) {
      setCategories([...categories, res.data]);
      reset();
    }
    setIsPending(false);
  };

  const handleUpdate = async (data: CategoryFormData) => {
    if (!editingId) return;
    setIsPending(true);
    const res = await updateCategory(editingId, data);
    if (res.success) {
      setCategories(categories.map(c => c.id === editingId ? res.data : c));
      setEditingId(null);
    }
    setIsPending(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    setIsPending(true);
    const res = await deleteCategory(id);
    if (res.success) setCategories(categories.filter(c => c.id !== id));
    setIsPending(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleSubmit(handleCreate)} className="flex items-end gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input
              {...register('name')}
              placeholder="e.g. Wooden Chairs"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-black focus:border-black"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Category Name</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {editingId === cat.id ? (
                    <input
                      {...registerEdit('name')}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-black"
                    />
                  ) : (
                    <span className="font-medium text-gray-900">{cat.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingId === cat.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={handleSubmitEdit(handleUpdate)} disabled={isPending} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(cat)} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
