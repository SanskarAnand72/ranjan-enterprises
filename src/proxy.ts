import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isAuthRoute =
    isLoginPage ||
    request.nextUrl.pathname === '/admin/forgot-password' ||
    request.nextUrl.pathname === '/admin/reset-password';

  const sessionCookie = request.cookies.get('admin-session')?.value;

  if (isAdminRoute && !isAuthRoute && !sessionCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && sessionCookie) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/admin/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
