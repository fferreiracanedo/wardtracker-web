"use client";

import { useState, useCallback, useRef } from "react";

interface FeedbackState {
    isLoading: boolean;
    error: string | null;
    success: string | null;
    progress: number;
    currentStep: number;
}

interface UseFeedbackOptions {
    onSuccess?: (message: string) => void;
    onError?: (error: string) => void;
    autoReset?: boolean;
    resetDelay?: number;
}

export function useFeedback(options: UseFeedbackOptions = {}) {
    const { onSuccess, onError, autoReset = true, resetDelay = 3000 } = options;

    const [state, setState] = useState<FeedbackState>({
        isLoading: false,
        error: null,
        success: null,
        progress: 0,
        currentStep: 0,
    });

    const timeoutRef = useRef<NodeJS.Timeout>();

    const reset = useCallback(() => {
        setState({
            isLoading: false,
            error: null,
            success: null,
            progress: 0,
            currentStep: 0,
        });

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const setLoading = useCallback((loading: boolean) => {
        setState(prev => ({ ...prev, isLoading: loading, error: null }));
    }, []);

    const setProgress = useCallback((progress: number, step?: number) => {
        setState(prev => ({
            ...prev,
            progress: Math.max(0, Math.min(100, progress)),
            currentStep: step ?? prev.currentStep
        }));
    }, []);

    const setError = useCallback((error: string) => {
        setState(prev => ({ ...prev, error, isLoading: false }));
        onError?.(error);

        if (autoReset) {
            timeoutRef.current = setTimeout(reset, resetDelay);
        }
    }, [onError, autoReset, resetDelay, reset]);

    const setSuccess = useCallback((success: string) => {
        setState(prev => ({ ...prev, success, isLoading: false, error: null }));
        onSuccess?.(success);

        if (autoReset) {
            timeoutRef.current = setTimeout(reset, resetDelay);
        }
    }, [onSuccess, autoReset, resetDelay, reset]);

    const executeWithFeedback = useCallback(async <T>(
        asyncFn: () => Promise<T>,
        options?: {
            loadingMessage?: string;
            successMessage?: string;
            errorMessage?: string;
            onProgress?: (progress: number) => void;
        }
    ): Promise<T | null> => {
        try {
            setLoading(true);
            reset();

            const result = await asyncFn();

            if (options?.successMessage) {
                setSuccess(options.successMessage);
            } else {
                setLoading(false);
            }

            return result;
        } catch (error) {
            const errorMessage = options?.errorMessage ||
                (error instanceof Error ? error.message : "Erro inesperado");
            setError(errorMessage);
            return null;
        }
    }, [setLoading, setSuccess, setError, reset]);

    return {
        ...state,
        setLoading,
        setProgress,
        setError,
        setSuccess,
        reset,
        executeWithFeedback,
    };
}

// Hook específico para uploads com progresso
export function useUploadFeedback() {
    const feedback = useFeedback({
        autoReset: false,
    });

    const simulateUpload = useCallback(async (
        onProgress?: (progress: number) => void
    ) => {
        feedback.setLoading(true);
        feedback.setProgress(0);

        return new Promise<void>((resolve, reject) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;

                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    feedback.setProgress(100);
                    feedback.setSuccess("Upload concluído com sucesso!");
                    resolve();
                } else {
                    feedback.setProgress(progress);
                    onProgress?.(progress);
                }
            }, 200);

            // Simular erro ocasional (10% de chance)
            if (Math.random() < 0.1) {
                setTimeout(() => {
                    clearInterval(interval);
                    reject(new Error("Falha no upload. Tente novamente."));
                }, 2000);
            }
        });
    }, [feedback]);

    return {
        ...feedback,
        simulateUpload,
    };
}

// Hook para análise progressiva 
export function useAnalysisFeedback() {
    const feedback = useFeedback();

    const steps = [
        { id: "read", label: "Lendo arquivo", duration: 1000 },
        { id: "parse", label: "Processando eventos", duration: 2000 },
        { id: "analyze", label: "Analisando visão", duration: 1500 },
        { id: "calculate", label: "Calculando WardScore", duration: 1000 },
        { id: "complete", label: "Finalizado", duration: 500 },
    ];

    const runAnalysis = useCallback(async () => {
        feedback.setLoading(true);
        feedback.setProgress(0, 0);

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            feedback.setProgress((i / steps.length) * 100, i + 1);

            // Simular processamento
            await new Promise(resolve => setTimeout(resolve, step.duration));

            // Simular erro ocasional (5% chance por step)
            if (Math.random() < 0.05) {
                feedback.setError(`Erro ao ${step.label.toLowerCase()}`);
                return null;
            }
        }

        feedback.setProgress(100, steps.length);
        feedback.setSuccess("Análise concluída! WardScore calculado.");

        return {
            wardScore: 78.5,
            analysisId: "analysis-" + Date.now(),
        };
    }, [feedback]);

    return {
        ...feedback,
        steps,
        runAnalysis,
    };
} 