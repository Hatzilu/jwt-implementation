import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
	try {
		const oldRefreshToken = await req.json();
		console.log({ oldRefreshToken });
		if (!process.env.JWT_KEY) {
			throw new Error('JWT key doesnt exist');
		}
		if (!oldRefreshToken) {
			return NextResponse.json({ message: 'invalid refresh token' }, { status: 400 });
		}
		// This is the token the user uses to authenticate
		const accessToken = jwt.sign(oldRefreshToken, process.env.JWT_KEY);

		// This is our refresh token which will be used to refresh/rotate the access token
		const refreshToken = jwt.sign('access-token', process.env.JWT_KEY);

		return NextResponse.json({
			accessToken,
			refreshToken,
		});
	} catch (e) {
		console.log('err while getting new token', e);
	}
}
