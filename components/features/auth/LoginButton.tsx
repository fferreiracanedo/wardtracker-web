"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/store/authStore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LoginButton({ isCollapsed }: { isCollapsed?: boolean }) {
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const handleLogin = () => {
    // Redireciona para a rota da API que inicia o fluxo OAuth da Riot
    router.push("/api/auth/riot");
  };

  const handleLogout = () => {
    // Aqui, futuramente, chamaremos uma rota /api/auth/logout
    // Por enquanto, apenas limpa o estado local
    logout();
    toast.success("Você foi desconectado.");
  };

  // Exibe um skeleton enquanto verifica o status de autenticação
  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 p-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  // Exibe o usuário logado e o botão de sair
  if (isAuthenticated && user) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="text-sm px-3">
          <p
            className="font-bold truncate"
            title={`${user.gameName}#${user.tagLine}`}
          >
            {user.gameName}#{user.tagLine}
          </p>
          <p className="text-muted-foreground text-xs">Conectado</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    );
  }

  // Se a barra estiver recolhida, mostramos apenas o ícone com uma tooltip
  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button onClick={handleLogin} size="icon" className="w-full">
              <LogIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Login com Riot</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Exibe o botão de login se não estiver autenticado
  return (
    <Button onClick={handleLogin} className="w-full justify-start">
      <LogIn className="mr-2 h-4 w-4" />
      Login com Riot
    </Button>
  );
}
