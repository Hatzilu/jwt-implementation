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
		watch,
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
			console.log({ json });
		},
		onSuccess: () => console.log('Login Success!'),
		onError: (err) => console.error('failed to login', err),
	});

	const onSubmit = (data: FormValues) => {
		console.log(data);
		login(data);
	};

	return (
		<form onSubmit={handleSubmit((data) => onSubmit(data))} className="flex flex-col gap-1 text-blue-950">
			<input {...register('email')} placeholder="Email" />
			<input {...register('password')} type="password" placeholder="password" />
			<input type="submit" />
		</form>
	);
};

export default LoginForm;
