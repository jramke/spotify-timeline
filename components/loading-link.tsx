import { cn } from "@/lib/utils";
import Link from "next/link";
import { Loader } from 'lucide-react';
import { motion } from "framer-motion";

export default function LoadingLink({ children, href, className, isLoading, ...rest }: { children: React.ReactNode, href: string, isLoading: boolean, className?: string } & React.ComponentProps<'a'>) {
    return (
        <Link href={href} className={cn('relative overflow-hidden', isLoading && "pointer-events-none", className)} tabIndex={isLoading ? -1 : 0} aria-disabled={isLoading} {...rest}>
            {isLoading && (
                <motion.span transition={{ type: "spring", duration: 0.3, bounce: 0.4 }} initial={{ opacity: 0, y: -35 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-0 grid place-items-center">
                    <Loader aria-hidden="true" className="size-5 animate-spin" />
                    <span className="sr-only">Loading</span>
                </motion.span>
            )}
            <span className={cn("inline-block", isLoading && "translate-y-[35px] opacity-0 blur-lg transition-all invisible")}>
                {children}
            </span>
        </Link>
    );
}