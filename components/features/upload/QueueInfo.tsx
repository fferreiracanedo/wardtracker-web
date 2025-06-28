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
    <div className="space-y-6 p-2">
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
        <div className="rounded-xl shadow-md bg-gradient-to-b from-background/80 to-secondary/40 border border-border py-4 px-0 flex flex-col items-center justify-center min-w-[90px]">
          <Users className="h-6 w-6 mb-1 text-blue-400" />
          <div className="text-3xl font-extrabold text-blue-300 leading-tight">
            {stats.waiting}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Na Fila</div>
        </div>
        <div className="rounded-xl shadow-md bg-gradient-to-b from-background/80 to-secondary/40 border border-border py-4 px-0 flex flex-col items-center justify-center min-w-[90px]">
          <Activity className="h-6 w-6 mb-1 text-green-400" />
          <div className="text-3xl font-extrabold text-green-300 leading-tight">
            {stats.processing}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Processa</div>
        </div>
        <div className="rounded-xl shadow-md bg-gradient-to-b from-background/80 to-secondary/40 border border-border py-4 px-0 flex flex-col items-center justify-center min-w-[90px]">
          <Clock className="h-6 w-6 mb-1 text-orange-400" />
          <div className="text-3xl font-extrabold text-orange-300 leading-tight">
            {formatTime(stats.estimatedWaitTime)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Tempo Estimado
          </div>
        </div>
        <div className="rounded-xl shadow-md bg-gradient-to-b from-background/80 to-secondary/40 border border-border py-4 px-0 flex flex-col items-center justify-center min-w-[90px]">
          <TrendingUp className="h-6 w-6 mb-1 text-purple-400" />
          <div className="text-3xl font-extrabold text-purple-300 leading-tight">
            {formatTime(stats.averageProcessingTime)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Tempo Médio</div>
        </div>
      </div>

      {/* Resumo da Fila */}
      <Card className="rounded-xl border border-border shadow bg-background/80">
        <CardHeader>
          <CardTitle className="text-lg">Resumo da Fila</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Total de uploads hoje:</span>
            <Badge variant="secondary">{stats.total}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span>Concluídos com sucesso:</span>
            <Badge className="bg-green-100 text-green-800">
              {stats.completed}
            </Badge>
          </div>
          {stats.failed > 0 && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span>Falhas:</span>
              <Badge className="bg-red-100 text-red-800">{stats.failed}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Jobs Recentes */}
      {stats.recentJobs.length > 0 && (
        <Card className="rounded-xl border border-border shadow bg-background/80">
          <CardHeader>
            <CardTitle className="text-lg">Uploads Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recentJobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-2 bg-gray-50/10 rounded"
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
