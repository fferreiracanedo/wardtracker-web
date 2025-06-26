"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Share2, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WardScoreDisplay from "@/components/features/analysis/WardScoreDisplay";
import DeathHeatmap from "@/components/features/analysis/DeathHeatmap";
import WardSuggestionsMap from "@/components/features/analysis/WardSuggestionsMap";
import ShareButtons from "@/components/features/analysis/ShareButtons";
import GameTimeline from "@/components/features/timeline/GameTimeline";
import { AnalysisSkeleton } from "@/components/features/analysis/AnalysisSkeleton";
import {
  ProgressSteps,
  SuccessAnimation,
  ErrorState,
  ActionFeedback,
} from "@/components/ui/feedback-system";
import { useFeedback } from "@/hooks/useFeedback";

// Mock data para demonstração
const mockAnalysis = {
  matchId: "BR1_2830449829",
  wardScore: 78.5,
  playerName: "SeuNome#BR1",
  champion: "Jinx",
  gameMode: "Ranked Solo",
  duration: "32:45",
  result: "Vitória",
  kda: "12/3/8",
  wardData: {
    wardsPlaced: 23,
    wardsDestroyed: 8,
    visionScore: 45,
    controlWardsPlaced: 5,
  },
};

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<typeof mockAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Analisando Replay</h1>
            <p className="text-muted-foreground">
              Aguarde enquanto processamos os dados do seu jogo...
            </p>
          </div>

          <AnalysisSkeleton />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>

          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Análise não encontrada</h2>
            <p className="text-muted-foreground mb-6">
              Esta análise não existe ou foi removida.
            </p>
            <Button asChild>
              <Link href="/upload">Enviar Novo Replay</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>

            <div className="flex space-x-2">
              <ShareButtons
                analysisUrl={`${
                  process.env.NEXT_PUBLIC_SITE_URL || ""
                }/analysis/${analysis.matchId}`}
                wardScore={analysis.wardScore}
              />
              <Button variant="outline">
                <Play className="mr-2 h-4 w-4" />
                Reprocessar
              </Button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Análise Completa</h1>
            <div className="flex items-center justify-center space-x-4 text-muted-foreground">
              <span>{analysis.playerName}</span>
              <span>•</span>
              <span>{analysis.champion}</span>
              <span>•</span>
              <span>{analysis.gameMode}</span>
              <span>•</span>
              <Badge
                variant={
                  analysis.result === "Vitória" ? "default" : "destructive"
                }
              >
                {analysis.result}
              </Badge>
            </div>
          </div>
        </div>

        {/* WardScore Display */}
        <div className="mb-8">
          <WardScoreDisplay
            score={analysis.wardScore}
            description="Sua visão de jogo está acima da média! Continue melhorando."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button variant="default" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Baixar Relatório
          </Button>

          <Button variant="outline" size="lg">
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
        </div>

        {/* Game Timeline */}
        <div className="mb-8">
          <div className="bg-muted/20 p-8 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Timeline da Partida</h3>
            <p className="text-muted-foreground">
              Timeline detalhada será exibida aqui após implementação completa.
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-lol-gold">
              {analysis.wardData.wardsPlaced}
            </div>
            <div className="text-sm text-muted-foreground">Wards Colocados</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-lol-blue">
              {analysis.wardData.wardsDestroyed}
            </div>
            <div className="text-sm text-muted-foreground">
              Wards Destruídos
            </div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {analysis.wardData.visionScore}
            </div>
            <div className="text-sm text-muted-foreground">Vision Score</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {analysis.wardData.controlWardsPlaced}
            </div>
            <div className="text-sm text-muted-foreground">Control Wards</div>
          </div>
        </div>
      </div>
    </div>
  );
}
