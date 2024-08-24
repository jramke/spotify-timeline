import { cn } from '@/lib/utils';
import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useEffect, memo } from 'react';
import { X } from "lucide-react"
import { Button } from '@/components/ui/button';
import { textLinkClass } from '@/components/ui/text-link';
import { useTimelineContext } from './timeline-context';

const formatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	year: 'numeric',
});

function TrackViewGrid() {
	const { currentTrackGroup, toggleGroupOpen } = useTimelineContext();
	
	if (!currentTrackGroup.group) return null;

	return (
		<div className="relative h-full">
			<Button onClick={toggleGroupOpen} size="icon" variant="ghost" className="absolute -right-1 -top-1 z-10">
                <X aria-hidden="true" className="size-5 text-muted-foreground" />
				<span className="sr-only">Close track overview</span>
			</Button>
			<div className="absolute top-0 inline-block z-10">
				<motion.h2
					layoutId="trackview-title"
					className="text-lg font-bold tracking-tight leading-none"
				>
					{formatter.format(new Date(currentTrackGroup.group.date))}
				</motion.h2>
				<motion.span
					layoutId="trackview-subtitle"
					className="text-muted-foreground text-sm"
				>
					{currentTrackGroup.group.value} Track
					{currentTrackGroup.group.value === 1 ? '' : 's'}
				</motion.span>
			</div>
            <div className="pt-16 h-full -ml-3 -mr-3 relative">
                <ScrollArea className="scroll-area-vertical h-full px-3">
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 pb-20">
                        {currentTrackGroup.group!.tracks.map((track, index) => {
                            if (!track.image?.url) return null;

                            return (
                                <div key={index}>
                                    <motion.div
                                        layoutId={`trackview-cover-wrapper-${index}`}
                                        className="relative grid place-items-center rounded shadow-inner-shadow-float"
                                    >
                                        <Image
                                            src={track.image.url}
                                            alt={`${track.name} Cover`}
                                            className="rounded"
                                            width={400}
                                            height={400}
                                        />
                                    </motion.div>
                                    <div className="font-bold tracking-tight mt-2 truncate">{track.name}</div>
                                    <div className="text-muted-foreground text-sm truncate">{track.artists.map(artist => artist).join(', ')}</div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
				<PrevNextButton />
            </div>
		</div>
	);
};

function PrevNextButton() {
	const { setGroup, nextTrackGroup, prevTrackGroup } = useTimelineContext();

	const xBase = 50;
	const x = useSpring(xBase, { stiffness: 500, damping: 30 });
	const rotateY = useTransform(x, [0, 100], [-30, 30]);

	const handleWrapperMouseDown = (event: any) => {
		if (!event.currentTarget) return;
		const rect = event.currentTarget.getBoundingClientRect();
		const offsetX = event.clientX - rect.left;
		const percentage = (offsetX / rect.width) * 100;
		const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
		x.set(clampedPercentage);
	};
	const resetRotation = () => {
		x.set(xBase);
	};

	useEffect(() => {	
		if (!prevTrackGroup || !nextTrackGroup) {
			setTimeout(() => {
				resetRotation();
			}, 100);
		}
	}, [nextTrackGroup, prevTrackGroup]);

	return (
		<div className="absolute bottom-4 left-1/2 -translate-x-1/2" style={{ perspective: 300 }}>
			<motion.div onMouseDown={handleWrapperMouseDown} onMouseUp={resetRotation} onMouseLeave={resetRotation} style={{ borderRadius: 8, rotateY }} className="bg-card shadow-inner-shadow-float p-3 flex gap-4 items-center">
				<button onKeyDown={(e) => (e.key === 'Enter' || e.code === 'Space') && x.set(10)} onKeyUp={resetRotation} onClick={() => setGroup(prevTrackGroup, true)} className={cn(textLinkClass, !prevTrackGroup && "opacity-30 pointer-events-none")} disabled={!prevTrackGroup}>
					Previous
				</button>
				<button onKeyDown={(e) => (e.key === 'Enter' || e.code === 'Space') && x.set(90)} onKeyUp={resetRotation} onClick={() => setGroup(nextTrackGroup, true)} className={cn(textLinkClass, !nextTrackGroup && "opacity-30 pointer-events-none")} disabled={!nextTrackGroup}>
					Next
				</button>
			</motion.div>
		</div>
	);
}

const TrackViewTeaser = memo(() => {
	const { currentTrackGroup } = useTimelineContext();

	if (!currentTrackGroup.group) return null;

	return (
		<div className="flex items-center gap-6">
			<div className="relative size-16">
				{currentTrackGroup.group.tracks.map((track, index) => {
					if (!track.image?.url) {
						return null;
					}

					let rotation = 0;
					if (currentTrackGroup.group!.tracks.length > 1) {
						rotation = Math.random() * Math.min(3 * currentTrackGroup.group!.tracks.length, 15) * (Math.random() > 0.5 ? -1 : 1)
					}

					return (
						<motion.div
							key={index}
							layoutId={`trackview-cover-wrapper-${index}`}
							className={cn(
								'size-full absolute grid place-items-center rounded shadow-inner-shadow-float-light'
							)}
							style={{ 
                                zIndex: currentTrackGroup.group!.tracks.length - index,
							}}
                            animate={{ rotate: rotation }}
                            initial={{ rotate: rotation }}
						>
							<Image
								src={track.image.url}
								alt={`${track.name} Cover`}
								className={cn('size-full rounded')}
								width={100}
								height={100}
							/>
						</motion.div>
					);
				})}
			</div>
			<div>
				<motion.h2
					layoutId="trackview-title"
					className="text-lg font-bold tracking-tight leading-none"
				>
					{formatter.format(new Date(currentTrackGroup.group.date))}
				</motion.h2>
				<motion.div
					layoutId="trackview-subtitle"
					className="text-muted-foreground text-sm"
				>
					{currentTrackGroup.group.value} Track
					{currentTrackGroup.group.value === 1 ? '' : 's'}
				</motion.div>
			</div>
		</div>
	);
});

export default function TrackView() {
	const { currentTrackGroup, toggleGroupOpen } = useTimelineContext();

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				toggleGroupOpen();
			}
		}

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [toggleGroupOpen]);

	if (!currentTrackGroup || !currentTrackGroup.group) return null;

	return (
		<div className="fixed inset-4 pointer-events-none flex items-end justify-center">
			<motion.div
				layout
				style={{ borderRadius: 12 }}
				onClick={() => !currentTrackGroup.open && toggleGroupOpen()}
				whileTap={{ scale: currentTrackGroup.open ? 1 : 0.98 }}
				className={cn(
					'inline-block pointer-events-auto shadow-inner-shadow-float bg-card p-4 mx-auto',
					currentTrackGroup.open ? 'size-full' : ''
				)}
			>
				<AnimatePresence>
					{currentTrackGroup.open ? (
						<TrackViewGrid />
					) : (
						<TrackViewTeaser />
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
