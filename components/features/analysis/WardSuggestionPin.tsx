"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Shield, AlertTriangle } from "lucide-react";
import { WardSuggestion } from "@/types";

interface WardSuggestionPinProps {
  suggestion: WardSuggestion;
  onClick?: (suggestion: WardSuggestion) => void;
}

export default function WardSuggestionPin({
  suggestion,
  onClick,
}: WardSuggestionPinProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (suggestion.type) {
      case "control":
        return <Shield className="h-4 w-4" />;
      case "vision":
        return <Eye className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getIconColor = () => {
    switch (suggestion.type) {
      case "control":
        return "text-blue-600";
      case "vision":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityColor = () => {
    switch (suggestion.priority) {
      case "high":
        return "border-red-500 bg-red-100";
      case "medium":
        return "border-yellow-500 bg-yellow-100";
      case "low":
        return "border-green-500 bg-green-100";
      default:
        return "border-gray-500 bg-gray-100";
    }
  };

  const getPriorityGlow = () => {
    switch (suggestion.priority) {
      case "high":
        return "shadow-red-500/50";
      case "medium":
        return "shadow-yellow-500/50";
      case "low":
        return "shadow-green-500/50";
      default:
        return "shadow-gray-500/50";
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={`
            absolute transform -translate-x-1/2 -translate-y-1/2 
            w-8 h-8 rounded-full border-2 
            flex items-center justify-center
            transition-all duration-200 ease-in-out
            hover:scale-110 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-primary
            ${getPriorityColor()}
            ${isHovered ? `shadow-lg ${getPriorityGlow()}` : "shadow-md"}
          `}
          style={{
            left: `${suggestion.position.x}%`,
            top: `${suggestion.position.y}%`,
          }}
          onClick={() => onClick?.(suggestion)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={`Sugestão de ward: ${suggestion.title}`}
        >
          <span className={getIconColor()}>{getIcon()}</span>

          {/* Pulse animation for high priority */}
          {suggestion.priority === "high" && (
            <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></span>
          )}
        </button>
      </TooltipTrigger>

      <TooltipContent side="top" className="max-w-xs p-3" sideOffset={10}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className={getIconColor()}>{getIcon()}</span>
            <span className="font-semibold text-sm">{suggestion.title}</span>
            <span
              className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${
                suggestion.priority === "high"
                  ? "bg-red-100 text-red-800"
                  : suggestion.priority === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }
            `}
            >
              {suggestion.priority === "high"
                ? "Alta"
                : suggestion.priority === "medium"
                ? "Média"
                : "Baixa"}{" "}
              Prioridade
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {suggestion.description}
          </p>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Tipo: {suggestion.type === "control" ? "Controle" : "Visão"}
              </span>
              <span>Clique para mais detalhes</span>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
