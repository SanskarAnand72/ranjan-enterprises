import { adminDb } from '../src/lib/firebase/admin';

async function seed() {
  console.log('--- Starting Complete Firebase Admin Seeder for Ranjan Enterprises ---');
  const now = new Date().toISOString();

  // 1. Seed Users Collection
  const users = [
    {
      id: 'admin-user-1',
      uid: 'admin-user-1',
      email: 'admin@ranjanenterprises.com',
      full_name: 'Administrator',
      role: 'admin',
      created_at: now,
      updated_at: now,
    },
  ];
  for (const u of users) {
    await adminDb.collection('users').doc(u.id).set(u, { merge: true });
    console.log(`Seeded user: ${u.email}`);
  }

  // 2. Seed Categories Collection
  const categories = [
    {
      id: 'cat-wooden-furniture',
      name: 'Custom Wooden Furniture',
      slug: 'custom-wooden-furniture',
      description: 'Handcrafted dining tables, chairs, sofas, and bedframes built with solid teak & sheesham wood.',
      is_active: true,
      display_order: 1,
      createdAt: now,
      updatedAt: now,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'cat-architectural-doors',
      name: 'Architectural Doors & Frames',
      slug: 'architectural-doors-and-frames',
      description: 'Solid wood entrance doors, carved panels, and heavy-duty wooden door frames.',
      is_active: true,
      display_order: 2,
      createdAt: now,
      updatedAt: now,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'cat-wood-workstation',
      name: 'Interior Woodwork & Paneling',
      slug: 'interior-woodwork-and-paneling',
      description: 'Decorative wall paneling, modular wooden cabinets, and ceiling woodwork.',
      is_active: true,
      display_order: 3,
      createdAt: now,
      updatedAt: now,
      created_at: now,
      updated_at: now,
    },
  ];
  for (const cat of categories) {
    await adminDb.collection('categories').doc(cat.id).set(cat, { merge: true });
    console.log(`Seeded category: ${cat.name}`);
  }

  // 3. Seed Products Collection
  const products = [
    {
      id: 'prod-teak-dining-table',
      name: 'Royal Solid Teak Wood Dining Table',
      slug: 'royal-solid-teak-wood-dining-table',
      sku: 'RE-TBL-001',
      category: 'cat-wooden-furniture',
      category_id: 'cat-wooden-furniture',
      price: 45000,
      shortDescription: '6-Seater solid teak wood dining table with natural hand-rubbed oil finish.',
      short_description: '6-Seater solid teak wood dining table with natural hand-rubbed oil finish.',
      fullDescription: 'Crafted from 100% seasoned solid teak wood, this 6-seater dining table brings timeless elegance to any dining room. Features reinforced joinery and stain-resistant finish.',
      description: 'Crafted from 100% seasoned solid teak wood, this 6-seater dining table brings timeless elegance to any dining room. Features reinforced joinery and stain-resistant finish.',
      featured: true,
      is_featured: true,
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=1200&auto=format&fit=crop',
      cover_image_url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=1200&auto=format&fit=crop',
      images: [
        {
          id: 'img-1',
          product_id: 'prod-teak-dining-table',
          url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=1200&auto=format&fit=crop',
          storage_path: 'products/sample-1.jpg',
          is_cover: true,
          display_order: 0,
          created_at: now,
        }
      ],
      display_order: 1,
      createdAt: now,
      updatedAt: now,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'prod-carved-main-door',
      name: 'Hand-Carved Heritage Entrance Door',
      slug: 'hand-carved-heritage-entrance-door',
      sku: 'RE-DOR-002',
      category: 'cat-architectural-doors',
      category_id: 'cat-architectural-doors',
      price: 38000,
      shortDescription: 'Heavy-duty carved teak entrance door with brass fittings option.',
      short_description: 'Heavy-duty carved teak entrance door with brass fittings option.',
      fullDescription: 'Custom architectural front door carved by master craftsmen. Weather-proof melamine coating ensures longevity under harsh outdoor weather.',
      description: 'Custom architectural front door carved by master craftsmen. Weather-proof melamine coating ensures longevity under harsh outdoor weather.',
      featured: true,
      is_featured: true,
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
      cover_image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
      images: [
        {
          id: 'img-2',
          product_id: 'prod-carved-main-door',
          url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
          storage_path: 'products/sample-2.jpg',
          is_cover: true,
          display_order: 0,
          created_at: now,
        }
      ],
      display_order: 2,
      createdAt: now,
      updatedAt: now,
      created_at: now,
      updated_at: now,
    },
  ];
  for (const prod of products) {
    await adminDb.collection('products').doc(prod.id).set(prod, { merge: true });
    console.log(`Seeded product: ${prod.name}`);
  }

  // 4. Seed Gallery Collection
  const galleryAlbums = [
    {
      id: 'alb-luxury-living',
      title: 'Luxury Living Room Suite',
      slug: 'luxury-living-room-suite',
      description: 'Bespoke wooden furniture setup for modern villas.',
      category: 'Furniture',
      is_featured: true,
      is_visible: true,
      display_order: 1,
      cover_image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop',
      images: [
        {
          id: 'gimg-1',
          gallery_id: 'alb-luxury-living',
          url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop',
          storage_path: 'gallery/sample-1.jpg',
          is_cover: true,
          display_order: 0,
          created_at: now,
        }
      ],
      created_at: now,
      updated_at: now,
    }
  ];
  for (const alb of galleryAlbums) {
    await adminDb.collection('gallery').doc(alb.id).set(alb, { merge: true });
    console.log(`Seeded gallery album: ${alb.title}`);
  }

  // 5. Seed Enquiries Collection
  const enquiries = [
    {
      id: 'enq-sample-1',
      name: 'Rajesh Sharma',
      email: 'rajesh@example.com',
      phone: '9876543210',
      message: 'Interested in getting custom teak doors built for a new home.',
      product_category: 'Architectural Doors & Frames',
      status: 'new',
      source: 'website',
      created_at: now,
      updated_at: now,
    }
  ];
  for (const enq of enquiries) {
    await adminDb.collection('enquiries').doc(enq.id).set(enq, { merge: true });
    console.log(`Seeded enquiry from: ${enq.name}`);
  }

  // 6. Seed Homepage Content Collection
  const homepageSections = [
    {
      id: 'hero',
      section: 'hero',
      title: 'Handcrafted Wooden Elegance Built to Last Generations',
      subtitle: 'Master Craftsmen Since 1998',
      description: 'We design and manufacture premium solid wood furniture, architectural doors, frames, and interior woodwork with unmatched precision.',
      is_visible: true,
      display_order: 1,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'about',
      section: 'about',
      title: 'Craftsmanship & Quality Workmanship',
      subtitle: 'About Ranjan Enterprises',
      description: 'With over two decades of woodworking mastery, Ranjan Enterprises delivers bespoke solid teak and sheesham wood solutions for residential and commercial projects.',
      is_visible: true,
      display_order: 2,
      created_at: now,
      updated_at: now,
    }
  ];
  for (const sec of homepageSections) {
    await adminDb.collection('homepage_content').doc(sec.id).set(sec, { merge: true });
    console.log(`Seeded homepage section: ${sec.section}`);
  }

  // 7. Seed Services Collection
  const services = [
    {
      id: 'srv-1',
      title: 'Custom Furniture & Woodwork',
      description: 'Handcrafted custom furniture designed to fit your unique spaces with architectural perfection.',
      icon: 'Hammer',
      features: ['Bespoke Designs', 'Premium Hardwoods', 'Precision Joinery', 'Custom Finishes'],
      is_active: true,
      display_order: 1,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'srv-2',
      title: 'Architectural Doors & Framing',
      description: 'Solid teak and hardwood doors, frames, and paneling built for durability and aesthetic grandeur.',
      icon: 'DoorClosed',
      features: ['Teak & Mahogany Options', 'Weather-Resistant Coating', 'Custom Carvings', 'Heavy-Duty Hardware'],
      is_active: true,
      display_order: 2,
      created_at: now,
      updated_at: now,
    },
  ];
  for (const srv of services) {
    await adminDb.collection('services').doc(srv.id).set(srv, { merge: true });
    console.log(`Seeded service: ${srv.title}`);
  }

  // 8. Seed Testimonials Collection
  const testimonials = [
    {
      id: 'tst-1',
      customer_name: 'Vikram Malhotra',
      customer_location: 'New Delhi',
      content: 'The custom solid teak dining set exceeded our expectations. The attention to detail and wood finish is top tier.',
      rating: 5,
      product_purchased: 'Royal Solid Teak Wood Dining Table',
      is_featured: true,
      is_visible: true,
      display_order: 1,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'tst-2',
      customer_name: 'Ananya Verma',
      customer_location: 'Gurugram',
      content: 'Outstanding carving quality on our main entrance door. Ranjan Enterprises delivered on time with perfect craftsmanship.',
      rating: 5,
      product_purchased: 'Hand-Carved Heritage Entrance Door',
      is_featured: true,
      is_visible: true,
      display_order: 2,
      created_at: now,
      updated_at: now,
    }
  ];
  for (const tst of testimonials) {
    await adminDb.collection('testimonials').doc(tst.id).set(tst, { merge: true });
    console.log(`Seeded testimonial from: ${tst.customer_name}`);
  }

  // 9. Seed Website Settings Collection (website_settings and settings)
  const settings = {
    companyName: 'Ranjan Enterprises',
    business_name: 'Ranjan Enterprises',
    business_tagline: 'Premium Wooden Works & Custom Woodwork',
    phone: '8859123538',
    whatsapp: '918859123538',
    email: 'info@ranjanenterprises.com',
    address: 'Workshop Area, Industrial Zone, New Delhi, India',
    working_hours: 'Mon - Sat: 9:00 AM - 8:00 PM',
    footer_about: 'Crafting timeless wood furniture with precision, passion, and elegance.',
    seo_title: 'Ranjan Enterprises — Handcrafted Wooden Excellence',
    seo_description: 'Custom handcrafted wooden furniture, doors, frames, and interior woodworking.',
    updatedAt: now,
    updated_at: now,
  };

  await adminDb.collection('website_settings').doc('general').set(settings, { merge: true });
  await adminDb.collection('settings').doc('general').set(settings, { merge: true });
  console.log('Seeded website_settings & settings collections.');

  console.log('--- All 9 Firebase Collections Seeded Successfully via Admin SDK! ---');
}

seed().catch(err => {
  console.error('Seeding error:', err);
});
