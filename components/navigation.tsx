"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
    const currentPath = usePathname();
    return (
        <Link href={href} className={cn("transition-colors hover:text-foreground focus-visible:text-foreground", currentPath === href && "text-foreground", className)}>
            {children}
        </Link>
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