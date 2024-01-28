'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

type FormValues = {
	readonly email: string;
	readonly password: string;
};

const getExpirationDate = (minutes: number) => new Date(Date.now() + minutes * 60000); // 1 minute = 60,000 milliseconds

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
			const accessTokenExp = new Date(getExpirationDate(30));
			const refreshTokenExp = new Date(getExpirationDate(5));
			console.log(json.accessToken);
			Cookies.set('accessToken', json.accessToken, { expires: accessTokenExp, path: '/' });
			Cookies.set(' refreshToken', json.refreshToken, { expires: refreshTokenExp, path: '/' });
			// document.cookie = `accesstoken=${};expires=${accessTokenExp};path=/`;
			// document.cookie = `refreshtoken=${json.refreshToken};expires=${};path=/`;
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
