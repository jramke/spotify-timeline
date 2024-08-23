// inspired by https://github.com/SaschaLucius/svelte-umami

'use client';

import Script from 'next/script';

interface EventData {
	[key: string]:
		| number
		| string
		| EventData
		| number[]
		| string[]
		| EventData[];
}

type UmamiTracker = {
	track: {
		/**
		 * Track an event with a given name
		 *
		 * NOTE: event names will be truncated past 50 characters
		 *
		 * @example ```
		 * umami.track('signup-button');
		 * ```
		 */
		(eventName: string): Promise<string>;

		/**
		 * Tracks an event with dynamic data.
		 *
		 * NOTE: event names will be truncated past 50 characters
		 *
		 * When tracking events, the default properties are included in the payload. This is equivalent to running:
		 *
		 * ```js
		 * umami.track(props => ({
		 *   ...props,
		 *   name: 'signup-button',
		 *   data: {
		 *     name: 'newsletter',
		 *     id: 123
		 *   }
		 * }));
		 * ```
		 *
		 * @example ```
		 * umami.track('signup-button', { name: 'newsletter', id: 123 });
		 * ```
		 */
		(eventName: string, obj: EventData): Promise<string>;
	};
};

interface WindowWithUmami extends Window {
	umami: UmamiTracker | undefined;
}

declare let window: WindowWithUmami;

let umamiState: 'ready' | 'error' | undefined = undefined;

const waitForUmami = async (): Promise<UmamiTracker> => {
	let count = 50; // try max 5 seconds
	while (!window.umami) {
		if (['error', undefined].includes(umamiState) || count <= 0) {
			return { track: () => Promise.resolve('Umami not found.') };
		}
		await new Promise((resolve) => setTimeout(resolve, 100));
		count--;
	}
	return window.umami;
};

export const trackEvent = async (
	eventName: string,
	eventData?: EventData
): Promise<string> => {
	if (['error', undefined].includes(umamiState))
		return Promise.resolve('Umami not found.');

	const umami = await waitForUmami();
	if (eventData) {
		return umami.track(eventName, eventData);
	} else {
		return umami.track(eventName);
	}
};

export function Analytics({
	srcUrl,
	websiteId,
	hideInDev = true,
}: {
	srcUrl?: string;
	websiteId?: string;
	hideInDev?: boolean;
}) {
	const src = srcUrl || process.env.NEXT_PUBLIC_UMAMI_URL;
	const id = websiteId || process.env.NEXT_PUBLIC_UMAMI_ID;

	if (!src || !id) {
		throw new Error(
			'Umami Analytics: Please provide a srcUrl and websiteId'
		);
	}

	if (process.env.NODE_ENV === 'development' && hideInDev) {
		return null;
	}

	return (
		<Script
			src={src}
			data-website-id={id}
			strategy="lazyOnload"
			onReady={() => {
				umamiState = 'ready';
			}}
			onError={() => {
				umamiState = 'error';
			}}
		/>
	);
}
