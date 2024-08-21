"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TextLink } from "./ui/text-link";

function NavLink({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
    const currentPath = usePathname();
    return (
        <TextLink href={href} className={cn("no-underline", currentPath === href && "text-foreground", className)}>
            {children}
        </TextLink>
    );
}

export default function Navigation() {
    return (
        <nav className="container py-8 text-sm text-muted-foreground">
            <div className="flex items-center justify-end">
                <div className="flex items-center gap-4">
                    <NavLink href="/">
                        Home
                    </NavLink>
                    <NavLink href="/playlists">
                        Playlists
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}