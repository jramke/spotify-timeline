import { ApiService } from '@/lib/services/api';
import { Timeline, TimelineSkeleton } from '@/components/timeline';
import Image from 'next/image';
import { MouseStickProvider } from '@/components/mousefollower';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';

async function PlaylistInfo({ id }: { id: string }) {
	const playlists = await ApiService.getPlaylists();
	const playlist = playlists.find((playlist) => playlist.id === id);
	const thumbnailUrl = playlist?.images?.[0].url ?? null;

	return (
		<div className="relative flex items-center gap-4 justify-center mb-24">
			<Button asChild size="icon" variant="ghost" className="absolute top-1/2 -translate-y-1/2 left-0">
				<Link href="/playlists">
					<ChevronLeft aria-hidden="true" className="size-5" />
					<span className="sr-only">Back to Playlists</span>
				</Link>
			</Button>
			{playlist ? (
				<>
					{thumbnailUrl ? (
						<div className="relative size-16">
							<Image
								src={thumbnailUrl}
								alt={playlist.name + ' Cover'}
								className="absolute inset-0 size-full rounded shadow-inner-shadow-float"
								width={200}
								height={200}
							/>
						</div>
					) : null}
					<div>
						<h1 className="text-3xl tracking-tight font-bold">
							{playlist.name}
						</h1>
						<p className="text-muted-foreground text-sm truncate">{playlist.tracks.total} Track{playlist.tracks.total > 1 ? 's' : ''}</p>
					</div>
				</>
			) : null}
		</div>
	);
}

async function PlaylistTimeline({ id }: { id: string }) {
	const tracks = await ApiService.getTimelineTracksFromPlaylist(id);
	if (tracks.length === 0) return null;

	return (
		<MouseStickProvider>
			<Timeline data={tracks} />
		</MouseStickProvider>
	);
}

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	await ApiService.validateUser();

	return (
		<div className="container px-6 py-20">
			<Suspense fallback={null}>
				<PlaylistInfo id={id} />
			</Suspense>
			<Suspense fallback={<TimelineSkeleton />}>
				<PlaylistTimeline id={id} />
			</Suspense>
		</div>
	);
}
