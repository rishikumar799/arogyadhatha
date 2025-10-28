
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Arogyadhatha",
    description: "Arogyadhatha - Your Health Friend",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex items-center justify-center min-h-screen">
            {children}
        </main>
    )
}
