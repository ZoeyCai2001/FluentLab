import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FluentLab",
  description: "A daily English learning companion for AI researchers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
