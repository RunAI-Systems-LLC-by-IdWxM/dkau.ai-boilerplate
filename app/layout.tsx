import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dKau.AI | Mundo KKI",
  description: "EduGame de exploração e tecnologia com KauAI e VeJiTAI",
  icons: {
    icon: "/assets/logo-dkau-ai.png",
    shortcut: "/assets/logo-dkau-ai.png",
    apple: "/assets/logo-dkau-ai.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Força o navegador a buscar o seu logo ignorando o cache padrão */}
        <link rel="icon" href="/assets/logo-dkau-ai.png" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}