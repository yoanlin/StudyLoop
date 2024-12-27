import type { Metadata } from "next";
import { Bowlby_One_SC } from "next/font/google";
import "./globals.css";

const bowlbyOneSC = Bowlby_One_SC({
  variable: "--font-bowlbyOneSC",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bowlbyOneSC.variable} antialiased`}>{children}</body>
    </html>
  );
}
