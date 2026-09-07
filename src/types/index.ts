// ============================================================
// Global TypeScript Types — Ranjan Enterprises
// ============================================================

// ============================================================
// Database Enums
// ============================================================

export type ProductStatus = 'draft' | 'published' | 'archived' | 'hidden';
export type StockStatus = 'in_stock' | 'out_of_stock' | 'made_to_order' | 'discontinued';
export type EnquiryStatus = 'new' | 'in_progress' | 'completed' | 'spam';
export type UserRole = 'admin' | 'editor' | 'viewer';
export type SettingType = 'text' | 'json' | 'url' | 'phone' | 'email' | 'image' | 'boolean' | 'number';

// ============================================================
// Database Row Types
// ============================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface WebsiteSetting {
  id: string;
  key: string;
  value: string | null;
  value_json: Record<string, unknown> | null;
  label: string | null;
  description: string | null;
  setting_type: SettingType;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageContent {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  content_json: Record<string, unknown> | null;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  price: number | null; // Selling price / current price
  original_price: number | null; // Original price / MRP
  discount_percentage: number | null; // Discount percentage (% off)
  price_label: string | null;
  description: string | null;
  short_description: string | null;
  specifications: Specification[];
  
  // Wood & Material details
  wood_type: string | null;
  wood_types: string[];
  material_type: string | null;
  finish_type: string | null;
  color: string | null;
  thickness: string | null;
  durability_info: string | null;
  warranty_info: string | null;
  
  // Dimensions & Weight
  dimensions: string | null;
  height: string | null;
  width: string | null;
  length: string | null;
  weight: string | null;

  available_sizes: string[];
  customization_options: string | null;
  delivery_time: string | null;
  status: ProductStatus;
  stock_status: StockStatus;
  in_stock: boolean;
  is_featured: boolean;
  display_order: number;
  cover_image_url: string | null;
  imageUrl?: string | null; // Compatibility alias
  coverImage?: string | null; // Compatibility alias
  video_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  view_count: number;
  enquiry_count: number;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  public_id?: string;
  storage_path: string;
  url: string;
  secure_url?: string; // Compatibility alias
  width: number | null;
  height: number | null;
  alt_text: string | null;
  is_cover: boolean;
  display_order: number;
  created_at: string;
}

export interface Gallery {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  is_featured: boolean;
  is_visible: boolean;
  display_order: number;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  images?: GalleryImage[];
}

export interface GalleryImage {
  id: string;
  gallery_id: string;
  public_id?: string;
  storage_path: string;
  url: string;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  is_cover: boolean;
  display_order: number;
  created_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  product_category: string | null;
  message: string;
  product_id: string | null;
  product_name: string | null;
  status: EnquiryStatus;
  admin_notes: string | null;
  source: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_location: string | null;
  avatar_url: string | null;
  rating: number;
  content: string;
  product_purchased: string | null;
  is_featured: boolean;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  features: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Compound / Utility Types
// ============================================================

export interface Specification {
  key: string;
  value: string;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
}

export interface SiteSettings {
  business_name: string;
  business_tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  google_maps_url: string;
  logo_url: string;
  favicon_url: string;
  working_hours: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  footer_about: string;
  seo_title: string;
  seo_description: string;
}

// ============================================================
// API Response Types
// ============================================================

export type ActionResult<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================
// Filter / Query Types
// ============================================================

export interface ProductFilters {
  search?: string;
  category?: string;
  status?: ProductStatus;
  is_featured?: boolean;
  stock_status?: StockStatus;
  min_price?: number;
  max_price?: number;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'display_order';
  page?: number;
  pageSize?: number;
}

export interface GalleryFilters {
  category?: string;
  is_featured?: boolean;
  page?: number;
  pageSize?: number;
}

export interface EnquiryFilters {
  search?: string;
  status?: EnquiryStatus;
  page?: number;
  pageSize?: number;
}

// ============================================================
// Analytics Types
// ============================================================

export interface DashboardStats {
  total_products: number;
  published_products: number;
  total_categories: number;
  total_gallery_albums: number;
  total_gallery_images: number;
  total_enquiries: number;
  new_enquiries: number;
  featured_products: number;
}

export interface PopularProduct {
  id: string;
  name: string;
  slug: string;
  cover_image_url: string | null;
  view_count: number;
  enquiry_count: number;
  category_name: string | null;
}

// ============================================================
// Component Props Types
// ============================================================

export interface ImageUploadState {
  id: string;
  file?: File;
  url: string;
  storage_path: string;
  is_cover: boolean;
  display_order: number;
  alt_text: string;
  uploading?: boolean;
  error?: string;
  // For existing images from DB
  existing?: boolean;
  db_id?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
