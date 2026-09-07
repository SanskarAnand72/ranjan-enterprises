'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ActionResult } from '@/types';

const ADMIN_SESSION_COOKIE = 'admin-session';

export async function setAdminSession(idToken: string): Promise<ActionResult<void>> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to establish session.' };
  }
}

export async function login(email: string, password: string): Promise<ActionResult<void>> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return { success: false, error: 'Firebase API key is missing.' };
    }

    // Authenticate with Firebase Auth REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      const msg = data?.error?.message || 'Invalid email or password.';
      return { success: false, error: msg.includes('INVALID_PASSWORD') || msg.includes('EMAIL_NOT_FOUND') ? 'Invalid email or password.' : msg };
    }

    // Set HTTP-only session cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, data.idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return { success: true, data: undefined };
  } catch (error: any) {
    console.error('Firebase Auth Login Error:', error);
    return { success: false, error: error.message || 'Authentication failed.' };
  }
}

export async function requestPasswordReset(email: string): Promise<ActionResult<void>> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) return { success: false, error: 'Firebase API key is missing.' };

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email,
        }),
      }
    );

    if (!response.ok) {
      return { success: false, error: 'Failed to send password reset email.' };
    }

    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePassword(password: string): Promise<ActionResult<void>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) return { success: false, error: 'Not authenticated' };

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken: token,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      return { success: false, error: 'Failed to update password.' };
    }

    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect('/admin/login');
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return token ? { user: { email: 'admin@ranjanenterprises.com' } } : null;
}

export async function getUser() {
  const session = await getSession();
  return session ? session.user : null;
}

export async function getUserProfile() {
  const user = await getUser();
  if (!user) return null;

  return {
    id: 'admin-1',
    email: user.email,
    full_name: 'Administrator',
    avatar_url: null,
    role: 'admin' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
