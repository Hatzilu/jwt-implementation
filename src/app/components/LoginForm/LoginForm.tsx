'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

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

	const { mutate: login } = useMutation({
		mutationFn: async (data: FormValues) => {
			const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify(data) });
			if (!res.ok) {
				console.log('res failed', res);
				return;
			}

			const json = await res.json();
			// localStorage.setItem('token', json.token);
			// localStorage.setItem('exp', json.exp);
			const expirationDate = new Date(json.exp).toUTCString();
			document.cookie = `token=${json.token};expires=${expirationDate};path=/`;
			console.log(document.cookie);

			console.log({ exp: json.exp, now: new Date(Date.now()).toISOString() });
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
		</form>
	);
};

export default LoginForm;
