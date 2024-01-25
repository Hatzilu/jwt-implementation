import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

type ResponseData = {
	token: string;
	exp: Date;
};

const getExpirationDate = (minutes: number) => new Date(Date.now() + minutes * 60000); // 1 minute = 60,000 milliseconds
// const getExpirationDate = (minutes: number) => new Date(Date.now() + 5000); // 1 minute = 60,000 milliseconds

export async function POST(req: Request) {
	try {
		const data = await req.json();
		console.log({ data });
		if (!process.env.JWT_KEY) {
			throw new Error('JWT key doesnt exist');
		}
		const token = jwt.sign(data, process.env.JWT_KEY);
		const expirationDate = getExpirationDate(5);

		return NextResponse.json({
			token,
			exp: expirationDate,
		});
	} catch (e) {
		console.log('err while parsing post', e);
	}
	// res.status(200).sjson({ message: 'Hello from Next.js!' });
}
