import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
	const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
	const cookies = request.cookies.getAll();
	console.log({ accessToken, cookies });

	if (!accessToken || accessToken === 'undefined') {
		const url = new URL('/login', request.url);

		return NextResponse.rewrite(url, {
			status: 401,
		});
	}
	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: '/api/userdata/:path*',
};
