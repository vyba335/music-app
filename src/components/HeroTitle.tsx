import React from "react";
import "../../styles/base.css";

interface HeroTitle {
    title: string,
    subtitle: string
}

const HeroTitle: React.FC<HeroTitle> = ({ title, subtitle }) => {
    return (
        <section className="bg-transparent lg:grid">
            <div className="mx-auto w-screen max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <div className="mx-auto max-w-prose text-center">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
                        {title}
                    </h1>

                    <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed dark:text-gray-200">
                        {subtitle}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HeroTitle;