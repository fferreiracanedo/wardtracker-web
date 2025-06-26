"use client";

import { useState } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Target,
  Eye,
  Gamepad2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type {
  PlayerComparison,
  PlayerProfile,
  ComparisonCategory,
} from "@/types";

interface PlayerComparisonProps {
  comparison?: PlayerComparison;
  onPlayerSearch?: (query: string) => void;
  loading?: boolean;
}

export default function PlayerComparison({
  comparison,
  onPlayerSearch,
  loading = false,
}: PlayerComparisonProps) {
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");

  const getRankColor = (tier: string) => {
    const colors: Record<string, string> = {
      IRON: "text-gray-600",
      BRONZE: "text-amber-600",
      SILVER: "text-gray-400",
      GOLD: "text-yellow-500",
      PLATINUM: "text-cyan-400",
      EMERALD: "text-emerald-500",
      DIAMOND: "text-blue-400",
      MASTER: "text-purple-500",
      GRANDMASTER: "text-red-500",
      CHALLENGER: "text-gradient-to-r from-yellow-400 to-red-500",
    };
    return colors[tier] || "text-gray-400";
  };

  const getAdvantageIcon = (advantage: string) => {
    if (advantage === "player1")
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (advantage === "player2")
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-yellow-500" />;
  };

  const renderPlayerCard = (player: PlayerProfile, isPlayer1: boolean) => (
    <Card className="flex-1">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-blue flex items-center justify-center">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">
              {player.gameName}#{player.tagLine}
            </CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <span className={getRankColor(player.rank.tier)}>
                {player.rank.tier} {player.rank.division}
              </span>
              <span className="text-muted-foreground">{player.rank.lp} LP</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* WardScore */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gold mb-1">
            {player.stats.wardScore.current.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground flex items-center justify-center space-x-1">
            <span>WardScore</span>
            {player.stats.wardScore.trend === "up" && (
              <TrendingUp className="h-3 w-3 text-green-500" />
            )}
            {player.stats.wardScore.trend === "down" && (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            {player.stats.wardScore.trend === "stable" && (
              <Minus className="h-3 w-3 text-yellow-500" />
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Top {100 - player.stats.wardScore.percentile}%
          </div>
        </div>

        {/* Stats Rápidas */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">Win Rate</div>
            <div className="font-semibold">
              {player.stats.performance.winRate}%
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Avg KDA</div>
            <div className="font-semibold">
              {player.stats.performance.avgKDA}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Vision Score</div>
            <div className="font-semibold">
              {player.stats.vision.avgVisionScore}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">CS/min</div>
            <div className="font-semibold">
              {player.stats.performance.avgCS}
            </div>
          </div>
        </div>

        {/* Champions Principais */}
        <div>
          <div className="text-sm font-medium mb-2">Champions Principais</div>
          <div className="space-y-1">
            {player.stats.championMastery.slice(0, 3).map((champ, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs"
              >
                <span>{champ.championName}</span>
                <div className="flex items-center space-x-1">
                  <Badge variant="secondary" className="text-xs">
                    M{champ.masteryLevel}
                  </Badge>
                  <span className="text-muted-foreground">
                    {champ.winRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderComparisonCategory = (
    title: string,
    icon: React.ReactNode,
    category: ComparisonCategory,
    unit: string = ""
  ) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center space-x-2">
          {icon}
          <span>{title}</span>
          {getAdvantageIcon(category.advantage)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Jogador 1</span>
          <span className="font-semibold">
            {category.player1Value}
            {unit}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Jogador 2</span>
          <span className="font-semibold">
            {category.player2Value}
            {unit}
          </span>
        </div>
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground mb-1">
            Diferença: {Math.abs(category.percentageDiff).toFixed(1)}%
          </div>
          <Progress value={Math.abs(category.percentageDiff)} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );

  if (!comparison) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Comparar Jogadores</CardTitle>
            <CardDescription className="text-center">
              Digite os nomes dos jogadores para comparar seus desempenhos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Jogador 1</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Nome#TAG"
                    value={searchQuery1}
                    onChange={(e) => setSearchQuery1(e.target.value)}
                  />
                  <Button
                    onClick={() => onPlayerSearch?.(searchQuery1)}
                    disabled={!searchQuery1 || loading}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Jogador 2</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Nome#TAG"
                    value={searchQuery2}
                    onChange={(e) => setSearchQuery2(e.target.value)}
                  />
                  <Button
                    onClick={() => onPlayerSearch?.(searchQuery2)}
                    disabled={!searchQuery2 || loading}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => {
                  if (searchQuery1 && searchQuery2) {
                    onPlayerSearch?.(`${searchQuery1} vs ${searchQuery2}`);
                  }
                }}
                disabled={!searchQuery1 || !searchQuery2 || loading}
              >
                {loading ? "Carregando..." : "Comparar Jogadores"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header com Resultado Geral */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Comparação de Jogadores</CardTitle>
          <CardDescription>
            Análise detalhada de desempenho e estatísticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {comparison.comparison.overall.advantage === "player1" && (
                <span className="text-green-500">
                  {comparison.player1.gameName} Venceu!
                </span>
              )}
              {comparison.comparison.overall.advantage === "player2" && (
                <span className="text-green-500">
                  {comparison.player2.gameName} Venceu!
                </span>
              )}
              {comparison.comparison.overall.advantage === "equal" && (
                <span className="text-yellow-500">Empate!</span>
              )}
            </div>
            <div className="text-lg text-muted-foreground">
              Score: {comparison.comparison.overall.score}/100
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards dos Jogadores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderPlayerCard(comparison.player1, true)}
        {renderPlayerCard(comparison.player2, false)}
      </div>

      {/* Comparação por Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderComparisonCategory(
          "WardScore",
          <Crown className="h-4 w-4 text-gold" />,
          comparison.comparison.categories.wardScore
        )}
        {renderComparisonCategory(
          "Visão",
          <Eye className="h-4 w-4 text-blue-500" />,
          comparison.comparison.categories.vision
        )}
        {renderComparisonCategory(
          "Performance",
          <Target className="h-4 w-4 text-green-500" />,
          comparison.comparison.categories.performance
        )}
        {renderComparisonCategory(
          "Consistência",
          <Gamepad2 className="h-4 w-4 text-purple-500" />,
          comparison.comparison.categories.consistency,
          "%"
        )}
      </div>

      {/* Head to Head (se existir) */}
      {comparison.comparison.headToHead && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico Direto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {comparison.comparison.headToHead.player1Wins}
                </div>
                <div className="text-sm text-muted-foreground">
                  Vitórias de {comparison.player1.gameName}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {comparison.comparison.headToHead.matchesPlayed}
                </div>
                <div className="text-sm text-muted-foreground">
                  Partidas Jogadas
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {comparison.comparison.headToHead.player2Wins}
                </div>
                <div className="text-sm text-muted-foreground">
                  Vitórias de {comparison.player2.gameName}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recomendações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Recomendações para {comparison.player1.gameName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {comparison.comparison.recommendations.player1.map(
                (rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Recomendações para {comparison.player2.gameName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {comparison.comparison.recommendations.player2.map(
                (rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
