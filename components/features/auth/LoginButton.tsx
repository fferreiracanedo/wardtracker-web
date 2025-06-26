"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/authStore";
import { toast } from "sonner";

interface LoginButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  iconOnly?: boolean;
}

export default function LoginButton({
  className,
  variant = "default",
  size = "default",
  iconOnly = false,
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleRiotLogin = async () => {
    setIsLoading(true);

    try {
      // URL base da API para autenticação Riot
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const redirectUri = `${window.location.origin}/api/auth/riot/callback`;

      // Construir URL de autorização da Riot
      const riotAuthUrl = `${apiUrl}/auth/riot?redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;

      // Redirecionar para a página de autorização da Riot
      window.location.href = riotAuthUrl;
    } catch (error) {
      console.error("Erro ao iniciar login:", error);
      toast.error("Erro ao conectar com Riot Games");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso");
  };

  if (isAuthenticated && user) {
    if (iconOnly) {
      return (
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className={`w-10 h-10 p-0 rounded-full ${className}`}
          title={`${user.username} - Clique para sair`}
        >
          <div className="w-6 h-6 rounded-full bg-lol-gold/20 flex items-center justify-center">
            <span className="text-lol-gold font-semibold text-xs">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </Button>
      );
    }

    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-lol-gold/20 flex items-center justify-center">
            <span className="text-lol-gold font-semibold text-sm">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium">{user.username}</span>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          Sair
        </Button>
      </div>
    );
  }

  if (iconOnly) {
    return (
      <Button
        onClick={handleRiotLogin}
        disabled={isLoading}
        variant="ghost"
        size="sm"
        className={`w-10 h-10 p-0 rounded-lg ${className}`}
        title="Faça login com sua conta Riot Games"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
        ) : (
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            {/* Logo simplificado da Riot Games */}
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
          </svg>
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleRiotLogin}
      disabled={isLoading}
      variant={variant as any}
      size={size}
      className={className}
      aria-label="Faça login com sua conta Riot Games para continuar"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Conectando...
        </>
      ) : (
        <>
          <svg
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            {/* Logo simplificado da Riot Games */}
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
          </svg>
          Login com Riot Games
        </>
      )}
    </Button>
  );
}
