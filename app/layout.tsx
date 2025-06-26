import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WardScore - Análise de Replays de League of Legends",
  description:
    "Analise seus replays de League of Legends e descubra seu WardScore. Melhore sua visão de jogo e suba de elo!",
  keywords: ["League of Legends", "LoL", "Ward", "Replay", "Análise", "Gaming"],
  authors: [{ name: "WardScore Team" }],
};

export const viewport = {
  themeColor: "#C8AA6E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <TooltipProvider>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-hidden">
              <div className="h-full p-6">{children}</div>
            </main>
          </div>
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
