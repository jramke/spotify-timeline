import type { Metadata } from "next";
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
			<body className="dark">
				<div className="flex flex-col min-h-screen">
					{children}
				</div>
			</body>
		</html>
	);
}
