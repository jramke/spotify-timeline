import { Suspense } from 'react';
import { ApiService } from '@/lib/services/api';
import Section from '@/components/section';
import { Skeleton } from '@/components/ui/skeleton';
import { MouseStickProvider } from '@/components/mousefollower';
import PlaylistsList from '@/components/playlists-list';

async function Playlists() {
    try {
        const playlists = (await ApiService.getPlaylists()).filter((playlist: any) => playlist.tracks.total > 0);
        
        return (
                <PlaylistsList playlists={playlists} />
            // <MouseStickProvider>
            // </MouseStickProvider>
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
