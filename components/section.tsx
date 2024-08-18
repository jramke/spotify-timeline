import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";

export default function Section({ children, className, ...rest }: { children: ReactNode, className?: string } & ComponentProps<'section'>) {
    return (
        <section className={cn("py-16", className)} {...rest}>
            {children}
        </section>
    );
}