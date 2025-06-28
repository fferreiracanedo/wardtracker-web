"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getJobStatus } from "@/lib/api";
import { QueueJob, PlayerAnalysis } from "@/types";

import { AnalysisSkeleton } from "@/components/features/analysis/AnalysisSkeleton";
import WardScoreDisplay from "@/components/features/analysis/WardScoreDisplay";
import MetricsCard from "@/components/features/dashboard/MetricsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Componente para a tela de seleção de jogador
function PlayerSelection({
  players,
  onSelectPlayer,
  matchId,
}: {
  players: PlayerAnalysis[];
  onSelectPlayer: (player: PlayerAnalysis) => void;
  matchId: string;
}) {
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Selecione seu jogador</CardTitle>
          <CardDescription>
            A análise para a partida {matchId} está pronta. Escolha seu nome de
            usuário para ver os detalhes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="w-full text-left p-4 border rounded-lg hover:bg-muted transition-colors flex items-center space-x-4"
              >
                <Avatar>
                  {/* Idealmente, teríamos a imagem do campeão aqui */}
                  <AvatarFallback>
                    {player.champion.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <p className="font-bold text-lg">{player.playerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {player.champion}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{player.wardScore}</p>
                  <p className="text-sm text-muted-foreground">WardScore</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para exibir a análise detalhada de um jogador
function PlayerAnalysisDetails({ player }: { player: PlayerAnalysis }) {
  if (!player) return null;

  const { wardScore, rank, gameStats, playerName, champion } = player;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{playerName}</CardTitle>
            <CardDescription>Análise de Visão para {champion}</CardDescription>
          </div>
          <Button onClick={() => window.location.reload()}>
            Selecionar outro jogador
          </Button>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <WardScoreDisplay score={wardScore} rank={rank} />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricsCard
            title="Duração da Partida"
            value={`${gameStats.duration} min`}
          />
          <MetricsCard
            title="Sentinelas Posicionadas"
            value={gameStats.wardsPlaced}
          />
          <MetricsCard
            title="Sentinelas Destruídas"
            value={gameStats.wardsDestroyed}
          />
          <MetricsCard
            title="Pontuação de Visão"
            value={gameStats.visionScore}
          />
          <MetricsCard
            title="Sentinelas de Controle"
            value={gameStats.controlWardsPlaced}
          />
          <MetricsCard title="KDA" value={gameStats.kda} />
        </div>
      </div>

      {/* AINDA EM DESENVOLVIMENTO - HEATMAP E SUGESTÕES */}
      <Card>
        <CardHeader>
          <CardTitle>Insights (Em Breve)</CardTitle>
          <CardDescription>
            Visualizações detalhadas e sugestões personalizadas estarão
            disponíveis aqui.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            O mapa de calor de sentinelas e as sugestões de posicionamento ainda
            estão em desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AnalysisPage({
  params,
}: {
  params: { matchId: string };
}) {
  const { matchId } = params;
  const searchParams = useSearchParams();
  const router = useRouter();

  const [job, setJob] = useState<QueueJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerAnalysis | null>(
    null
  );

  useEffect(() => {
    const jobId = searchParams.get("jobId");
    if (!jobId) {
      // Se não houver jobId, talvez o usuário tenha chegado aqui por um link direto.
      // Poderíamos tentar buscar o resultado direto pelo matchId se a API suportasse.
      setError("ID do Job não encontrado na URL.");
      return;
    }

    const interval = setInterval(async () => {
      try {
        const currentJob = await getJobStatus(jobId);
        setJob(currentJob);

        if (
          currentJob.status === "completed" ||
          currentJob.status === "failed"
        ) {
          clearInterval(interval);
          if (currentJob.status === "failed") {
            setError(currentJob.error || "Ocorreu um erro no processamento.");
          }
        }
      } catch (err) {
        clearInterval(interval);
        setError("Não foi possível obter o status do job.");
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [matchId, searchParams, router]);

  // Roda quando o job é concluído para verificar se há um jogador selecionado na URL
  useEffect(() => {
    if (job?.status === "completed" && job.result) {
      const selectedPlayerId = searchParams.get("player");
      if (selectedPlayerId) {
        const player = job.result.find(
          (p: PlayerAnalysis) => p.id === selectedPlayerId
        );
        if (player) {
          setSelectedPlayer(player);
        }
      }
    }
  }, [job, searchParams]);

  const handleSelectPlayer = (player: PlayerAnalysis) => {
    setSelectedPlayer(player);
    // Atualiza a URL para incluir o jogador selecionado, permitindo compartilhar o link direto
    const jobId = searchParams.get("jobId");
    router.push(`/analysis/${matchId}?jobId=${jobId}&player=${player.id}`);
  };

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  if (!job || (job.status !== "completed" && job.status !== "failed")) {
    return <AnalysisSkeleton job={job as QueueJob} />;
  }

  if (job.status === "completed" && job.result) {
    if (selectedPlayer) {
      return <PlayerAnalysisDetails player={selectedPlayer} />;
    } else {
      return (
        <PlayerSelection
          players={job.result}
          onSelectPlayer={handleSelectPlayer}
          matchId={matchId}
        />
      );
    }
  }

  return <AnalysisSkeleton job={job as QueueJob} />; // Fallback para qualquer outro estado
}
