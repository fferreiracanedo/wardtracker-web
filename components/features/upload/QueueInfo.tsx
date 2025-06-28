"use client";

import { useState, useEffect } from "react";
import { Clock, Users, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QueueStats {
  total: number;
  waiting: number;
  processing: number;
  completed: number;
  failed: number;
  averageProcessingTime: number;
  estimatedWaitTime: number;
  recentJobs: Array<{
    id: string;
    fileName: string;
    status: string;
    progress: number;
    createdAt: string;
    processingTime: number | null;
  }>;
}

export default function QueueInfo() {
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/queue/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Atualizar a cada 10 segundos
    const interval = setInterval(fetchStats, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Status da Fila
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          Não foi possível carregar informações da fila
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.waiting}
            </div>
            <div className="text-xs text-muted-foreground">Na Fila</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {stats.processing}
            </div>
            <div className="text-xs text-muted-foreground">Processando</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {formatTime(stats.estimatedWaitTime)}
            </div>
            <div className="text-xs text-muted-foreground">Tempo Estimado</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {formatTime(stats.averageProcessingTime)}
            </div>
            <div className="text-xs text-muted-foreground">Tempo Médio</div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo da Fila */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo da Fila</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span>Total de uploads hoje:</span>
            <Badge variant="secondary">{stats.total}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span>Concluídos com sucesso:</span>
            <Badge className="bg-green-100 text-green-800">
              {stats.completed}
            </Badge>
          </div>
          {stats.failed > 0 && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span>Falhas:</span>
              <Badge className="bg-red-100 text-red-800">{stats.failed}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Jobs Recentes */}
      {stats.recentJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Uploads Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recentJobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {job.fileName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(job.createdAt).toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status === "waiting" && "⏳ Aguardando"}
                      {job.status === "processing" && `⚡ ${job.progress}%`}
                      {job.status === "completed" && "✅ Concluído"}
                      {job.status === "failed" && "❌ Falha"}
                    </Badge>
                    {job.processingTime && (
                      <span className="text-xs text-muted-foreground">
                        {formatTime(Math.round(job.processingTime / 1000))}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
