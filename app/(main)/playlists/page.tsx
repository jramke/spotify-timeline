import { Suspense } from 'react';
import Link from 'next/link';
import { ApiService } from '@/lib/services/api';
import Section from '@/components/section';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

async function Playlists() {
    try {
        const playlists = (await ApiService.getPlaylists()).filter((playlist: any) => playlist.tracks.total > 0);
        
        return (
            <ul className="grid grid-cols-5 gap-4">
                {playlists.map((playlist) => (
                    <li key={playlist.id}>
                        <Link href={`/timeline/${playlist.id}`}>
                            {playlist?.images?.[0].url ? (
                                <Image className="rounded shadow-inner-shadow-float aspect-square" src={playlist.images[0].url} width={400} height={400} alt={playlist.name + ' Cover'} />
                            ) : null}
                        </Link>
                        <div className="font-bold tracking-tight mt-2 truncate">{playlist.name}</div>
                        <div className="text-muted-foreground text-sm truncate">{playlist.tracks.total} Track{playlist.tracks.total > 1 ? 's' : ''}</div>
                    </li>
                ))}
            </ul>
        );
    } catch (error: any) {
        return (
            <div>
                <p>Error loading playlists: {error.message}</p>
            </div>
        );
    }
}

function PlaylistsSkeleton() {
    return (
        <div className="grid grid-cols-5 gap-4" aria-label='Loading Playlists'>
            {Array.from({ length: 15 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square" />
            ))}
        </div>
    );
}

export default async function Page() {
	await ApiService.validateUser();

	return (
		<Section>
			<div className="container mx-auto">
                <Suspense fallback={<PlaylistsSkeleton />}>
                    <Playlists />
                </Suspense>
			</div>
        </Section>
	);
}
