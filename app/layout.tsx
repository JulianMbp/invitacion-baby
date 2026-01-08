import { Heart } from "lucide-react";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

// URL base del sitio (ajusta según tu dominio)
const siteUrl = "https://baby-shower.julian-mbp.pro";

export const metadata: Metadata = {
  title: "Baby Shower",
  description: "Invitación al baby shower de Julian Bastidas y María Fernanda Delgado",
  openGraph: {
    title: "Baby Shower - Julian & María Fernanda",
    description: "Invitación al baby shower de Julian Bastidas y María Fernanda Delgado",
    url: siteUrl,
    siteName: "Baby Shower Invitation",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Baby Shower - Julian & María Fernanda",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baby Shower - Julian & María Fernanda",
    description: "Invitación al baby shower de Julian Bastidas y María Fernanda Delgado",
    images: [`${siteUrl}/og-image.jpg`],
  },
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${quicksand.variable} antialiased font-sans`}
      >
        {children}
        <footer className="w-full py-6 text-center bg-gradient-to-br from-pink-50 via-white to-blue-50">
          <p className="text-sm text-slate-600 flex items-center justify-center gap-2">
            Hecho con <Heart className="w-4 h-4 text-pink-400 fill-pink-400" /> por{" "}
            <Link 
              href="https://julian-mbp.pro/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-pink-500 font-semibold transition-colors"
            >
              Julian B.
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
