import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/lib/analytics";

export const metadata: Metadata = {
	title: "Spotify Timelines",
	description: "Beautiful timelines of your Spotify playlists.",
	metadataBase: new URL("https://spotify.joostramke.com"),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<>
			<Analytics />
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
