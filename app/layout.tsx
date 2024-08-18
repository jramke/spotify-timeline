import type { Metadata } from "next";
import Head from "next/head";
import "./globals.css";

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
		<html lang="en">
			<Head>
				<script defer src="https://umami.joostramke.com/script.js" data-website-id="da13d2ca-d7d3-43fa-be0c-42e26e4869a6"></script>
			</Head>
			<body className="dark">
				<div className="flex flex-col min-h-screen">
					{children}
				</div>
			</body>
		</html>
	);
}
