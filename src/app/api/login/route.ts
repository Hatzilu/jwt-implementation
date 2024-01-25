import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

type ResponseData = {
	message: string;
};

export async function POST(req: Request) {
	try {
		const data = await req.json();
		console.log({ data });

		return NextResponse.json({
			message: 'hi',
		});
	} catch (e) {
		console.log('err while parsing post', e);
	}
	// res.status(200).sjson({ message: 'Hello from Next.js!' });
}
