import { NextResponse } from 'next/server';

type ResponseData = {
	token: string;
};

export async function GET(req: Request) {
	return NextResponse.json({
		name: 'balls',
		age: 9999,
	});
}
