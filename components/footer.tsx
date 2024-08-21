import Link from "next/link";
import Github from "@/components/github-logo";
import { TextLink } from "@/components/ui/text-link";

export default function Footer() {
    return (
        <footer className="py-8 text-muted-foreground text-sm border-t">
            <div className="container flex items-center justify-between gap-4">
                <p>
                    Made by <TextLink href="https://joostramke.com" target='_blank'>Joost</TextLink>
                </p>
                <Link href="https://github.com/jramke/spotify-timeline" target='_blank' className="opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100">
                    <Github aria-hidden="true" className="size-6" />
                    <span className="sr-only">View on Github</span>
                </Link>
            </div>
        </footer>
    )
}