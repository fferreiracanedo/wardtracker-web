"use client";

import { useState } from "react";
import PlayerComparison from "@/components/features/comparison/PlayerComparison";

// Dados mock para demonstração
const mockComparison = {
  player1: {
    gameName: "SeuNome",
    tagLine: "BR1",
    rank: "Gold III",
    wardScore: 73.5,
    winRate: 55,
    avgVisionScore: 45.2,
    gamesPlayed: 161,
    isCurrentUser: true,
  },
  player2: {
    gameName: "ADCMaster",
    tagLine: "BR1",
    rank: "Platinum II",
    wardScore: 81.2,
    winRate: 68,
    avgVisionScore: 52.3,
    gamesPlayed: 234,
    isCurrentUser: false,
  },
  comparison: {
    wardScore: { advantage: "player2", difference: 7.7 },
    vision: { advantage: "player2", difference: 7.1 },
    performance: { advantage: "player2", difference: 13 },
    consistency: { advantage: "player2", difference: 7 },
  },
};
import { PlayerComparison as PlayerComparisonType } from "@/types";

export default function ComparePage() {
  // Dados mock para demonstração
  const mockComparison: PlayerComparisonType = {
    id: "comp123",
    createdAt: new Date().toISOString(),
    player1: {
      riotId: "player1-uuid",
      gameName: "SummonerOne",
      tagLine: "BR1",
      rank: {
        tier: "GOLD",
        division: "II",
        lp: 67,
      },
      region: "BR1",
      level: 145,
      profileIcon: 1,
      stats: {
        wardScore: {
          current: 73.5,
          average: 68.2,
          trend: "up" as const,
          percentile: 78,
        },
        vision: {
          avgVisionScore: 45,
          avgWardsPlaced: 18,
          avgWardsDestroyed: 7,
          avgControlWards: 3,
        },
        performance: {
          winRate: 67,
          avgKDA: 2.4,
          avgCS: 6.8,
          avgGoldPerMinute: 398,
        },
        championMastery: [
          {
            championId: "jinx",
            championName: "Jinx",
            masteryLevel: 7,
            masteryPoints: 234567,
            gamesPlayed: 89,
            winRate: 72,
            avgWardScore: 75.2,
          },
          {
            championId: "caitlyn",
            championName: "Caitlyn",
            masteryLevel: 6,
            masteryPoints: 156789,
            gamesPlayed: 56,
            winRate: 68,
            avgWardScore: 71.8,
          },
          {
            championId: "kaisa",
            championName: "Kai'Sa",
            masteryLevel: 5,
            masteryPoints: 89123,
            gamesPlayed: 34,
            winRate: 65,
            avgWardScore: 69.4,
          },
        ],
      },
      recentMatches: [],
    },
    player2: {
      riotId: "player2-uuid",
      gameName: "ProPlayer",
      tagLine: "BR1",
      rank: {
        tier: "PLATINUM",
        division: "IV",
        lp: 23,
      },
      region: "BR1",
      level: 178,
      profileIcon: 2,
      stats: {
        wardScore: {
          current: 81.2,
          average: 79.5,
          trend: "stable" as const,
          percentile: 85,
        },
        vision: {
          avgVisionScore: 52,
          avgWardsPlaced: 22,
          avgWardsDestroyed: 9,
          avgControlWards: 4,
        },
        performance: {
          winRate: 71,
          avgKDA: 2.8,
          avgCS: 7.2,
          avgGoldPerMinute: 425,
        },
        championMastery: [
          {
            championId: "ezreal",
            championName: "Ezreal",
            masteryLevel: 7,
            masteryPoints: 456789,
            gamesPlayed: 124,
            winRate: 74,
            avgWardScore: 82.1,
          },
          {
            championId: "jhin",
            championName: "Jhin",
            masteryLevel: 7,
            masteryPoints: 345678,
            gamesPlayed: 98,
            winRate: 69,
            avgWardScore: 80.5,
          },
          {
            championId: "ashe",
            championName: "Ashe",
            masteryLevel: 6,
            masteryPoints: 234567,
            gamesPlayed: 76,
            winRate: 72,
            avgWardScore: 79.8,
          },
        ],
      },
      recentMatches: [],
    },
    comparison: {
      overall: {
        advantage: "player2" as const,
        score: 67,
      },
      categories: {
        wardScore: {
          player1Value: 73.5,
          player2Value: 81.2,
          advantage: "player2" as const,
          difference: 7.7,
          percentageDiff: 10.5,
        },
        vision: {
          player1Value: 45,
          player2Value: 52,
          advantage: "player2" as const,
          difference: 7,
          percentageDiff: 15.6,
        },
        performance: {
          player1Value: 67,
          player2Value: 71,
          advantage: "player2" as const,
          difference: 4,
          percentageDiff: 6.0,
        },
        consistency: {
          player1Value: 78,
          player2Value: 85,
          advantage: "player2" as const,
          difference: 7,
          percentageDiff: 9.0,
        },
      },
      headToHead: {
        matchesPlayed: 3,
        player1Wins: 1,
        player2Wins: 2,
        avgWardScoreDiff: 6.8,
      },
      recommendations: {
        player1: [
          "Melhore seu controle de visão colocando mais wards defensivos",
          "Foque em destruir wards inimigas para negar informação",
          "Pratique positioning para evitar mortes desnecessárias",
          "Considere builds mais defensivas em matchups difíceis",
        ],
        player2: [
          "Continue mantendo sua excelente visão de jogo",
          "Trabalhe em sua agressividade na lane phase",
          "Pratique combos com diferentes ADCs para versatilidade",
          "Considere expandir seu pool de champions",
        ],
      },
    },
  };

  const [comparison, setComparison] = useState<
    PlayerComparisonType | undefined
  >(mockComparison);
  const [loading, setLoading] = useState(false);

  const handlePlayerSearch = async (query: string) => {
    setLoading(true);

    // Simular chamada da API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Se a query contém "vs", mostrar a comparação mock
    if (
      query.includes("vs") ||
      query.includes("SummonerOne") ||
      query.includes("ProPlayer")
    ) {
      setComparison(mockComparison);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Comparação de <span className="text-gold">Jogadores</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compare o desempenho de dois jogadores lado a lado e descubra quem
            tem melhor visão de jogo
          </p>
        </div>

        <PlayerComparison
          comparison={comparison}
          onPlayerSearch={handlePlayerSearch}
          loading={loading}
        />

        {!comparison && !loading && (
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Como funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gold font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold mb-2">Digite os Nomes</h3>
                <p className="text-sm text-muted-foreground">
                  Insira os nomes dos jogadores no formato Nome#TAG
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold mb-2">Análise Automática</h3>
                <p className="text-sm text-muted-foreground">
                  Nossa IA analisa histórico de partidas e estatísticas
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-500 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold mb-2">Resultado Detalhado</h3>
                <p className="text-sm text-muted-foreground">
                  Receba comparação completa com recomendações personalizadas
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
