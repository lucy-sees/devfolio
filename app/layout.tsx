// app/layout.tsx
import type { Metadata as NextMetadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Extend the existing Metadata type
interface Metadata extends NextMetadata {
  X?: {
    card: string;
    title: string;
    description: string;
    images: string[];
    creator: string;
  };
}

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lucy-wanjiru-mwangi.vercel.app"),
  title: {
    default:
      "Lucy W. Mwangi | Tech Lead @ Hurudevs | Next.js & React Developer",
    template: "%s | Lucy W. Mwangi",
  },
  description:
    "Tech Lead at Hurudevs, specializing in Next.js, React, and AI integration. Expert in building, fixing, and scaling high-performance web applications.",
  keywords: [
    "Lucy W. Mwangi",
    "Hurudevs",
    "Tech Lead",
    "Next.js Developer",
    "React Developer",
    "AI Integration",
    "Full Stack Developer",
    "Web Development",
    "JavaScript",
    "TypeScript",
    "Frontend Developer",
    "Software Engineer",
    "Kenya Software Developer",
  ],
  authors: [{ name: "Lucy W. Mwangi" }],
  creator: "Lucy W. Mwangi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lucy-wanjiru-mwangi.vercel.app",
    siteName: "Lucy W. Mwangi Portfolio",
    title: "Lucy W. Mwangi | Tech Lead @ Hurudevs",
    description:
      "Tech Lead at Hurudevs, specializing in Next.js, React, and AI integration. Building high-performance web applications.",
    images: [
      {
        url: "/imgs/website.png",
        width: 1200,
        height: 630,
        alt: "Lucy W. Mwangi - Tech Lead @ Hurudevs",
      },
    ],
  },
  X: {
    // Now this is valid
    card: "summary_large_image",
    title: "Lucy W. Mwangi | Tech Lead @ Hurudevs",
    description:
      "Tech Lead @ Hurudevs, specializing in Next.js, React, and AI Integration",
    images: ["/imgs/website.png"],
    creator: "@lucy-sees",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://lucy-wanjiru-mwangi.vercel.app",
  },
  icons: {
    icon: "/imgs/logo.png",
    apple: "/imgs/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`dark ${jetbrainsMono.variable}`} lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
