import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
	title: "Spotify Timelines",
	description: "Beautiful timelines of your Spotify playlists.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<>
			<Script src="https://umami.joostramke.com/script.js" data-website-id="da13d2ca-d7d3-43fa-be0c-42e26e4869a6" strategy="lazyOnload" />
			<html lang="en">
				<body className="dark">
					<div className="flex flex-col min-h-screen">
						{children}
					</div>
				</body>
			</html>
		</>
	);
}
