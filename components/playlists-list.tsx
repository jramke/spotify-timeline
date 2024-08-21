"use client";

import { useRef } from "react";
import { Mousefollower } from "@/components/mousefollower";
import Link from "next/link";
import Image from "next/image";

export default function PlaylistsList({ playlists }: { playlists: Playlist[] }) {
    // const cursorContainer = useRef(null);
    return (
        <>
            {/* <Mousefollower stiffness={350} deltaValue={0.05} container={cursorContainer} /> */}
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {playlists.map((playlist) => {
                    return (
                        <li key={playlist.id}>
                            <Link href={`/timeline/${playlist.id}`} className="relative scale-[1.001] block spring-bounce-40 spring-duration-300 hover:scale-[1.02] focus-visible:scale-[1.02]">
                                {playlist?.images?.[0].url ? (
                                    <Image className="rounded shadow-inner-shadow-float aspect-square" src={playlist.images[0].url} width={400} height={400} alt={playlist.name + ' Cover'} />
                                ) : null}
                                {/* <div className="absolute inset-0 grid place-items-center">
                                    <div className="rounded-full size-10"></div>
                                </div> */}
                            </Link>
                            <div className="font-bold tracking-tight mt-2 truncate">{playlist.name}</div>
                            <div className="text-muted-foreground text-sm truncate">{playlist.tracks.total} Track{playlist.tracks.total > 1 ? 's' : ''}</div>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}