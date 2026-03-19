import type { Metadata, Viewport } from "next";
import { Ubuntu_Mono } from "next/font/google";
import colors from "tailwindcss/colors";
import "./globals.css";

const ubuntuMono = Ubuntu_Mono({
  variable: "--font-ubuntu-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ??
  "https://objectiverankings.maxnankivell.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Objective Rankings",
  description:
    "Objective Rankings is a platform for creating completely correct and perfect rankings.",
  keywords: [
    "rankings",
    "objective rankings",
    "lists",
    "rankings platform",
    "create rankings",
    "perfect rankings",
    "tier lists",
    "tier lists platform",
    "create tier lists",
    "tier lists creator",
  ],
  authors: [{ name: "Max Nankivell", url: baseUrl }],
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  applicationName: "Objective Rankings",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Objective",
  },
  openGraph: {
    title: "Objective Rankings",
    description:
      "Objective Rankings is a platform for creating completely correct and perfect rankings.",
    url: baseUrl,
    siteName: "Objective Rankings",
    images: [
      {
        url: "/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "Objective Rankings",
      },
    ],
    locale: "en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Objective Rankings",
    description:
      "Objective Rankings is a platform for creating completely correct and perfect rankings.",
    images: ["/web-app-manifest-512x512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: colors.emerald[500],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ubuntuMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
