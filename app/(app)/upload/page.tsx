"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Upload } from "lucide-react";
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
import { useFileUpload } from "@/hooks/useFileUpload";

export default function UploadPage() {
  const uploadHook = useFileUpload();
  const { uploadState, resetUpload, retryUpload } = uploadHook;

  const getStepStatus = (
    step: "select" | "upload" | "analyze" | "complete"
  ): "complete" | "loading" | "pending" | "error" => {
    if (uploadState.status === "error") return "error";

    switch (step) {
      case "select":
        return uploadState.file ? "complete" : "pending";

      case "upload":
        if (uploadState.status === "uploading") return "loading";
        if (["processing", "success"].includes(uploadState.status))
          return "complete";
        return "pending";

      case "analyze":
        if (uploadState.status === "processing") return "loading";
        if (uploadState.status === "success") return "complete";
        return "pending";

      case "complete":
        return uploadState.status === "success" ? "complete" : "pending";

      default:
        return "pending";
    }
  };

  const uploadSteps = [
    {
      id: "select",
      label: "Selecionar arquivo",
      status: getStepStatus("select"),
      description: "Arquivo .rofl selecionado",
    },
    {
      id: "upload",
      label: "Enviar para análise",
      status: getStepStatus("upload"),
      description:
        uploadState.status === "uploading"
          ? `Enviando: ${Math.round(uploadState.progress)}%`
          : "Upload e verificação inicial",
    },
    {
      id: "analyze",
      label: "Analisar replay",
      status: getStepStatus("analyze"),
      description: uploadState.phase || "Cálculo do WardScore e métricas",
    },
    {
      id: "complete",
      label: "Análise concluída",
      status: getStepStatus("complete"),
      description: "Resultados prontos para visualização",
    },
  ];

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
        {uploadState.status === "success" && (
          <SuccessAnimation
            title="Análise Concluída!"
            message="Seu replay foi analisado com sucesso. Redirecionando para a análise..."
            onComplete={() => resetUpload()}
          />
        )}

        {uploadState.error && (
          <div className="mb-6">
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-6">
                <ErrorState
                  title="Erro no Upload"
                  message={uploadState.error}
                  onRetry={retryUpload}
                  onCancel={() => resetUpload()}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Steps - Mostrar durante upload */}
        {uploadState.isUploading && (
          <div className="mb-6">
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-700">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Processando Replay
                </CardTitle>
                <CardDescription className="text-amber-600">
                  {uploadState.phase || "Aguarde um momento..."}
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
                uploadState.isUploading ? "opacity-50 pointer-events-none" : ""
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
                <FileUploadArea uploadHook={uploadHook} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
