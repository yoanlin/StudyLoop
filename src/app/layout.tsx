import type { Metadata } from "next";
import { Bowlby_One_SC, Markazi_Text } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
