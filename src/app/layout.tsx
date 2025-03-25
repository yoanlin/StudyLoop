import type { Metadata } from "next";
import { Bowlby_One_SC, Markazi_Text } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeProvider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Toast from "@/components/ui/Toast";

const bowlbyOneSC = Bowlby_One_SC({
  variable: "--font-bowlbyOneSC",
  weight: "400",
  subsets: ["latin"],
});

const markaziText = Markazi_Text({
  variable: "--font-markaziText",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Study Loop",
  description: "The best learning resource hub for everyone.",
  icons: {
    icon: "/boat.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
        <body
          className={`${bowlbyOneSC.variable} ${markaziText.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toast />
          </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
