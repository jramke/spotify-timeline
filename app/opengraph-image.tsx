import Spotify from '@/components/spotify-logo';
import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const alt = 'Beautiful Timelines of your Spotify Playlists';
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = 'image/png';

// const getPlusJakartaSans = async () => {
// 	const response = await fetch(
// 		new URL('./plus-jakarta-sans-600.ttf', import.meta.url)
// 	);
// 	const plusJakartaSans = await response.arrayBuffer();

// 	return plusJakartaSans;
// };

export default async function Image() {
	// const plusJakartaSans = fetch(
	// 	new URL('./plus-jakarta-sans-600.ttf', import.meta.url)
	// ).then((res) => res.arrayBuffer());

	// const plusJakartaSans = fetch(
	//     // new URL('./node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2', import.meta.url)
	//     require.resolve('@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2')
	// ).then((res) => res.arrayBuffer());

	const plusJakartaSansPath = path.resolve(
		'./public/plus-jakarta-sans-latin-600-normal.ttf'
	);
	const plusJakartaSans = fs.readFileSync(plusJakartaSansPath);

	// const plusJakartaSans = await fetch(
	// 	'/plus-jakarta-sans-latin-600-normal.ttf'
	// ).then((res) => res.arrayBuffer());

	// const plusJakartaSans = fetch(
	//     new URL('/app/plus-jakarta-sans-600.ttf', import.meta.url)
	// ).then((res) => res.arrayBuffer());

	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 92,
					background: 'hsl(0 0% 7%)',
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'flex-end',
					color: 'white',
					fontWeight: 'bold',
					letterSpacing: '-0.05em',
					lineHeight: '1.1',
					padding: 60,
				}}
			>
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: 20,
						width: '95%',
					}}
				>
					<span>Beautiful</span>
					<span>Timelines</span>
					<span>of</span>
					<span>your</span>
					<span
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 15,
						}}
					>
						<Spotify style={{ width: 94, height: 94 }} />
						Spotify
					</span>
					<span>Playlists</span>
				</div>
			</div>
		),
		{
			...size,
			fonts: [
				{
					name: 'Plus Jakarta Sans',
					data: plusJakartaSans,
					style: 'normal',
					weight: 600,
				},
			],
		}
	);
}
