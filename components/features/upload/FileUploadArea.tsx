"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, File, AlertCircle, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner, LoadingDots } from "@/components/ui/loading-spinner";
import { useFileUpload } from "@/hooks/useFileUpload";
import { formatFileSize } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function FileUploadArea() {
  const {
    file,
    progress,
    isUploading,
    error,
    status,
    selectFile,
    uploadFile,
    resetUpload,
    canUpload,
  } = useFileUpload();

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        selectFile(files[0]);
      }
    },
    [selectFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        selectFile(files[0]);
      }
    },
    [selectFile]
  );

  const handleClick = useCallback(() => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }, [isUploading]);

  const getStatusIcon = () => {
    if (status === "error")
      return <AlertCircle className="h-12 w-12 text-red-500" />;
    if (status === "success")
      return <CheckCircle2 className="h-12 w-12 text-green-500" />;
    return <Upload className="h-12 w-12 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (isUploading) return "Enviando arquivo...";
    if (file && !error) return "Arquivo selecionado";
    if (error) return "Erro no arquivo";
    return "Arraste um arquivo .rofl aqui ou clique para selecionar";
  };

  const getStatusDescription = () => {
    if (isUploading) return "Por favor, aguarde...";
    if (file && !error) return "Clique em 'Enviar Replay' para continuar";
    if (error) return "Verifique o arquivo e tente novamente";
    return "Suporte apenas para arquivos .rofl (máximo 50MB)";
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
          "hover:border-primary hover:bg-primary/5 hover:shadow-md",
          isDragOver && "border-primary bg-primary/10 shadow-lg scale-[1.02]",
          error && "border-red-300 bg-red-50",
          status === "success" && "border-green-300 bg-green-50",
          isUploading && "cursor-not-allowed opacity-75",
          !isDragOver && !error && !isUploading && "border-border"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".rofl"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-4">
          <div className="flex justify-center">{getStatusIcon()}</div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{getStatusText()}</h3>
            <p className="text-sm text-muted-foreground">
              {getStatusDescription()}
            </p>
          </div>

          {/* File Info */}
          {file && !error && (
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-background rounded-lg border">
              <File className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({formatFileSize(file.size)})
              </span>
              {!isUploading && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetUpload();
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-red-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-auto max-w-md p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">Erro no arquivo</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isUploading && (
            <div className="mx-auto max-w-md space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <LoadingDots />
                <span className="text-sm font-medium text-blue-700">
                  Processando...
                </span>
              </div>
              <Progress value={progress} className="w-full h-2" />
              <div className="flex justify-between text-xs text-blue-600">
                <span>{progress}% concluído</span>
                <span>Analisando replay...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={uploadFile}
          disabled={!canUpload}
          size="lg"
          className="px-8 min-w-[160px]"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Enviar Replay
            </>
          )}
        </Button>

        {file && !isUploading && (
          <Button
            onClick={resetUpload}
            variant="outline"
            size="lg"
            className="min-w-[120px]"
          >
            Limpar
          </Button>
        )}
      </div>

      {/* Help Text */}
      <div className="text-center text-sm text-muted-foreground bg-muted/30 rounded-lg p-4">
        <p className="font-medium mb-1">💡 Dica:</p>
        <p>
          Para encontrar seus replays:{" "}
          <strong>Documentos → League of Legends → Replays</strong>
          <br />
          Os arquivos têm extensão{" "}
          <code className="bg-background px-1 rounded">.rofl</code>
        </p>
      </div>
    </div>
  );
}
