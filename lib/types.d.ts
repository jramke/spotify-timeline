type Track = {
    release_date: string;
	id: string;
	name: string;
	artists: any[];
	image: {
		url: string;
	} | null;
};

type TrackGroup = {
	date: Date;
	value: number;
	tracks: Track[];
	percentage?: number;
};

type GroupedTracks = {
	[key: string]: Track[] | undefined;
};

type TrackGroupView = {
    group: TrackGroup | null;
    open: boolean;
};

type Playlist = {
	id: string;
	name: string;
	images: {
		url: string;
	}[] | null;
	tracks: { total: number };
};