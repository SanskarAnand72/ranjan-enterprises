export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

export const PRODUCT_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
  hidden: 'Hidden',
};

export const PRODUCT_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-orange-100 text-orange-700',
  hidden: 'bg-red-100 text-red-700',
};

export const STOCK_STATUS_LABELS: Record<string, string> = {
  in_stock: 'In Stock',
  out_of_stock: 'Out of Stock',
  made_to_order: 'Made to Order',
  discontinued: 'Discontinued',
};

export const ENQUIRY_STATUS_LABELS: Record<string, string> = {
  new: 'New',
  in_progress: 'In Progress',
  completed: 'Completed',
  spam: 'Spam',
};

export const ENQUIRY_STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  spam: 'bg-red-100 text-red-700',
};

export const WOOD_TYPES = [
  'Teak',
  'Sheesham',
  'Mango Wood',
  'Rosewood',
  'Oak',
  'Walnut',
  'Pine',
  'Mahogany',
  'Bamboo',
  'Engineered Wood',
  'Plywood',
  'MDF',
  'Solid Wood',
];

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Products', href: '/admin/products', icon: 'Package' },
  { label: 'Categories', href: '/admin/categories', icon: 'FolderOpen' },
  { label: 'Gallery', href: '/admin/gallery', icon: 'Images' },
  { label: 'Enquiries', href: '/admin/enquiries', icon: 'MessageSquare' },
  { label: 'Homepage', href: '/admin/homepage', icon: 'Home' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart3' },
];

export const ITEMS_PER_PAGE = 12;
export const ADMIN_ITEMS_PER_PAGE = 20;

export const MAX_IMAGE_SIZE_MB = 10;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
