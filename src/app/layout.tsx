import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import AuthProvider from "@/providers/AuthProvider";

const inter = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "daily.dev | Where developers suffere together",
  description: "daily.dev | Where developers suffere together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='dark'>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ToastContainer />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
