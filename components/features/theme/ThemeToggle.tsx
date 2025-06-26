"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  iconOnly?: boolean;
}

export default function ThemeToggle({ iconOnly = false }: ThemeToggleProps) {
  const { theme, toggleMode, isLoading } = useTheme();

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <div className="w-4 h-4 animate-pulse bg-muted-foreground rounded"></div>
      </Button>
    );
  }

  const getIcon = () => {
    switch (theme.mode) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (theme.mode) {
      case "light":
        return "Claro";
      case "dark":
        return "Escuro";
      default:
        return "Sistema";
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleMode}
      title={`Tema atual: ${getLabel()}`}
      className={`transition-all duration-200 ${
        iconOnly ? "w-10 h-10 p-0" : "min-w-0"
      }`}
    >
      {getIcon()}
      {!iconOnly && <span className="ml-2 hidden sm:inline">{getLabel()}</span>}
    </Button>
  );
}
