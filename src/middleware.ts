import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	console.log({ cookies: request.cookies.getAll() });
	const token = request.cookies.get('token');
	if (!token) {
		// console.log('no token');
		throw new Error('no token');
	}

	// console.log({ request, token: localStorage.getItem('token') });
	// return NextResponse.redirect(new URL('/home', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: '/user/:path*',
};
