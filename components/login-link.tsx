"use client";

import { useState } from "react";
import LoadingLink from "./loading-link";
import { Button } from "./ui/button";

export default function LoginLink() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Button asChild>
            <LoadingLink href="/login/spotify" className={isLoading ? "opacity-40" : ""} onClick={() => setIsLoading(true)} isLoading={isLoading}>
                Login with Spotify
            </LoadingLink>
        </Button>
    );
}