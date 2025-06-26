"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";
import { LoadingSpinner, LoadingDots } from "./loading-spinner";

// Progress Steps Component
interface ProgressStep {
  id: string;
  label: string;
  status: "pending" | "loading" | "complete" | "error";
  description?: string;
}

interface ProgressStepsProps {
  steps: ProgressStep[];
  className?: string;
}

export function ProgressSteps({ steps, className }: ProgressStepsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex-shrink-0">
            {step.status === "pending" && (
              <div className="h-6 w-6 rounded-full border-2 border-muted bg-muted/20" />
            )}
            {step.status === "loading" && (
              <div className="relative">
                <LoadingSpinner size="sm" className="text-lol-gold" />
              </div>
            )}
            {step.status === "complete" && (
              <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            )}
            {step.status === "error" && (
              <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                <XCircle className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div
              className={cn(
                "font-medium transition-colors",
                step.status === "complete" && "text-green-600",
                step.status === "loading" && "text-lol-gold",
                step.status === "error" && "text-red-600",
                step.status === "pending" && "text-muted-foreground"
              )}
            >
              {step.label}
            </div>
            {step.description && (
              <div className="text-sm text-muted-foreground mt-1">
                {step.description}
              </div>
            )}
          </div>

          {step.status === "loading" && (
            <div className="flex-shrink-0">
              <LoadingDots className="scale-75" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Success Animation Component
interface SuccessAnimationProps {
  title: string;
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

export function SuccessAnimation({
  title,
  message,
  onComplete,
  duration = 3000,
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "bg-card border rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-xl transition-all duration-500 transform",
          isVisible ? "scale-100 rotate-0" : "scale-95 rotate-12"
        )}
      >
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <div className="absolute inset-0 w-16 h-16 mx-auto bg-green-400/30 rounded-full animate-ping" />
        </div>

        <h3 className="text-xl font-bold text-green-600 mb-2 animate-fade-in">
          {title}
        </h3>

        {message && (
          <p className="text-muted-foreground animate-slide-up">{message}</p>
        )}

        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Error State Component
interface ErrorStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  onCancel?: () => void;
  retryText?: string;
  className?: string;
}

export function ErrorState({
  title,
  message,
  onRetry,
  onCancel,
  retryText = "Tentar Novamente",
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("text-center p-8 space-y-4", className)}>
      <div className="relative mb-6">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center animate-pulse">
          <XCircle className="h-8 w-8 text-white" />
        </div>
        <div className="absolute inset-0 w-16 h-16 mx-auto bg-red-400/20 rounded-full animate-ping" />
      </div>

      <h3 className="text-xl font-bold text-red-600 animate-fade-in">
        {title}
      </h3>

      {message && (
        <p className="text-muted-foreground max-w-md mx-auto animate-slide-up">
          {message}
        </p>
      )}

      <div className="flex justify-center space-x-4 pt-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>{retryText}</span>
          </button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

// Immediate Action Feedback
interface ActionFeedbackProps {
  isActive: boolean;
  type: "click" | "hover" | "loading";
  children: React.ReactNode;
  className?: string;
}

export function ActionFeedback({
  isActive,
  type,
  children,
  className,
}: ActionFeedbackProps) {
  return (
    <div
      className={cn(
        "transition-all duration-150 transform",
        isActive && type === "click" && "scale-95 brightness-110",
        isActive && type === "hover" && "scale-105 shadow-lg",
        isActive && type === "loading" && "opacity-75 cursor-not-allowed",
        className
      )}
    >
      {children}
    </div>
  );
}

// Smart Progress Indicator
interface SmartProgressProps {
  current: number;
  total: number;
  labels?: string[];
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export function SmartProgress({
  current,
  total,
  labels = [],
  showPercentage = true,
  animated = true,
  className,
}: SmartProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-between items-center">
        <span className="font-medium">
          {labels[current - 1] || `Etapa ${current} de ${total}`}
        </span>
        {showPercentage && (
          <span className="text-sm text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>

      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full bg-gradient-to-r from-lol-gold to-lol-blue rounded-full transition-all duration-500 ease-out",
              animated && "animate-pulse"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="absolute top-0 left-0 right-0 flex justify-between">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-4 h-4 rounded-full border-2 bg-background -translate-y-1 transition-colors duration-300",
                i < current ? "border-lol-gold bg-lol-gold" : "border-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Toast-like Notification
interface NotificationProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

export function Notification({
  type,
  title,
  message,
  duration = 4000,
  onClose,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-md w-full transition-all duration-300 transform",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div
        className={cn(
          "p-4 rounded-lg border shadow-lg backdrop-blur-sm",
          colors[type]
        )}
      >
        <div className="flex items-start space-x-3">
          <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium">{title}</h4>
            {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
