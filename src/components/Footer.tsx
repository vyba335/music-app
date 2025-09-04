import React from "react";
import Image from "next/image";
import musicAppIcon from "../../lib/img/musicappicon.png";
import musicAppIconGreen from "../../lib/img/musicappicongreen.png";
import "../../styles/base.css";

interface Footer {}

const Footer = () => {
    return (
        <footer className="static bottom-0 w-full bg-white p-8 custom-footer">
            <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 text-center md:justify-between">
                <a className="block text-teal-600 dark:text-teal-300" title="Go to homepage" href="#">
                    <Image
                        src={musicAppIconGreen}
                        alt="Music App"
                        width={50}
                        height={50}
                        className="logo"
                    />
                </a>
                <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
                    <li>
                        <a
                            href="#"
                            className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75 text-sm"
                        >
                            About Us
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75 text-sm"
                        >
                            Contact Us
                        </a>
                    </li>
                </ul>
            </div>
            <p className="block mb-4 text-sm text-center text-slate-300 md:mb-0 border-t copyright-block mt-4 pt-4">
                Music App © 2024
            </p>
        </footer>
    );
};

export default Footer;
