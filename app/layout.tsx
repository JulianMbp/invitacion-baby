import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baby Shower - Julian & Maria Fernanda",
  description: "Invitación al baby shower de Julian Bastidas y Maria Fernanda Delgado",
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
      </body>
    </html>
  );
}
