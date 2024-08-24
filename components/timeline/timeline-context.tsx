'use client';

import { createContext, useContext, useState, useRef, useEffect } from 'react';

import type { ReactNode } from 'react';
import { useMouseStickContext } from '@/components/mousefollower';

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const TimelineProvider: React.FC<{ children: ReactNode, trackGroups: TrackGroup[] }> = ({ children, trackGroups }) => {
	const [currentTrackGroup, setCurrentTrackGroup] = useState<TrackGroupView>({ group: null, open: false });
	const [prevTrackGroup, setPrevTrackGroup] = useState<TrackGroup | null>(null);
	const [nextTrackGroup, setNextTrackGroup] = useState<TrackGroup | null>(null);

	const cursorContainer = useRef(null);
    const { hideMouseFollower } = useMouseStickContext();

	const findNextTrackGroup = (index: number) => {
		let foundIndex = index;
		let nextIndex = foundIndex;
		console.log('nextIndex', nextIndex, trackGroups);
		
		if (nextIndex + 1 >= trackGroups.length) return null;

		while (nextIndex < trackGroups.length - 1) {
			nextIndex++;
			if (trackGroups[nextIndex]?.value !== 0) {
				foundIndex = nextIndex;
				break;
			}
		}

		return trackGroups[nextIndex];
	};

	const findPrevTrackGroup = (index: number) => {
		let foundIndex = index;
		let prevIndex = foundIndex;
		if (prevIndex <= 0) return null;

		while (prevIndex > 0) {
			prevIndex--;
			if (trackGroups[prevIndex]?.value !== 0) {
				foundIndex = prevIndex;
				break;
			}
		}

		return trackGroups[prevIndex];
	};

	const setGroup = (group: TrackGroup | null, open: boolean = false) => {
        setCurrentTrackGroup({ group, open });

		const index = trackGroups.findIndex(item => item === group);

		// TODO: still buggy on start and end
		const nextGroup = findNextTrackGroup(index);
		const prevGroup = findPrevTrackGroup(index);

		setNextTrackGroup(nextGroup);
		setPrevTrackGroup(prevGroup);
    };

	const setGroupOpen = (group: TrackGroup) => {
        setGroup(group, true);
        hideMouseFollower();
    };

	const toggleGroupOpen = () => {
        setCurrentTrackGroup(prev => ({ ...prev, open: !prev.open }));
    };

	return (
		<TimelineContext.Provider value={{ trackGroups, currentTrackGroup, prevTrackGroup, nextTrackGroup, cursorContainer, setGroupOpen, toggleGroupOpen, setGroup }}>
			{children}
		</TimelineContext.Provider>
	);
};

export const useTimelineContext = () => {
	const context = useContext(TimelineContext);
	if (context === undefined) {
		throw new Error('useTimelineContext must be used within a TimelineContext');
	}
	return context;
};
