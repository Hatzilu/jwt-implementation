import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
	console.log({ accessToken });

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
