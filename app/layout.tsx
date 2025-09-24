import "@/styles/globals.css";
import "@/styles/base.css";
import "@/styles/embla.css";
import ErrorBoundary from "@/src/components/ErrorBoundary";
import { ToastProvider } from "@/src/components/ToastNotifications";
import { MusicProvider } from "@/src/contexts";

export const metadata = {
    title: "AI Music Discovery App",
    description:
        "Discover music with AI-powered recommendations, mood analysis, and intelligent playlists",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" data-theme="dark">
            <body>
                <ErrorBoundary>
                    <MusicProvider>
                        <ToastProvider>{children}</ToastProvider>
                    </MusicProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
