import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Text-in-between",
  description: "Generate beautiful text thumbnails instantly",
  openGraph: {
    title: "Text-Thumbnail",
    description: "Generate beautiful text thumbnails instantly",
    type: "website",
    images: [
      {
        url: "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/gradii-1920x1080_(1).png",
        width: 1200,
        height: 630,
        alt: "Text-Thumbnail Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text-Thumbnail",
    description: "Generate beautiful text thumbnails instantly",
    images: [
      "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/gradii-1920x1080_(1).png",
    ],
    creator: "@tanmaydesai",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "text thumbnail",
    "thumbnail generator",
    "social media images",
    "text to image",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>{children}</body>
    </html>
  );
}
