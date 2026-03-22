import type { Metadata, Viewport } from "next";
import { Ubuntu_Mono } from "next/font/google";
import colors from "tailwindcss/colors";
import Header from "../components/Header";
import Providers from "../components/Providers";
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
    <html
      lang="en"
      className={`${ubuntuMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t!=='light');})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <Providers>
          <div className="flex flex-col flex-1 items-center bg-mist-200 dark:bg-black">
            <div className="flex flex-1 w-full max-w-7xl py-12 px-16 bg-white dark:bg-mist-900">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
