import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "@/styles/globals.css";

// Using variable font weights for better dark mode rendering
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-geist-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"] 
});

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap"
});

export const metadata: Metadata = {
  title: "LegalAI | Authentication",
  description: "Sign in to access AI-powered legal document analysis",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased bg-background`}>
        {children}
      </body>
    </html>
  );
}
