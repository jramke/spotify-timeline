'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, debounce } from "@/lib/utils";
import TrackView from './trackview';
import { Mousefollower, useMouseStickElement, useMouseStickContext } from '@/components/mousefollower';

export default function Timeline({ data }: { data: TrackGroup[] }) {
    const [currentTrackGroup, setCurrentTrackGroup] = useState<TrackGroupView>({ group: null, open: false });
    const cursorContainer = useRef(null);
    const { hideMouseFollower } = useMouseStickContext();

    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric',
    });

    const setGroup = (group: TrackGroup | null, open: boolean = false) => {
        setCurrentTrackGroup({ group, open });
    };

    const debouncedSetGroup = useMemo(
        () => debounce((item: TrackGroup) => {
            if (currentTrackGroup.open) return;
            setGroup(item);
        }, 30),
        [currentTrackGroup.open]
    );

    const openGroup = (group: TrackGroup) => {
        setGroup(group, true);
        hideMouseFollower();
    };

    const toggleGroup = () => {
        setCurrentTrackGroup(prev => ({ ...prev, open: !prev.open }));
    };

    const handleMouseEnter = useCallback((item: TrackGroup) => {
        debouncedSetGroup(item);
    }, [debouncedSetGroup]);
    
    return (
        <>
            <Mousefollower container={cursorContainer} />
            <div className="mx-auto flex gap-4 items-end justify-center mb-20" ref={cursorContainer}>
                <ScrollArea className="scroll-area-horizontal" mouseScroll={true}>
                    <div
                        className={cn(
                            "flex items-end pb-6 h-[400px] transition-all duration-500",
                            currentTrackGroup.open ? 'blur-lg' : ''
                        )}
                        // onMouseLeave={() => !currentTrackGroup.open && unsetGroup()}
                    >
                        {data.map((item, index) => {
                            const childRef = useRef<HTMLDivElement>(null);
                            const ref = useMouseStickElement<HTMLButtonElement>({ 
                                label: item.tracks.length + ' Track' + (item.tracks.length === 1 ? '' : 's'), 
                                sublabel: formatter.format(new Date(item.date)),
                                childRef,
                            });

                            return (
                                <button
                                    key={index}
                                    className={cn("relative w-[9px] flex-shrink-0 flex-grow-0 h-full rounded outline-none", item.value === 0 && 'cursor-default')}
                                    onMouseEnter={() => handleMouseEnter(item)}
                                    onFocus={() => handleMouseEnter(item)}
                                    onClick={() => openGroup(item)}
                                    tabIndex={item.value === 0 ? -1 : 0}
                                    disabled={item.value === 0}
                                    ref={ref}
                                >
                                    <span className="sr-only">
                                        {formatter.format(new Date(item.date))}, {item.value} Track{item.value === 1 ? '' : 's'}
                                    </span>
                                    <div aria-hidden="true" className="absolute size-full inset-0 flex flex-col items-center justify-end">
                                        <div className="absolute rounded h-[calc(100%+0px)] top-1/2 -translate-y-1/2 left-0 right-0 w-[5px] mx-auto" ref={childRef}></div>
                                        {item.value === 0 ? (
                                            <div className="bg-muted-foreground/50 rounded w-[2px] h-4"></div>
                                        ) : (
                                            <>
                                                <div
                                                    className="bg-foreground rounded w-[4px] rounded-b-none"
                                                    style={{ height: `${item.percentage}%` }}
                                                ></div>
                                                <div className="bg-foreground rounded w-[4px] h-4 rounded-t-none"></div>
                                            </>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
            {/* TODO: throttle the rerendering of this component cause it lags with a lot of images */}
            <TrackView currentTrackGroup={currentTrackGroup} toggleGroup={toggleGroup} />
        </>
    );
}