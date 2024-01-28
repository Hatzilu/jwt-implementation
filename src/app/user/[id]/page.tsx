'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const User = () => {
	const router = useRouter();
	const [isUserActive, setIsUserActive] = useState(true);

	const content = useQuery({
		queryKey: ['userdata'],
		queryFn: async () => {
			const accesstoken = Cookies.get('accessToken');
			const res = await fetch('/api/userdata', {
				method: 'GET',
				headers: {
					authorization: `Bearer ${accesstoken}`,
				},
			});

			if (!res.ok) {
				if (res.status === 401) {
					router.push('/login?showAuthorizationMessage=true');
					return;
				}
				return {};
			}
			const json = await res.json();
			return json;
		},
	});

	console.log({ isUserActive });

	useEffect(() => {
		console.log('add listener');
		let timer = setTimeout(() => setIsUserActive(false), 5000);
		window.addEventListener('mousemove', () => {
			if (!isUserActive) {
				setIsUserActive(true);
				clearTimeout(timer);
			}
			timer = setTimeout(() => setIsUserActive(false), 5000);
		});

		// if user is active but refresh token expired, get a new one
		// const accessToken = Cookies.get('accessToken');
		// if (isUserActive === true && Boolean(accessToken) && !Cookies.get('refreshToken')) {
		// 	console.log('refresh token expired, issuing new one...');
		// 	const getToken = async () => {
		// 		const res = await fetch('/api/getToken', {
		// 			method: 'POST',
		// 			body: JSON.stringify(accessToken),
		// 		});
		// 		if (!res.ok) {
		// 			console.log('failed to get new token', res);
		// 			return;
		// 		}
		// 		const json = await res.json();
		// 		console.log({json});

		// 		// Cookies.set('refreshToken')

		// 	};
		// }

		return () => {
			window.removeEventListener('mousemove', () => 'removed mousemove listener');
			clearTimeout(timer);
		};
	}, [isUserActive]);

	console.log(content.error);

	return (
		<div className="flex flex-col gap-1">
			<h1>user page</h1>
			<pre>
				data: <code>{JSON.stringify(content.data)}</code>
			</pre>
			is user active: {isUserActive ? 'yes' : 'no'}
			<button onClick={() => content.refetch()}>refetch data</button>
		</div>
	);
};

export default User;
