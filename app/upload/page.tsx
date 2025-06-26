"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FileUploadArea from "@/components/features/upload/FileUploadArea";
import {
  SuccessAnimation,
  ProgressSteps,
  ErrorState,
  ActionFeedback,
} from "@/components/ui/feedback-system";

// Hook inline para evitar problemas de importação
function useUploadFeedback() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setSuccess(null);
    setProgress(0);
  }, []);

  const setProgressValue = useCallback((value: number) => {
    setProgress(Math.max(0, Math.min(100, value)));
  }, []);

  const setErrorValue = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  }, []);

  const setSuccessValue = useCallback((successMessage: string) => {
    setSuccess(successMessage);
    setIsLoading(false);
  }, []);

  const simulateUpload = useCallback(async () => {
    setIsLoading(true);
    setProgress(0);
    setError(null);

    return new Promise<void>((resolve, reject) => {
      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += Math.random() * 15;

        if (progressValue >= 100) {
          progressValue = 100;
          clearInterval(interval);
          setProgress(100);
          setSuccess("Upload concluído com sucesso!");
          setIsLoading(false);
          resolve();
        } else {
          setProgress(progressValue);
        }
      }, 200);

      // Simular erro ocasional (10% de chance)
      if (Math.random() < 0.1) {
        setTimeout(() => {
          clearInterval(interval);
          setError("Falha no upload. Tente novamente.");
          setIsLoading(false);
          reject(new Error("Falha no upload. Tente novamente."));
        }, 2000);
      }
    });
  }, []);

  return {
    isLoading,
    error,
    success,
    progress,
    reset,
    setProgress: setProgressValue,
    setError: setErrorValue,
    setSuccess: setSuccessValue,
    simulateUpload,
  };
}

export default function UploadPage() {
  const feedback = useUploadFeedback();

  const uploadSteps = [
    {
      id: "select",
      label: "Selecionar arquivo",
      status: "complete" as const,
      description: "Arquivo .rofl selecionado",
    },
    {
      id: "upload",
      label: "Enviar para análise",
      status: feedback.isLoading ? ("loading" as const) : ("pending" as const),
      description: "Upload e processamento inicial",
    },
    {
      id: "analyze",
      label: "Analisar replay",
      status: "pending" as const,
      description: "Cálculo do WardScore e métricas",
    },
    {
      id: "complete",
      label: "Análise concluída",
      status: "pending" as const,
      description: "Resultados prontos para visualização",
    },
  ];

  const handleDemoUpload = async () => {
    try {
      await feedback.simulateUpload();
    } catch (error) {
      // Error is handled by the feedback hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <ActionFeedback isActive={false} type="hover">
            <Button
              asChild
              variant="ghost"
              className="mb-6 hover:bg-secondary/80"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>
          </ActionFeedback>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Enviar Replay
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Faça upload do seu arquivo .rofl para receber sua análise
              detalhada do WardScore
            </p>
          </div>
        </div>

        {/* Feedback States */}
        {feedback.success && (
          <SuccessAnimation
            title="Upload Concluído!"
            message="Seu replay foi enviado com sucesso. Redirecionando para análise..."
            onComplete={() => feedback.reset()}
          />
        )}

        {feedback.error && (
          <div className="mb-6">
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-6">
                <ErrorState
                  title="Erro no Upload"
                  message={feedback.error}
                  onRetry={handleDemoUpload}
                  onCancel={() => feedback.reset()}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Steps - Mostrar durante upload */}
        {feedback.isLoading && (
          <div className="mb-6">
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-700">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Processando Upload
                </CardTitle>
                <CardDescription className="text-amber-600">
                  Progresso: {Math.round(feedback.progress)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressSteps steps={uploadSteps} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Card */}
          <div className="lg:col-span-2">
            <Card
              className={`transition-all duration-300 hover:shadow-lg ${
                feedback.isLoading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center text-2xl">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  Selecione seu Replay
                </CardTitle>
                <CardDescription className="text-base">
                  Envie um arquivo .rofl da sua pasta de Replays do League of
                  Legends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileUploadArea />

                {/* Demo Button */}
                <div className="border-t pt-6">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Para demonstração, você pode testar o sistema de upload:
                    </p>
                    <ActionFeedback
                      isActive={feedback.isLoading}
                      type="loading"
                    >
                      <Button
                        onClick={handleDemoUpload}
                        disabled={feedback.isLoading}
                        variant="outline"
                        size="lg"
                        className="w-full max-w-md transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                      >
                        {feedback.isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                            Processando...
                          </>
                        ) : (
                          <>🎮 Testar Upload Demo</>
                        )}
                      </Button>
                    </ActionFeedback>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8">
          <Card className="bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-blue-600" />
                Como encontrar seus replays?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-background/50">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-lg font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Habilite a gravação</h4>
                    <p className="text-sm text-muted-foreground">
                      No cliente do LoL, vá em{" "}
                      <strong>Configurações → Replay</strong> e marque "Salvar
                      automaticamente"
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-background/50">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-lg font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Localize a pasta</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Windows:</strong> Documentos → League of Legends →
                      Replays
                      <br />
                      <strong>Mac:</strong> /Applications/League of
                      Legends/Replays
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-background/50">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-lg font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Escolha um replay</h4>
                    <p className="text-sm text-muted-foreground">
                      Selecione um arquivo <strong>.rofl</strong> de uma partida
                      que você quer analisar
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
