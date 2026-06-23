import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teacher OS Lesson Plan",
  description: "Lesson plan screen built from Figma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
