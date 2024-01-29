'use client';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import useUserActivity from '@/app/hooks/useUserActivity';
import { updateTokenCookie } from '@/lib/utils';

const User = () => {
	const router = useRouter();
	const { isUserActive, secondsSinceLastActive } = useUserActivity();

	const refreshToken = Cookies.get('refreshToken');
	const deleteSession = () => {
		Cookies.remove('accessToken');
		Cookies.remove('refreshToken');
	};
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

	const shouldRotateAccessToken =
		!Cookies.get('accessToken') && isUserActive && !!Cookies.get('refreshToken');
	const auth = useQuery({
		queryKey: ['getToken'],
		enabled: shouldRotateAccessToken,
		queryFn: async () => {
			const res = await fetch('/api/getToken', {
				method: 'POST',
				body: JSON.stringify(Cookies.get('refreshToken')),
			});
			if (!res.ok) {
				console.log({ res });
				return;
			}
			const json = await res.json();
			updateTokenCookie('accessToken', json.accessToken, 5);
			updateTokenCookie('refreshToken', json.refreshToken, 30);
		},
	});
	console.log({
		accessToken: Cookies.get('accessToken'),
		refreshToken: Cookies.get('refreshToken'),
		isUserActive,
	});

	useEffect(() => {
		if (isUserActive && refreshToken) return;

		router.push('/login?showAuthorizationMessage=true');
	}, [isUserActive, refreshToken]);

	return (
		<div className="flex flex-col gap-1">
			<h1>user page</h1>
			<pre>
				data: <code>{JSON.stringify(content.data)}</code>
			</pre>

			<p>is user active: {isUserActive ? 'yes' : 'no'}</p>
			<p>last active: {secondsSinceLastActive} seconds ago</p>
			<button onClick={() => content.refetch()}>refetch data</button>
			<button onClick={deleteSession}>logout</button>
		</div>
	);
};

export default User;
