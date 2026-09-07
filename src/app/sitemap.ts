import { MetadataRoute } from 'next';
import { getProducts } from '@/actions/products';
import { getCategories } from '@/actions/categories';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ranjanenterprises.com';

  const [productsRes, categories] = await Promise.all([
    getProducts({ page: 1, pageSize: 100, status: 'published' }),
    getCategories(true),
  ]);

  const staticPages = [
    '',
    '/products',
    '/gallery',
    '/services',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const productPages = productsRes.data.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.updated_at).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${baseUrl}/products?category=${c.id}`,
    lastModified: new Date(c.updated_at).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
