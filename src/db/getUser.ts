export const getUser = async (email: string) => {
	return new Promise((res, reject) => {
		setTimeout(() => res({ email, id: 1 }), 250);
	});
};
