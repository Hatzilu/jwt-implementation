'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// This is really stupid to do, you should always refetch when your data is stale.
			// But i'm doing this specifically to try and implement my own logic for handling
			// The case where the auth session has expired and we need to re-authenticate
			// the user
			staleTime: Infinity,
		},
	},
});
export const ProviderWrapper = ({ children }: { children: ReactNode }) => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
