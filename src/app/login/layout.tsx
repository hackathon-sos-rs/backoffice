import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navigation from "@/components/Navigation";
import User from "@/components/User";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SOS RS - Backoffice",
  description: "Sistema de controle de estoque e backoffice da SOS RS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className + " " + "flex flex-row"}>
        <div className="flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
