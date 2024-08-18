import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { SelectUser, user_token } from "@/lib/db/schema";
import { updateAccessToken } from '@/lib/db/queries';
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { unstable_cache } from 'next/cache'
import { getMonthDifference } from '@/lib/utils';

class CreateApiService {
    public async validateUser() {
        const { user } = await validateRequest();
        if (!user) {
            return redirect("/login/spotify");
        }
        return user;
    }

    public async getPlaylists({ useCache = true } = {}) {
        console.log('Playlist API called at:', new Date().toISOString());

        const user = await this.validateUser();

        const url = 'https://api.spotify.com/v1/me/playlists';
        
        try {
            const tokens = await this.validateToken(user, { useCache });

            let playlists: Playlist[] = [];
            let nextUrl: string | null = url;

            while (nextUrl) {
                const response: Response = await fetch(nextUrl, {
                    cache: 'force-cache',
                    headers: {
                        'Authorization': `Bearer ${tokens.accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch playlists: ${response.statusText}`);
                }

                const result = await response.json();

                playlists = [...playlists, ...result.items];
                nextUrl = result.next;
            }

            return playlists;
            
        } catch (error) {
            console.error('Error fetching playlists:', error);
            throw error;
        }
    }

    public async getTimelineTracksFromPlaylist(playlist_id: string, { useCache = true } = {}) {
        console.log(`Fetching tracks for playlist ${playlist_id} at:`, new Date().toISOString());

        const user = await this.validateUser();
        const url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;

        try {
            const tokens = await this.validateToken(user, { useCache });

            let tracks: Track[] = [];
            let nextUrl: string | null = url;

            while (nextUrl) {
                const response: Response = await fetch(nextUrl, {
                    cache: 'force-cache',
                    headers: {
                        'Authorization': `Bearer ${tokens.accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch tracks: ${response.statusText}`);
                }

                const result = await response.json();

                tracks = [...tracks, ...this.getTracksFromApi(result)];
                nextUrl = result.next;
            }

            const formattedTracks = this.formatTracks(tracks);
            return formattedTracks;

        } catch (error) {
            console.error(`Error fetching tracks for playlist ${playlist_id}:`, error);
            throw error;
        }
    }

    private getTracksFromApi(result: any) {
        let tracks: Track[] = result.items.map((t: any) => {
            const item: Track = {
                release_date: t.track.album.release_date,
                id: t.track.id,
                name: t.track.name,
                artists: t.track.artists.map((a: any) => a.name),
                image: t.track.album.images[0] ?? null,
            };
            return item;
        });
        tracks = tracks.filter((t: Track) => t.release_date);
        return tracks;
    }

    private formatTracks(tracks: Track[]) {
        let data: TrackGroup[] = [];
        const formatter = new Intl.DateTimeFormat('en-US', { month: '2-digit', year: 'numeric' });

        try {
            const groupedTracks: GroupedTracks = Object.groupBy(tracks, (t) => {
                let date = new Date(t.release_date);
                let formattedDate = formatter.format(date);
                formattedDate = formattedDate.split('/').reverse().join('-');
                return formattedDate;
            });

            let responseData: TrackGroup[] = Object.entries(groupedTracks).map(([key, value]) => ({
                date: new Date(key),
                value: value?.length ?? 0,
                tracks: value ?? [],
            }));

            responseData = responseData.sort((a, b) => a.date.getTime() - b.date.getTime());

            // fill missing months between months with tracks
            responseData.forEach((d, i) => {
                data.push(d);
        
                const currDate = new Date(d.date);
                const nextDate = new Date(responseData[i + 1]?.date);
        
                if (nextDate) {
                    const diff = getMonthDifference(nextDate, currDate);
                    if (diff > 1) {
                        for (let i = 1; i < diff; i++) {
                            const newDate = new Date(currDate);
                            newDate.setMonth(currDate.getMonth() + i);
                            data.push({
                                date: newDate,
                                value: 0,
                                tracks: [],
                            });
                        }
                    }
                }
            });

            // add missind dates until today
            const lastDate = new Date(data[data.length - 1].date);
            const today = new Date();
            const diff = getMonthDifference(today, lastDate);
        
            for (let i = 1; i <= diff; i++) {
                const newDate = new Date(lastDate);
                newDate.setMonth(lastDate.getMonth() + i);
                data.push({
                    date: newDate,
                    value: 0,
                    tracks: [],
                });
            }

            const max = Math.max(...data.map((d) => d.value));
            const min = 0;
        
            for (let i = 0; i < data.length; i++) {
                data[i].percentage = ((data[i].value - min) / (max - min)) * 100;
            }

        } catch (error) {
            console.error('Error formatting tracks:', error);
            data = [];
        }

        return data;
    }

    private async validateToken(user: SelectUser, { useCache = true } = {}) {
        let tokens = useCache
            ? await this.getCachedTokens(user.id)
            : await this.getToken(user.id);

        if (!tokens) {
            throw new Error("No tokens found for the user");
        }

        if (tokens.expiresAt < new Date().getTime()) {
            tokens = await updateAccessToken(user, tokens.refreshToken);
        }

        return tokens;
    }

    private getCachedTokens = unstable_cache(async (userId: string) => {
        return this.getToken(userId);
    });

    private getToken(userId: string) {
        return db.query.user_token.findFirst({
            where: eq(user_token.userId, userId)
        });
    } 
}

export const ApiService = new CreateApiService();
