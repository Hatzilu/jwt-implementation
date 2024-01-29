import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
	try {
		const data = await req.json();
		console.log({ data });
		if (!process.env.JWT_KEY) {
			throw new Error('JWT key doesnt exist');
		}
		if (!data?.email || !data?.password) {
			return NextResponse.error();
			// throw new Error('Invalid credentials');
		}
		// This is the token the user uses to authenticate
		const accessToken = jwt.sign(data.email, process.env.JWT_KEY);

		// This is our refresh token which will be used to refresh/rotate the access token
		const refreshToken = jwt.sign('access-token', process.env.JWT_KEY);

		return NextResponse.json({
			accessToken,
			refreshToken,
		});
	} catch (e) {
		console.log('err while parsing post', e);
	}
	// res.status(200).sjson({ message: 'Hello from Next.js!' });
}
