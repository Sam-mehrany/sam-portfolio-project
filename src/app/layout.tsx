import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar"; // <-- Import the new Navbar

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Sam Mehrany | Product Designer",
  description: "Portfolio of Sam Mehrany, a product designer specializing in UI/UX and generative AI campaigns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Navbar /> {/* <-- Add the Navbar component here */}
        <main>{children}</main> {/* This is where your page content will go */}
      </body>
    </html>
  );
}
