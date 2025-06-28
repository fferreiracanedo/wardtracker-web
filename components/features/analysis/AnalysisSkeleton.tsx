import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner, LoadingPulse } from "@/components/ui/loading-spinner";
import { QueueJob } from "@/types";

export function AnalysisSkeleton({ job }: { job: QueueJob | null }) {
  const getStatusMessage = () => {
    if (!job) {
      return {
        title: "Carregando informações...",
        description: "Aguarde enquanto buscamos os detalhes da sua análise.",
      };
    }
    switch (job.status) {
      case "waiting":
        return {
          title: "Aguardando na fila...",
          description: "Sua análise está na fila e será processada em breve.",
        };
      case "processing":
        return {
          title: `Processando: ${job.phase || "Iniciando..."}`,
          description: `Progresso: ${Math.round(job.progress || 0)}%`,
        };
      default:
        return {
          title: "Carregando análise...",
          description: "Quase pronto...",
        };
    }
  };

  const { title, description } = getStatusMessage();

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-2">
            <LoadingSpinner />
            <span>{title}</span>
          </CardTitle>
          <CardContent className="text-center text-muted-foreground pt-4">
            {description}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
