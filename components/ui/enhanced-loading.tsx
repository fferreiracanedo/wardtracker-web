"use client";

import { cn } from "@/lib/utils";
import { LoadingSpinner, LoadingDots, LoadingPulse } from "./loading-spinner";

interface LoadingStateProps {
  text?: string;
  subtext?: string;
  className?: string;
}

export function PageLoadingState({
  text = "Carregando...",
  subtext,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-24",
        className
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-lol-gold to-lol-blue rounded-full opacity-20 animate-ping"></div>
        <LoadingSpinner size="xl" className="relative z-10" />
      </div>
      <h3 className="text-lg font-semibold mb-2 animate-pulse">{text}</h3>
      {subtext && (
        <p className="text-muted-foreground text-center max-w-md">{subtext}</p>
      )}
    </div>
  );
}

export function AnalysisLoadingState({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-lol-gold to-lol-blue animate-spin"></div>
          <div className="absolute inset-2 bg-background rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingPulse />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 animate-pulse">
          Analisando Replay
        </h3>
        <p className="text-muted-foreground">
          Processando dados de visão e calculando WardScore...
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Lendo arquivo", status: "complete" },
          { label: "Processando eventos", status: "loading" },
          { label: "Calculando métricas", status: "pending" },
        ].map((step, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 rounded-lg border"
          >
            <div
              className={cn(
                "h-3 w-3 rounded-full",
                step.status === "complete" && "bg-green-500",
                step.status === "loading" && "bg-lol-gold animate-pulse",
                step.status === "pending" && "bg-muted"
              )}
            />
            <span
              className={cn(
                "text-sm",
                step.status === "complete" && "text-green-600",
                step.status === "loading" && "text-lol-gold font-medium",
                step.status === "pending" && "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UploadProgressState({
  progress = 0,
  filename,
}: {
  progress?: number;
  filename?: string;
}) {
  return (
    <div className="p-6 bg-gradient-to-br from-lol-gold/10 to-lol-blue/10 rounded-lg border border-lol-gold/20">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <LoadingSpinner size="md" />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {progress}%
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Enviando arquivo</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-to-r from-lol-gold to-lol-blue h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {filename && (
        <div className="text-sm text-muted-foreground">{filename}</div>
      )}

      <div className="flex items-center justify-center mt-4 space-x-2">
        <LoadingDots />
        <span className="text-sm text-muted-foreground">Processando...</span>
      </div>
    </div>
  );
}

export function DataLoadingState({ type = "dados" }: { type?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-4">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 bg-lol-gold rounded-sm animate-pulse",
                `[animation-delay:${i * 0.1}s]`
              )}
            />
          ))}
        </div>
      </div>
      <p className="text-muted-foreground animate-pulse">
        Carregando {type}...
      </p>
    </div>
  );
}
