"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import musicAppIconGreen from "@/lib/img/musicappicongreen.png";
import "@/styles/base.css";
import SearchComponent from "./SearchComponent";
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
                    <SearchComponent onSelect={handleSearchSelect} />
                    {/* <div className="flex-none md:flex md:items-center md:gap-12">
                        <div className="flex items-center gap-4">
                            <div className="sm:flex sm:gap-4">
                                <a
                                    className="rounded-md login-button bg-[#95c623] px-5 py-2.5 text-sm font-medium shadow-sm dark:hover:bg-teal-500"
                                    href="#"
                                >
                                    Login
                                </a>
                                <div className="hidden sm:flex">
                                    <a
                                        className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
                                        href="#"
                                    >
                                        Register
                                    </a>
                                </div>
                            </div>
                            <div className="block md:hidden">
                                <button className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="size-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </header>
    );
};

export default Header;
