import LoginLink from '@/components/login-link';
import Section from '@/components/section';
import Spotify from '@/components/spotify-logo';
import { Button } from '@/components/ui/button';
import { validateRequest } from '@/lib/auth';
import Link from 'next/link'

export default async function Home() {
	const { user } = await validateRequest();
	
	return (
		<>
			<Section>
				<div className="container max-w-[65ch]">
					<h1 className="text-6xl font-bold tracking-tight mb-6 text-balance leading-[1.1]">
						Beautiful Timelines of your 
						<span aria-hidden="true">
							<Spotify className="inline-block size-14 mx-2 -translate-y-1" />
						</span> 
						Spotify Playlists
					</h1>
					<p className="text-lg text-muted-foreground text-balance mb-6">Ever wondered wich years the songs in your playlist are from? I did, thats why i made this little site.</p>
					{user ? (
						<Button asChild>
							<Link href="/playlists">
								Select a Playlist
							</Link>
						</Button>
					) : (
						<LoginLink />
					)}
				</div>
			</Section>
		</>
	);
}
