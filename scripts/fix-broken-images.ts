import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAfg82n2wFdZXyY2CN-2Zn79L00DbD65_k',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'ranjan-enterprises-227e9.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ranjan-enterprises-227e9',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '606631910789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:606631910789:web:a583cf6baf52598696f8ec',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const PLACEHOLDER_URL = 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800&auto=format&fit=crop';

async function fixBrokenImages() {
  console.log('Auditing Firestore products for broken image URLs...');
  const snapshot = await getDocs(collection(db, 'products'));
  let fixedCount = 0;

  for (const document of snapshot.docs) {
    const data = document.data();
    let updated = false;
    let coverUrl = data.cover_image_url || data.imageUrl || data.coverImage || '';
    let images: any[] = data.images || [];

    // Check if cover URL is a broken dummy URL
    if (coverUrl.includes('v1234567890') || coverUrl.includes('fakePublicId') || coverUrl.includes('ranjan123/image/upload/v12345')) {
      coverUrl = PLACEHOLDER_URL;
      updated = true;
    }

    // Clean up images array
    const fixedImages = images.map((img: any, i: number) => {
      const url = typeof img === 'string' ? img : (img.url || img.secure_url || '');
      if (url.includes('v1234567890') || url.includes('fakePublicId') || url.includes('ranjan123/image/upload/v12345')) {
        updated = true;
        return {
          id: `img-fixed-${i}`,
          product_id: document.id,
          public_id: `fixed_${i}`,
          storage_path: `fixed_${i}`,
          url: PLACEHOLDER_URL,
          secure_url: PLACEHOLDER_URL,
          width: 800,
          height: 600,
          is_cover: i === 0,
          display_order: i,
        };
      }
      return img;
    });

    if (updated) {
      const docRef = doc(db, 'products', document.id);
      await updateDoc(docRef, {
        cover_image_url: coverUrl || PLACEHOLDER_URL,
        imageUrl: coverUrl || PLACEHOLDER_URL,
        coverImage: coverUrl || PLACEHOLDER_URL,
        images: fixedImages.length > 0 ? fixedImages : [{
          id: 'img-fixed-0',
          product_id: document.id,
          public_id: 'fixed_0',
          storage_path: 'fixed_0',
          url: PLACEHOLDER_URL,
          secure_url: PLACEHOLDER_URL,
          width: 800,
          height: 600,
          is_cover: true,
          display_order: 0,
        }],
      });
      console.log(`[Fixed Product Document]: ${document.id} (${data.name})`);
      fixedCount++;
    }
  }

  console.log(`Audit finished. Fixed ${fixedCount} product documents with broken URLs.`);
}

fixBrokenImages().catch(console.error);
