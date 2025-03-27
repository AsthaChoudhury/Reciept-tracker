import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Receipt Tracker",
  description: "Keep financing easy",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Toaster richColors />
          <footer className="bg-green-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Receipt Tracker</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
