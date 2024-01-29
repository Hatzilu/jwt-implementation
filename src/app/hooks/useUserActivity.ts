import { useEffect, useRef, useState } from 'react';

const useUserActivity = () => {
	const [secondsSinceLastActive, setSecondsSinceLastActive] = useState(0);
	const isUserActive = secondsSinceLastActive < 40;
	const timer = useRef<NodeJS.Timeout | null>(null);

	const addSecond = () => setSecondsSinceLastActive((s) => s + 1);

	const reset = () => {
		setSecondsSinceLastActive(0);
		if (timer.current) {
			clearTimeout(timer.current);
		}
		timer.current = setTimeout(addSecond, 1000);
	};

	console.log(secondsSinceLastActive);

	useEffect(() => {
		timer.current = setTimeout(addSecond, 1000);

		return () => {
			if (timer.current) {
				clearTimeout(timer.current);
			}
		};
	}, [secondsSinceLastActive]);

	useEffect(() => {
		console.log('effect');

		// if (isUserActive) return;
		timer.current = setTimeout(addSecond, 1000);
		console.log('add listener - mousemove');

		window.addEventListener('mousemove', reset);
		window.addEventListener('keydown', reset);

		return () => {
			console.log('remove listener - mousemove');
			window.removeEventListener('mousemove', () => 'removed mousemove listener');
			window.removeEventListener('keydown', () => 'removed keydown listener');
			if (timer.current) {
				clearTimeout(timer.current);
			}
		};
	}, []);

	return {
		isUserActive,
		secondsSinceLastActive,
		timer: timer.current,
	};
};

export default useUserActivity;
