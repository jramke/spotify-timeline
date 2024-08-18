'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

export default function DynamicImage({
	src,
	alt,
	blurData,
	...props
}: {
	src: string;
	alt: string;
	blurData?: { width: number; height: number; base64: string };
	[key: string]: any;
}) {
	const [localBlurData, setLocalBlurData] = useState(blurData);
	const [error, setError] = useState<string | null>(null);

	const fetchBlurData = useCallback(async () => {
		try {
			const response = await fetch(
				`/api/blur-placeholder?src=${encodeURIComponent(src)}`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch blur data');
			}
			const data = await response.json();
			setLocalBlurData(data);
		} catch (error) {
			console.error('Error fetching blur data:', error);
			setError('Failed to load image placeholder');
		}
	}, [src]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!localBlurData) {
		fetchBlurData();
		return null;
	}

	return (
		<Image
			src={src}
			alt={alt}
			width={localBlurData.width}
			height={localBlurData.height}
			placeholder="blur"
			blurDataURL={localBlurData.base64}
			{...props}
		/>
	);
}
