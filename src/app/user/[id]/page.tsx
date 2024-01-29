'use client';
import React from 'react';
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import useUserActivity from '@/app/hooks/useUserActivity';

const User = () => {
	const router = useRouter();
	const { isUserActive, secondsSinceLastActive } = useUserActivity();

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
