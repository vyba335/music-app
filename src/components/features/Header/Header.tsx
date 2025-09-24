"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import musicAppIconGreen from "@/lib/img/musicappicongreen.png";
import "@/styles/base.css";
import SearchComponent from "./SearchComponent";
import { ModernSearch } from "../ModernSearch";
import type { SearchResult } from "@/lib/types";

const Header = () => {
    const router = useRouter();

    const handleSearchSelect = (result: SearchResult) => {
        console.log("Search result selected:", result);

        const artistSlug = result.artist.name
            .toLowerCase()
            .replace(/\s+/g, "-");

        switch (result.type) {
            case "artist":
                router.push(`/artist/${artistSlug}`);
                break;
            case "song":
                router.push(
                    `/artist/${artistSlug}?album=${result.artist.albums.indexOf(
                        result.album
                    )}`
                );
                break;
            case "album":
                router.push(
                    `/artist/${artistSlug}?album=${result.artist.albums.indexOf(
                        result.album
                    )}`
                );
                break;
            case "lyrics":
                router.push(
                    `/artist/${artistSlug}?album=${result.artist.albums.indexOf(
                        result.album
                    )}`
                );
                break;
            default:
                console.log("Unkown result type");
        }
    };

    return (
        <header className="custom-header">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-center gap-8">
                    <div className="flex-none">
                        <a
                            className="block text-teal-600 dark:text-teal-300"
                            href="/"
                            title="Go to homepage"
                        >
                            <span className="sr-only">Home</span>
                            <Image
                                src={musicAppIconGreen}
                                alt="Music App"
                                width={50}
                                height={50}
                                className="logo"
                            />
                        </a>
                    </div>
                    <ModernSearch />
                </div>
            </div>
        </header>
    );
};

export default Header;
