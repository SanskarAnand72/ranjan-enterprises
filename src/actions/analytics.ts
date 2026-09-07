'use server';

import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import type { DashboardStats, PopularProduct } from '@/types';

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [productsSnap, categoriesSnap, gallerySnap, enquiriesSnap] = await Promise.all([
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'categories')),
      getDocs(collection(db, 'gallery')),
      getDocs(collection(db, 'enquiries')),
    ]);

    let totalProducts = productsSnap.size;
    let publishedProducts = 0;
    let featuredProducts = 0;
    productsSnap.forEach(d => {
      const data = d.data();
      if (data.status === 'published') publishedProducts++;
      if (data.featured || data.is_featured) featuredProducts++;
    });

    let totalCategories = categoriesSnap.size;
    let totalGalleryAlbums = gallerySnap.size;
    let totalGalleryImages = 0;
    gallerySnap.forEach(d => {
      const images = d.data().images || [];
      totalGalleryImages += images.length;
    });

    let totalEnquiries = enquiriesSnap.size;
    let newEnquiries = 0;
    enquiriesSnap.forEach(d => {
      if (d.data().status === 'new') newEnquiries++;
    });

    return {
      total_products: totalProducts,
      published_products: publishedProducts,
      total_categories: totalCategories,
      total_gallery_albums: totalGalleryAlbums,
      total_gallery_images: totalGalleryImages,
      total_enquiries: totalEnquiries,
      new_enquiries: newEnquiries,
      featured_products: featuredProducts,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      total_products: 0,
      published_products: 0,
      total_categories: 0,
      total_gallery_albums: 0,
      total_gallery_images: 0,
      total_enquiries: 0,
      new_enquiries: 0,
      featured_products: 0,
    };
  }
}

export async function getPopularProducts(): Promise<PopularProduct[]> {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    const products: PopularProduct[] = [];

    snapshot.forEach(d => {
      const data = d.data();
      if (data.status === 'published') {
        products.push({
          id: d.id,
          name: data.name || '',
          slug: data.slug || d.id,
          cover_image_url: data.imageUrl || data.cover_image_url || null,
          view_count: data.view_count || 0,
          enquiry_count: data.enquiry_count || 0,
          category_name: typeof data.category === 'object' ? data.category?.name : (data.category || null),
        });
      }
    });

    products.sort((a, b) => b.view_count - a.view_count);
    return products.slice(0, 5);
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return [];
  }
}

export async function getRecentEnquiries(limitCount = 5) {
  try {
    const snapshot = await getDocs(collection(db, 'enquiries'));
    const list: any[] = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    list.sort((a, b) => new Date(b.createdAt || b.created_at || 0).getTime() - new Date(a.createdAt || a.created_at || 0).getTime());
    return list.slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching recent enquiries:', error);
    return [];
  }
}
