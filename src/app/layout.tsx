import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PropScout — 3112/101 Bathurst Street, Sydney",
  description: "Investment property assessment for Lumiere, Sydney CBD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
