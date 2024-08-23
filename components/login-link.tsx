"use client";

import { useState } from "react";
import LoadingLink from "./loading-link";
import { Button } from "./ui/button";
import { trackEvent } from "@/lib/analytics";

export default function LoginLink() {
    const [isLoading, setIsLoading] = useState(false);

    const handleOnClick = () => {
        setIsLoading(true);
        trackEvent("login");
    };

    return (
        <Button asChild>
            <LoadingLink href="/login/spotify" className={isLoading ? "opacity-40" : ""} onClick={handleOnClick} isLoading={isLoading}>
                Login with Spotify
            </LoadingLink>
        </Button>
    );
}