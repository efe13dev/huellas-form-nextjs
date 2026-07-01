import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Huellas",
  description: "Web interna de la protectora Huellas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-background`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
