'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { updateTokenCookie } from '@/lib/utils';

type FormValues = {
	readonly email: string;
	readonly password: string;
};

const LoginForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>();
	const router = useRouter();
	const params = useSearchParams();
	const showAuthorizationMessage = params?.get('showAuthorizationMessage');

	const { mutate: login } = useMutation({
		mutationFn: async (data: FormValues) => {
			const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify(data) });
			if (!res.ok) {
				console.log('res failed', res);
				return;
			}

			const json = await res.json();

			updateTokenCookie('accessToken', json.accessToken, 1);
			updateTokenCookie('refreshToken', json.refreshToken, 3);
			console.log('cookies status:', {
				access: Cookies.get('accessToken'),
				refresh: Cookies.get('refreshToken'),
			});

			console.log('moving to user page');

			router.push('/user/5');
		},
		onError: (err) => console.error('failed to login', err),
	});

	return (
		<form onSubmit={handleSubmit((data) => login(data))} className="flex flex-col gap-1 text-blue-950">
			<input {...register('email', { required: 'An Email is required' })} placeholder="Email" />
			{errors.email && <p className="text-red-300">{errors.email.message}</p>}
			<input
				{...register('password', { required: 'A password is required' })}
				type="password"
				placeholder="password"
			/>
			{errors.password && <p className="text-red-300">{errors.password.message}</p>}
			<input type="submit" />
			{showAuthorizationMessage && (
				<p className="text-red-300">Session expired, please log-in again.</p>
			)}
		</form>
	);
};

export default LoginForm;
