import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LegalAI Chat | AI-Powered Legal Document Assistant",
  description: "Chat with your legal documents. Get instant summaries, explanations, and insights using advanced NLP and semantic understanding.",
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
