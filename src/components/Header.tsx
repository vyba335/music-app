import React from "react";
import Image from "next/image";
import musicAppIconGreen from "../../lib/img/musicappicongreen.png";
import "../../styles/base.css";
import Search from "./Search";

interface Header {}

const Header = () => {
    return (
        <header className="custom-header">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex-1 md:flex md:items-center md:gap-12">
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
                    <div className="md:flex md:items-center md:gap-12">
                        <nav aria-label="Global" className="hidden md:block">
                            <ul className="flex items-center gap-6 text-sm">
                                <li>
                                    <a
                                        className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                                        href="#"
                                    >
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                                        href="#"
                                    >
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <Search />
                                </li>
                            </ul>
                        </nav>
                        <div className="flex items-center gap-4">
                            <div className="sm:flex sm:gap-4">
                                <a
                                    className="rounded-md login-button px-5 py-2.5 text-sm font-medium shadow-sm dark:hover:bg-teal-500"
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
                                        stroke-width="2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
