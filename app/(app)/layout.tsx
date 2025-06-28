import Sidebar from "@/components/layout/Sidebar";
import { AlertTriangle } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-yellow-400/50 bg-yellow-500/10 p-3 text-sm text-yellow-700 dark:text-yellow-300">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>
            <span className="font-bold">Versão de Desenvolvimento:</span> Este
            aplicativo está em fase de testes. Instabilidades e bugs podem
            ocorrer.
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}
