"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import RankingTable from "@/components/features/ranking/RankingTable";
import { RankingTableSkeleton } from "@/components/features/ranking/RankingTableSkeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ActionFeedback, Notification } from "@/components/ui/feedback-system";
import { RankingPlayer } from "@/types";
import { getRanking } from "@/lib/api";
import { toast } from "sonner";

// Dados mock para demonstração
const mockRanking: RankingPlayer[] = [
  {
    rank: 1,
    name: "ProWardGod#BR1",
    avatarUrl: "",
    score: 94.8,
    gamesPlayed: 312,
  },
  {
    rank: 2,
    name: "VisionKing#BR1",
    avatarUrl: "",
    score: 93.2,
    gamesPlayed: 289,
  },
  {
    rank: 3,
    name: "WardMaster#BR1",
    avatarUrl: "",
    score: 91.7,
    gamesPlayed: 387,
  },
  {
    rank: 4,
    name: "EyeOfTiger#BR1",
    avatarUrl: "",
    score: 89.4,
    gamesPlayed: 234,
  },
  {
    rank: 5,
    name: "SightMaster#BR1",
    avatarUrl: "",
    score: 87.1,
    gamesPlayed: 198,
  },
  {
    rank: 1847,
    name: "SeuNome#BR1",
    avatarUrl: "",
    score: 73.5,
    gamesPlayed: 161,
  },
];

export default function RankingPage() {
  const [players, setPlayers] = useState<RankingPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const loadRanking = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // Simulando delay da API para demonstração
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Usando dados mock para demonstração
      setPlayers(mockRanking);

      if (showRefreshLoader) {
        setShowSuccessNotification(true);
        toast.success("Ranking atualizado com sucesso!");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao carregar ranking";
      toast.error(errorMessage);
      console.error("Erro ao carregar ranking:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadRanking();
  }, []);

  const handleRefresh = () => {
    loadRanking(true);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        {/* Success Notification */}
        {showSuccessNotification && (
          <Notification
            type="success"
            title="Ranking Atualizado!"
            message="Os dados mais recentes foram carregados com sucesso."
            onClose={() => setShowSuccessNotification(false)}
          />
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <ActionFeedback isActive={false} type="hover">
              <Button asChild variant="ghost">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao Início
                </Link>
              </Button>
            </ActionFeedback>

            <ActionFeedback isActive={isRefreshing} type="loading">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Atualizando..." : "Atualizar"}
              </Button>
            </ActionFeedback>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-lol-gold to-lol-blue bg-clip-text text-transparent">
              Ranking Global
            </h1>
            <p className="text-muted-foreground text-lg">
              Veja os melhores jogadores do WardScore da comunidade
            </p>
          </div>
        </div>

        {/* Ranking Table */}
        {isLoading ? (
          <RankingTableSkeleton />
        ) : (
          <RankingTable
            players={players}
            isLoading={isLoading}
            className="mb-8"
          />
        )}

        {/* Call to Action */}
        {!isLoading && players.length > 0 && (
          <div className="text-center">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                Quer aparecer no ranking?
              </h3>
              <p className="text-muted-foreground mb-4">
                Envie seus replays e melhore seu WardScore para subir de
                posição!
              </p>
              <ActionFeedback isActive={false} type="hover">
                <Button asChild variant="default" size="lg">
                  <Link href="/upload">Enviar Replay</Link>
                </Button>
              </ActionFeedback>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
