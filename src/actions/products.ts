'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, limit, writeBatch } from 'firebase/firestore';
import { deleteFileFromCloudinary } from '@/actions/storage';
import { productSchema } from '@/lib/validations/product';
import type {
  ActionResult,
  Product,
  ProductImage,
  PaginatedResult,
  ProductFilters,
} from '@/types';
import { slugify } from '@/lib/utils';

// Helper to normalize Firestore product doc into Product interface
function normalizeProduct(id: string, data: any): Product {
  const rawImages = Array.isArray(data.images) 
    ? data.images 
    : (data.imageUrl || data.cover_image_url || data.coverImage ? [data.cover_image_url || data.imageUrl || data.coverImage] : []);
  
  const images: ProductImage[] = rawImages
    .map((img: any, idx: number) => {
      const url = typeof img === 'string' ? img : (img.url || img.secure_url || img.src || '');
      const publicId = typeof img === 'string' ? '' : (img.public_id || img.publicId || img.storage_path || img.storagePath || '');
      const isCover = typeof img === 'string' ? (idx === 0) : (img.is_cover ?? img.isCover ?? (idx === 0));
      const displayOrder = typeof img === 'string' ? idx : (img.display_order ?? img.displayOrder ?? idx);

      return {
        id: typeof img === 'object' && img.id ? img.id : `img-${idx}`,
        product_id: id,
        public_id: publicId,
        storage_path: publicId,
        url: url.trim(),
        secure_url: url.trim(),
        width: (typeof img === 'object' && img.width) || 800,
        height: (typeof img === 'object' && img.height) || 600,
        alt_text: (typeof img === 'object' && img.alt_text) || data.name || '',
        is_cover: Boolean(isCover),
        display_order: displayOrder,
        created_at: (typeof img === 'object' && img.created_at) || data.createdAt || new Date().toISOString(),
      };
    })
    .filter((img: ProductImage) => Boolean(img.url));

  // Determine cover image URL
  const coverImg = 
    images.find((i: ProductImage) => i.is_cover)?.url || 
    images[0]?.url || 
    (typeof data.cover_image_url === 'string' && data.cover_image_url.trim()) || 
    (typeof data.imageUrl === 'string' && data.imageUrl.trim()) || 
    (typeof data.coverImage === 'string' && data.coverImage.trim()) || 
    null;

  const price = typeof data.price === 'number' ? data.price : (parseFloat(data.price) || null);
  const original_price = typeof data.original_price === 'number' ? data.original_price : (parseFloat(data.original_price) || null);
  
  let discount_percentage = typeof data.discount_percentage === 'number' ? data.discount_percentage : (parseFloat(data.discount_percentage) || null);
  if (discount_percentage === null && original_price && price && original_price > price) {
    discount_percentage = Math.round(((original_price - price) / original_price) * 100);
  }

  const woodTypes = Array.isArray(data.wood_types) ? data.wood_types : (data.wood_type ? [data.wood_type] : []);

  const normalized: Product = {
    id,
    name: data.name || '',
    slug: data.slug || slugify(data.name || id),
    sku: data.sku || null,
    category_id: data.category_id || data.category || null,
    price,
    original_price,
    discount_percentage,
    price_label: data.price_label || null,
    description: data.fullDescription || data.description || '',
    short_description: data.shortDescription || data.short_description || '',
    specifications: Array.isArray(data.specifications) ? data.specifications : [],
    
    wood_type: data.wood_type || (woodTypes[0] || null),
    wood_types: woodTypes,
    material_type: data.material_type || data.materialType || null,
    finish_type: data.finish_type || data.finishType || null,
    color: data.color || null,
    thickness: data.thickness || null,
    durability_info: data.durability_info || data.durabilityInfo || null,
    warranty_info: data.warranty_info || data.warrantyInfo || null,

    dimensions: data.dimensions || (data.height && data.width && data.length ? `${data.length} L x ${data.width} W x ${data.height} H` : null),
    height: data.height || null,
    width: data.width || null,
    length: data.length || null,
    weight: data.weight || null,

    available_sizes: Array.isArray(data.available_sizes) ? data.available_sizes : [],
    customization_options: data.customization_options || null,
    delivery_time: data.delivery_time || null,
    status: data.status || 'published',
    stock_status: data.stock_status || 'in_stock',
    in_stock: data.in_stock ?? (data.stock_status !== 'out_of_stock'),
    is_featured: Boolean(data.featured ?? data.is_featured ?? false),
    display_order: typeof data.display_order === 'number' ? data.display_order : 0,
    cover_image_url: coverImg,
    imageUrl: coverImg, // Compatibility alias
    coverImage: coverImg, // Compatibility alias
    video_url: data.video_url || null,
    meta_title: data.meta_title || null,
    meta_description: data.meta_description || null,
    view_count: data.view_count || 0,
    enquiry_count: data.enquiry_count || 0,
    created_at: data.createdAt || data.created_at || new Date().toISOString(),
    updated_at: data.updatedAt || data.updated_at || new Date().toISOString(),
    category: typeof data.category === 'object' && data.category ? data.category : {
      id: data.category_id || data.category || '',
      name: data.category_name || data.category || 'General',
      slug: slugify(data.category_name || data.category || 'general'),
      description: null,
      icon: null,
      image_url: null,
      is_active: true,
      display_order: 0,
      meta_title: null,
      meta_description: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    images,
  };

  console.log('[Firestore Product Normalized Data]:', {
    id: normalized.id,
    name: normalized.name,
    cover_image_url: normalized.cover_image_url,
    image_count: normalized.images?.length || 0,
  });

  return normalized;
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResult<Product>> {
  try {
    const {
      search,
      category,
      status,
      is_featured,
      sort = 'display_order',
      page = 1,
      pageSize = 100,
    } = filters;

    const snapshot = await getDocs(collection(db, 'products'));
    let products: Product[] = snapshot.docs.map(d => normalizeProduct(d.id, d.data()));

    // Apply Client/In-memory filtering for complete flexibility
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        p => p.name.toLowerCase().includes(q) || 
             p.description?.toLowerCase().includes(q) || 
             p.wood_type?.toLowerCase().includes(q) ||
             p.sku?.toLowerCase().includes(q)
      );
    }

    if (category) {
      products = products.filter(p => p.category_id === category || p.category?.id === category);
    }

    if (status) {
      products = products.filter(p => p.status === status);
    }

    if (is_featured !== undefined) {
      products = products.filter(p => p.is_featured === is_featured);
    }

    // Sort
    products.sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sort === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sort === 'price_desc') return (b.price || 0) - (a.price || 0);
      if (sort === 'name_asc') return a.name.localeCompare(b.name);
      if (sort === 'name_desc') return b.name.localeCompare(a.name);
      return a.display_order - b.display_order;
    });

    const total = products.length;
    const from = (page - 1) * pageSize;
    const paginated = products.slice(from, from + pageSize);

    return {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return { data: [], total: 0, page: 1, pageSize: 12, totalPages: 0 };
  }
}

export async function getPublishedProducts(
  filters: Omit<ProductFilters, 'status'> = {}
): Promise<PaginatedResult<Product>> {
  return getProducts({ ...filters, status: 'published' });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const cleanSlug = slug.trim().toLowerCase();
    // 1. Primary lookup by slug
    const q = query(collection(db, 'products'), where('slug', '==', cleanSlug), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const d = snapshot.docs[0];
      return normalizeProduct(d.id, d.data());
    }

    // 2. Fallback scan all products
    const allSnap = await getDocs(collection(db, 'products'));
    for (const d of allSnap.docs) {
      const p = normalizeProduct(d.id, d.data());
      if (p.slug.toLowerCase() === cleanSlug || p.id === slug) {
        return p;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error in getProductBySlug for "${slug}":`, error);
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return normalizeProduct(snapshot.id, snapshot.data());
    }

    const q = query(collection(db, 'products'), where('slug', '==', id), limit(1));
    const snapshotBySlug = await getDocs(q);
    if (!snapshotBySlug.empty) {
      const docBySlug = snapshotBySlug.docs[0];
      return normalizeProduct(docBySlug.id, docBySlug.data());
    }

    return null;
  } catch (error) {
    console.error(`Error in getProductById for id ${id}:`, error);
    return null;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    const all = snapshot.docs.map(d => normalizeProduct(d.id, d.data()));
    const published = all.filter(p => p.status === 'published');
    const featured = published.filter(p => p.is_featured);
    const result = featured.length > 0 ? featured : published;
    return result
      .sort((a, b) => a.display_order - b.display_order)
      .slice(0, 6);
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null
): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    const all = snapshot.docs.map(d => normalizeProduct(d.id, d.data()));
    return all
      .filter(p => p.id !== productId && p.status === 'published' && (!categoryId || p.category_id === categoryId))
      .slice(0, 4);
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    return [];
  }
}

export async function createProduct(formData: unknown): Promise<ActionResult<Product>> {
  const parsed = productSchema.safeParse(formData);
  if (!parsed.success) {
    console.error('[Create Product Validation Error]:', parsed.error.flatten().fieldErrors);
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const now = new Date().toISOString();
    const docRef = doc(collection(db, 'products'));
    
    const origPrice = parsed.data.original_price ?? null;
    const sellPrice = parsed.data.price ?? null;
    let discPct = parsed.data.discount_percentage ?? null;
    if (discPct === null && origPrice && sellPrice && origPrice > sellPrice) {
      discPct = Math.round(((origPrice - sellPrice) / origPrice) * 100);
    }

    const woodTypes = parsed.data.wood_types || (parsed.data.wood_type ? [parsed.data.wood_type] : []);

    const imagesList = (parsed.data.images || []).map((img: any, i: number) => {
      const publicId = img.public_id || img.storage_path || '';
      return {
        id: img.id || `img-${Date.now()}-${i}`,
        product_id: docRef.id,
        public_id: publicId,
        storage_path: publicId,
        url: img.url,
        secure_url: img.url,
        width: img.width || 800,
        height: img.height || 600,
        alt_text: img.alt_text || parsed.data.name || '',
        is_cover: img.is_cover ?? (i === 0),
        display_order: img.display_order ?? i,
        created_at: now,
      };
    });

    const coverImage = imagesList.find((i: any) => i.is_cover)?.url || imagesList[0]?.url || null;

    const productPayload = {
      id: docRef.id,
      name: parsed.data.name,
      slug: parsed.data.slug || slugify(parsed.data.name),
      sku: parsed.data.sku || null,
      category: parsed.data.category_id || 'general',
      category_id: parsed.data.category_id || null,
      price: sellPrice,
      original_price: origPrice,
      discount_percentage: discPct,
      price_label: parsed.data.price_label || null,
      shortDescription: parsed.data.short_description || '',
      short_description: parsed.data.short_description || '',
      fullDescription: parsed.data.description || '',
      description: parsed.data.description || '',
      
      wood_type: parsed.data.wood_type || (woodTypes[0] || null),
      wood_types: woodTypes,
      material_type: parsed.data.material_type || null,
      finish_type: parsed.data.finish_type || null,
      color: parsed.data.color || null,
      thickness: parsed.data.thickness || null,
      durability_info: parsed.data.durability_info || null,
      warranty_info: parsed.data.warranty_info || null,

      dimensions: parsed.data.dimensions || (parsed.data.height && parsed.data.width && parsed.data.length ? `${parsed.data.length} L x ${parsed.data.width} W x ${parsed.data.height} H` : null),
      height: parsed.data.height || null,
      width: parsed.data.width || null,
      length: parsed.data.length || null,
      weight: parsed.data.weight || null,

      specifications: parsed.data.specifications || [],
      available_sizes: parsed.data.available_sizes || [],
      customization_options: parsed.data.customization_options || null,
      delivery_time: parsed.data.delivery_time || null,

      featured: parsed.data.is_featured ?? false,
      is_featured: parsed.data.is_featured ?? false,
      status: parsed.data.status || 'published',
      stock_status: parsed.data.stock_status || 'in_stock',
      in_stock: parsed.data.in_stock ?? true,

      imageUrl: coverImage,
      cover_image_url: coverImage,
      coverImage: coverImage,
      images: imagesList,
      display_order: parsed.data.display_order || 0,
      createdAt: now,
      created_at: now,
      updatedAt: now,
      updated_at: now,
    };

    console.log('[Firestore Document Creating]:', {
      id: docRef.id,
      name: productPayload.name,
      cover_image_url: productPayload.cover_image_url,
      images_count: productPayload.images.length,
    });

    await setDoc(docRef, productPayload);
    const createdProduct = normalizeProduct(docRef.id, productPayload);

    console.log('[Firestore Document Saved Successfully]:', createdProduct.id);

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');

    return { success: true, data: createdProduct, message: 'Product created successfully' };
  } catch (err: any) {
    console.error('Error creating product in Firestore:', err);
    return { success: false, error: err.message || 'Failed to create product' };
  }
}

export async function updateProduct(id: string, formData: unknown): Promise<ActionResult<Product>> {
  const parsed = productSchema.safeParse(formData);
  if (!parsed.success) {
    console.error('[Update Product Validation Error]:', parsed.error.flatten().fieldErrors);
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const now = new Date().toISOString();
    const docRef = doc(db, 'products', id);
    
    const origPrice = parsed.data.original_price ?? null;
    const sellPrice = parsed.data.price ?? null;
    let discPct = parsed.data.discount_percentage ?? null;
    if (discPct === null && origPrice && sellPrice && origPrice > sellPrice) {
      discPct = Math.round(((origPrice - sellPrice) / origPrice) * 100);
    }

    const woodTypes = parsed.data.wood_types || (parsed.data.wood_type ? [parsed.data.wood_type] : []);

    const imagesList = (parsed.data.images || []).map((img: any, i: number) => {
      const publicId = img.public_id || img.storage_path || '';
      return {
        id: img.id || `img-${Date.now()}-${i}`,
        product_id: id,
        public_id: publicId,
        storage_path: publicId,
        url: img.url,
        secure_url: img.url,
        width: img.width || 800,
        height: img.height || 600,
        alt_text: img.alt_text || parsed.data.name || '',
        is_cover: img.is_cover ?? (i === 0),
        display_order: img.display_order ?? i,
        created_at: now,
      };
    });

    const coverImage = imagesList.find((i: any) => i.is_cover)?.url || imagesList[0]?.url || null;

    const updates = {
      name: parsed.data.name,
      slug: parsed.data.slug || slugify(parsed.data.name),
      sku: parsed.data.sku || null,
      category: parsed.data.category_id || 'general',
      category_id: parsed.data.category_id || null,
      price: sellPrice,
      original_price: origPrice,
      discount_percentage: discPct,
      price_label: parsed.data.price_label || null,
      shortDescription: parsed.data.short_description || '',
      short_description: parsed.data.short_description || '',
      fullDescription: parsed.data.description || '',
      description: parsed.data.description || '',

      wood_type: parsed.data.wood_type || (woodTypes[0] || null),
      wood_types: woodTypes,
      material_type: parsed.data.material_type || null,
      finish_type: parsed.data.finish_type || null,
      color: parsed.data.color || null,
      thickness: parsed.data.thickness || null,
      durability_info: parsed.data.durability_info || null,
      warranty_info: parsed.data.warranty_info || null,

      dimensions: parsed.data.dimensions || (parsed.data.height && parsed.data.width && parsed.data.length ? `${parsed.data.length} L x ${parsed.data.width} W x ${parsed.data.height} H` : null),
      height: parsed.data.height || null,
      width: parsed.data.width || null,
      length: parsed.data.length || null,
      weight: parsed.data.weight || null,

      specifications: parsed.data.specifications || [],
      available_sizes: parsed.data.available_sizes || [],
      customization_options: parsed.data.customization_options || null,
      delivery_time: parsed.data.delivery_time || null,

      featured: parsed.data.is_featured ?? false,
      is_featured: parsed.data.is_featured ?? false,
      status: parsed.data.status || 'published',
      stock_status: parsed.data.stock_status || 'in_stock',
      in_stock: parsed.data.in_stock ?? true,

      imageUrl: coverImage,
      cover_image_url: coverImage,
      coverImage: coverImage,
      images: imagesList,
      updatedAt: now,
      updated_at: now,
    };

    console.log('[Firestore Document Updating]:', {
      id,
      cover_image_url: updates.cover_image_url,
      images_count: updates.images.length,
    });

    await updateDoc(docRef, updates);
    
    const updatedDoc = await getDoc(docRef);
    const product = normalizeProduct(id, updatedDoc.data());

    console.log('[Firestore Document Updated Successfully]:', product.id);

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath('/products');
    revalidatePath(`/products/${product.slug}`);
    revalidatePath('/');

    return { success: true, data: product, message: 'Product updated successfully' };
  } catch (err: any) {
    console.error('Error updating product in Firestore:', err);
    return { success: false, error: err.message || 'Failed to update product' };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult<void>> {
  try {
    const docRef = doc(db, 'products', id);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      const data = snapshot.data();
      const images = data?.images || [];
      
      for (const img of images) {
        const publicId = img.public_id || img.storage_path;
        if (publicId) {
          try {
            await deleteFileFromCloudinary(publicId);
          } catch (e) {
            // Ignore error if file doesn't exist on Cloudinary
          }
        }
      }
    }

    await deleteDoc(docRef);

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');

    return { success: true, data: undefined, message: 'Product deleted successfully' };
  } catch (err: any) {
    console.error('Error deleting product:', err);
    return { success: false, error: err.message || 'Failed to delete product' };
  }
}

export async function duplicateProduct(id: string): Promise<ActionResult<Product>> {
  const original = await getProductById(id);
  if (!original) return { success: false, error: 'Product not found' };

  const newName = `${original.name} (Copy)`;
  const newSlug = `${slugify(original.name)}-copy-${Date.now()}`;
  const now = new Date().toISOString();

  try {
    const newDocRef = doc(collection(db, 'products'));
    const payload = {
      ...original,
      id: newDocRef.id,
      name: newName,
      slug: newSlug,
      status: 'draft',
      featured: false,
      is_featured: false,
      createdAt: now,
      created_at: now,
      updatedAt: now,
      updated_at: now,
    };

    await setDoc(newDocRef, payload);
    const product = normalizeProduct(newDocRef.id, payload);

    revalidatePath('/admin/products');
    return { success: true, data: product, message: 'Product duplicated successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to duplicate product' };
  }
}

export async function updateProductStatus(id: string, status: string): Promise<ActionResult<void>> {
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'products', id), {
      status,
      updatedAt: now,
      updated_at: now,
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleFeatured(id: string, is_featured: boolean): Promise<ActionResult<void>> {
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'products', id), {
      featured: is_featured,
      is_featured,
      updatedAt: now,
      updated_at: now,
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function reorderProducts(ids: string[]): Promise<ActionResult<void>> {
  try {
    const batch = writeBatch(db);
    ids.forEach((id, index) => {
      const ref = doc(db, 'products', id);
      batch.update(ref, { display_order: index });
    });
    await batch.commit();

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function addProductImages(
  productId: string,
  images: Array<{
    public_id?: string;
    storage_path?: string;
    url: string;
    secure_url?: string;
    width?: number;
    height?: number;
    alt_text?: string;
    is_cover?: boolean;
    display_order: number;
  }>
): Promise<ActionResult<ProductImage[]>> {
  try {
    const docRef = doc(db, 'products', productId);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) return { success: false, error: 'Product not found' };

    const existingData = snapshot.data();
    const existingImages: any[] = existingData?.images || [];
    
    const newImages = images.map((img, i) => {
      const publicId = img.public_id || img.storage_path || `products/${Date.now()}_${i}`;
      return {
        id: `img-${Date.now()}-${i}`,
        product_id: productId,
        public_id: publicId,
        storage_path: publicId,
        url: img.url,
        secure_url: img.secure_url || img.url,
        width: img.width || 800,
        height: img.height || 600,
        alt_text: img.alt_text || '',
        is_cover: img.is_cover ?? (existingImages.length === 0 && i === 0),
        display_order: existingImages.length + i,
        created_at: new Date().toISOString(),
      };
    });

    const combinedImages = [...existingImages, ...newImages];
    const coverImage = combinedImages.find((i: any) => i.is_cover)?.url || combinedImages[0]?.url || null;

    await updateDoc(docRef, {
      images: combinedImages,
      imageUrl: coverImage,
      cover_image_url: coverImage,
      coverImage: coverImage,
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${productId}/edit`);
    revalidatePath('/products');

    return { success: true, data: newImages as ProductImage[] };
  } catch (err: any) {
    console.error('Error in addProductImages:', err);
    return { success: false, error: err.message || 'Failed to add images' };
  }
}

export async function deleteProductImage(
  imageId: string,
  storagePath: string
): Promise<ActionResult<void>> {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    for (const d of snapshot.docs) {
      const data = d.data();
      const images: any[] = data.images || [];
      if (images.some(img => img.id === imageId || img.public_id === storagePath || img.storage_path === storagePath)) {
        const filtered = images.filter(img => img.id !== imageId && img.public_id !== storagePath && img.storage_path !== storagePath);
        const coverImage = filtered.find(img => img.is_cover)?.url || filtered[0]?.url || null;
        
        await updateDoc(d.ref, {
          images: filtered,
          imageUrl: coverImage,
          cover_image_url: coverImage,
          coverImage: coverImage,
          updatedAt: new Date().toISOString(),
        });

        if (storagePath) {
          try {
            await deleteFileFromCloudinary(storagePath);
          } catch (e) {
            // Ignore error if file doesn't exist
          }
        }
        break;
      }
    }

    revalidatePath('/admin/products');
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function setCoverImage(
  imageId: string,
  productId: string
): Promise<ActionResult<void>> {
  try {
    const docRef = doc(db, 'products', productId);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) return { success: false, error: 'Product not found' };

    const data = snapshot.data();
    const images: any[] = data?.images || [];
    let coverUrl = null;

    const updatedImages = images.map(img => {
      const isCover = img.id === imageId;
      if (isCover) coverUrl = img.url;
      return { ...img, is_cover: isCover };
    });

    await updateDoc(docRef, {
      images: updatedImages,
      imageUrl: coverUrl || data?.imageUrl,
      cover_image_url: coverUrl || data?.cover_image_url,
      coverImage: coverUrl || data?.coverImage,
      updatedAt: new Date().toISOString(),
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${productId}/edit`);
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function reorderProductImages(
  updates: Array<{ id: string; display_order: number }>
): Promise<ActionResult<void>> {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    for (const d of snapshot.docs) {
      const data = d.data();
      const images: any[] = data.images || [];
      let modified = false;

      const newImages = images.map(img => {
        const match = updates.find(u => u.id === img.id);
        if (match) {
          modified = true;
          return { ...img, display_order: match.display_order };
        }
        return img;
      });

      if (modified) {
        newImages.sort((a, b) => a.display_order - b.display_order);
        await updateDoc(d.ref, { images: newImages });
      }
    }

    revalidatePath('/admin/products');
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
