"use client";

import Header from "@/src/components/features/Header/Header";
import Footer from "@/src/components/features/Footer";
import { useRouter } from "next/navigation";

export default function ArtistNotFound() {
    const router = useRouter();

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
                <h1 className="text-4xl font-bold mb-4">Artist Not Found</h1>
                <p className="text-lg text-gray-600 mb-6">
                    The artist you're looking for doesn't exist or couldn't be
                    found.
                </p>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Go Back
                </button>
            </div>
            <Footer />
        </>
    );
}
