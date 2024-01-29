import Cookies from 'js-cookie';

const getExpirationDate = (minutes: number) => new Date(Date.now() + minutes * 60000); // 1 minute = 60,000 milliseconds

export const updateTokenCookie = (tokenName: string, token: string, expInMinutes: number) => {
	const exp = new Date(getExpirationDate(expInMinutes));
	if (Cookies.get(tokenName)) {
		Cookies.remove(tokenName);
	}
	Cookies.set(tokenName, token, { expires: exp, path: '/' });
};
