import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";

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
  title: "LegalAI | AI-Powered Legal Document Assistant",
  description: "Chat with your legal documents. Get instant summaries, explanations, and insights using advanced NLP and semantic understanding.",
  keywords: "legal ai, document analysis, semantic search, vector embeddings, knowledge graphs, legal text summarization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth dark ${inter.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased bg-background">
        {/* Only show navbar/footer on non-auth pages */}
        {!children.toString().includes('auth') && <Navbar />}
        {children}
        {!children.toString().includes('auth') && <Footer />}
      </body>
    </html>
  );
}
