import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Renoweb Lead Gen Tool",
  description:
    "Generate, score, and export qualified leads with Renoweb's intelligent lead generation pipeline.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`} data-scroll-behavior="smooth">
      <head />
      <body>{children}</body>
    </html>
  );
}
