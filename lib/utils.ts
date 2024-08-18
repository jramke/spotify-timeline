import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getMonthDifference(laterDate: Date, earlierDate: Date): number {
	return (
		(laterDate.getFullYear() - earlierDate.getFullYear()) * 12 +
		(laterDate.getMonth() - earlierDate.getMonth())
	);
}

type DebouncedFunction<T extends (...args: any[]) => any> = {
	(...args: Parameters<T>): void;
	cancel: () => void;
};
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): DebouncedFunction<T> {
	let timeout: NodeJS.Timeout | null = null;

	const debouncedFunc: DebouncedFunction<T> = function (
		this: any,
		...args: Parameters<T>
	) {
		const context = this;

		const later = function () {
			timeout = null;
			func.apply(context, args);
		};

		if (timeout !== null) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(later, wait);
	};

	debouncedFunc.cancel = function () {
		if (timeout !== null) {
			clearTimeout(timeout);
		}
	};

	return debouncedFunc;
}
