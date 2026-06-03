// Next.js
import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";

// CSS
import "@/styles/globals.css";

// HTML Components
import { Toaster } from "@/components/ui/sonner";

// Components
import { TooltipProvider } from "@/components/ui/tooltip";

// Libs
import { AuthProvider } from "@/lib/auth";

const interTight = Inter_Tight({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inkspace — Booking & Management Suite",
  description:
    "Manage your tattoo studio with Inkspace. Track artists, clients, and appointments.",
  icons: {
    icon: {
      url: "/logos/inkspace-logo.svg",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interTight.className}>
      <body>
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
