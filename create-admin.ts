import { adminAuth, adminDb } from './src/lib/firebase/admin';

async function createAdmin() {
  const email = 'admin@ranjanenterprises.com';
  const password = 'password123';

  try {
    let user;
    try {
      user = await adminAuth.getUserByEmail(email);
      console.log('Admin user already exists in Auth:', user.email);
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        user = await adminAuth.createUser({
          email,
          password,
          displayName: 'Administrator',
        });
        console.log('Successfully created Firebase admin user:', user.email);
      } else {
        throw e;
      }
    }

    // Save/update user document in Firestore 'users' collection
    await adminDb.collection('users').doc(user.uid).set({
      id: user.uid,
      uid: user.uid,
      email: user.email,
      full_name: 'Administrator',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { merge: true });

    console.log('Successfully synced user in Firestore users collection:', user.uid);
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();
