import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, memo } from 'react';
import { X } from "lucide-react"
import { Button } from '@/components/ui/button';

type TrackViewProps = {
	currentTrackGroup: TrackGroupView;
	toggleGroup: () => void;
};

const formatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	year: 'numeric',
});

function TrackViewGrid({
	currentTrackGroup,
    toggleGroup,
}: {
	currentTrackGroup: TrackGroupView;
    toggleGroup: () => void;
}) {
	if (!currentTrackGroup.group) return null;
	return (
		<div className="relative h-full">
			<Button onClick={toggleGroup} size="icon" variant="ghost" className="absolute -right-1 -top-1 z-10">
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
            <div className="pt-16 h-full -ml-3 -mr-3">
                <ScrollArea className="scroll-area-vertical h-full px-3">
                    <div className="grid gap-4 grid-cols-5">
                        {currentTrackGroup.group!.tracks.map((track, index) => {
                            if (!track.image?.url) return null;

                            return (
                                <div>
                                    <motion.div
                                        layoutId={`trackview-cover-wrapper-${index}`}
                                        key={index}
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
            </div>
		</div>
	);
}

const TrackViewTeaser = memo(({
	currentTrackGroup,
}: {
	currentTrackGroup: TrackGroupView;
}) => {
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
							{/* {index < 4 ? (
								<Image
									src={track.image.url}
									alt={`${track.name} Cover`}
									className={cn('size-full rounded')}
									width={100}
									height={100}
								/>
							) : (
								<Image
									src={track.image.url}
									alt={`${track.name} Cover`}
									className={cn('size-full rounded')}
									width={10}
									height={10}
								/>
							)} */}
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

export default function TrackView({
	currentTrackGroup,
	toggleGroup,
}: TrackViewProps) {
	if (!currentTrackGroup.group) return null;

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				toggleGroup();
			}
		}

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	return (
		<div className="fixed inset-4 pointer-events-none flex items-end justify-center">
			<motion.div
				layout
				style={{ borderRadius: 12 }}
				onClick={() => !currentTrackGroup.open && toggleGroup()}
				whileTap={{ scale: currentTrackGroup.open ? 1 : 0.98 }}
				className={cn(
					'inline-block rounded-card pointer-events-auto shadow-inner-shadow-float bg-card p-4 mx-auto',
					currentTrackGroup.open ? 'size-full' : ''
				)}
			>
				<AnimatePresence>
					{currentTrackGroup.open ? (
						<TrackViewGrid toggleGroup={toggleGroup} currentTrackGroup={currentTrackGroup} />
					) : (
						<TrackViewTeaser currentTrackGroup={currentTrackGroup} />
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
