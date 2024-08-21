import { MouseStickProvider } from "@/components/mousefollower";
import Timeline from "./timeline";
import { TimelineProvider } from "./timeline-context";

export default function TimelineWrapper({ data }: { data: TrackGroup[] }) {
    return (
        <MouseStickProvider>
            <TimelineProvider trackGroups={data}>
                <Timeline />
            </TimelineProvider>
        </MouseStickProvider>
    );
};