type TimelineContextType = {
    trackGroups: TrackGroup[];
    currentTrackGroup: TrackGroupView;
    cursorContainer: React.RefObject<HTMLDivElement>;
    prevTrackGroup: TrackGroup | null;
    nextTrackGroup: TrackGroup | null;
    setGroupOpen: (group: TrackGroup) => void;
    toggleGroupOpen: () => void;
    setGroup: (group: TrackGroup | null, open?: boolean) => void;
};

type TrackGroupView = {
    group: TrackGroup | null;
    open: boolean;
};