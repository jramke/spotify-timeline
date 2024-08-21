import { cn } from "@/lib/utils";
import Link from "next/link";
import { ComponentProps, ReactNode } from "react";

type TextLinkProps = {
    href: string;
    children: ReactNode;
    className?: string;
} & ComponentProps<'a'>;

export const textLinkClass = "text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground";

export function TextLink({ href, children, className, ...props }: TextLinkProps) {
    return (
        <Link href={href} className={cn(textLinkClass, className)} {...props}>
            {children}
        </Link>
    );
}