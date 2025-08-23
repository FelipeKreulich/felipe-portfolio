import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../contexts/language/LanguageContext";
import ClientLayout from "../components/client/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Felipe Kreulich - Full Stack Developer",
  description: "Exploring the intersection of software engineering, people, and AI.",
  icons: {
    icon: [
      { url: '/icon16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/icon32.png',
    apple: '/icon32.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
