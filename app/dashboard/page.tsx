"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Target,
  TrendingUp,
  Trophy,
  Eye,
  Calendar,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import MetricsCard from "@/components/features/dashboard/MetricsCard";
import AchievementCard from "@/components/features/achievements/AchievementCard";
import { DashboardSkeleton } from "@/components/features/dashboard/DashboardSkeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Achievement } from "@/types";
import { toast } from "sonner";
// Dados mock locais
const dashboardData = {
  overview: {
    totalGames: 247,
    averageWardScore: 73.5,
    bestWardScore: 94.8,
    improvementRate: 12.5,
    currentStreak: 5,
  },
  trends: {
    last7Days: [65, 68, 71, 75, 78, 76, 82],
  },
  breakdown: {
    byRole: [
      { role: "ADC", games: 98, avgScore: 75.2 },
      { role: "Support", games: 67, avgScore: 89.1 },
      { role: "Mid", games: 42, avgScore: 68.7 },
      { role: "Jungle", games: 25, avgScore: 71.8 },
      { role: "Top", games: 15, avgScore: 62.4 },
    ],
    byRank: [
      { rank: "Silver II", games: 67, avgScore: 58.3 },
      { rank: "Silver I", games: 89, avgScore: 61.7 },
      { rank: "Gold IV", games: 54, avgScore: 65.9 },
      { rank: "Gold III", games: 37, avgScore: 73.5 },
    ],
    byChampion: [
      { champion: "Jinx", games: 89, avgScore: 75.2 },
      { champion: "Caitlyn", games: 56, avgScore: 71.8 },
      { champion: "Ashe", games: 34, avgScore: 69.4 },
      { champion: "Vayne", games: 28, avgScore: 78.9 },
      { champion: "Ezreal", games: 21, avgScore: 67.3 },
    ],
  },
};

const achievements: Achievement[] = [
  {
    id: "achievement-1",
    title: "Olho de Águia",
    description: "Manteve 90+ vision score por 5 jogos consecutivos",
    category: "vision",
    rarity: "rare",
    requirement: { type: "streak", value: 5 },
    unlockedAt: "2024-12-20T14:30:00Z",
    reward: { xp: 250 },
    icon: "👁️",
    isUnlocked: true,
    progress: 100,
  },
  {
    id: "achievement-2",
    title: "Ward Master",
    description: "Colocou 1000 wards em partidas ranqueadas",
    category: "ward",
    rarity: "epic",
    requirement: { type: "special", value: 1000 },
    unlockedAt: "2024-12-15T09:15:00Z",
    reward: { xp: 500 },
    icon: "🎯",
    isUnlocked: true,
    progress: 100,
  },
  {
    id: "achievement-3",
    title: "Primeira Análise",
    description: "Complete sua primeira análise de replay",
    category: "improvement",
    rarity: "common",
    requirement: { type: "games", value: 1 },
    unlockedAt: "2024-12-01T16:45:00Z",
    reward: { xp: 100 },
    icon: "📊",
    isUnlocked: true,
    progress: 100,
  },
  {
    id: "achievement-4",
    title: "Sequência Dourada",
    description: "Alcance WardScore 80+ em 3 jogos seguidos",
    category: "streak",
    rarity: "legendary",
    requirement: { type: "streak", value: 3 },
    unlockedAt: undefined,
    reward: { xp: 1000 },
    icon: "🏆",
    isUnlocked: false,
    progress: 67,
  },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAchievementClick = (achievement: any) => {
    if (achievement.unlockedAt) {
      toast.success(
        `Conquista: ${achievement.title} (+${achievement.reward.xp} XP)`
      );
    } else {
      toast.info(
        `Progresso: ${achievement.progress}% - Continue jogando para desbloquear!`
      );
    }
  };

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const inProgressAchievements = achievements.filter((a) => !a.unlockedAt);

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>

            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Dashboard Avançado</h1>
              <p className="text-muted-foreground">
                Acompanhe seu progresso e conquistas no WardScore
              </p>
            </div>
          </div>

          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Dashboard Avançado</h1>
            <p className="text-muted-foreground">
              Acompanhe seu progresso e conquistas no WardScore
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <MetricsCard
              title="Total de Partidas"
              value={dashboardData.overview.totalGames}
              description="Replays analisados"
              icon={<Calendar className="h-4 w-4" />}
              trend={{
                value: 8,
                label: "este mês",
                direction: "up",
              }}
            />

            <MetricsCard
              title="WardScore Médio"
              value={dashboardData.overview.averageWardScore.toFixed(1)}
              description="Pontuação média"
              icon={<Target className="h-4 w-4" />}
              trend={{
                value: dashboardData.overview.improvementRate,
                label: "melhoria",
                direction: "up",
              }}
            />

            <MetricsCard
              title="Melhor Score"
              value={dashboardData.overview.bestWardScore.toFixed(1)}
              description="Recorde pessoal"
              icon={<Star className="h-4 w-4" />}
              trend={{
                value: 2,
                label: "último mês",
                direction: "up",
              }}
            />

            <MetricsCard
              title="Sequência Atual"
              value={`${dashboardData.overview.currentStreak} vitórias`}
              description="Melhorias consecutivas"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{
                value: 150,
                label: "vs. média",
                direction: "up",
              }}
            />

            <MetricsCard
              title="Conquistas"
              value={`${unlockedAchievements.length}/${achievements.length}`}
              description="Desbloqueadas"
              icon={<Trophy className="h-4 w-4" />}
              trend={{
                value: 33,
                label: "progresso",
                direction: "up",
              }}
            />
          </div>

          {/* Gráfico de Progresso */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução do WardScore</CardTitle>
              <CardDescription>Progresso dos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Últimos 7 dias</span>
                  <span className="font-medium">
                    {
                      dashboardData.trends.last7Days[
                        dashboardData.trends.last7Days.length - 1
                      ]
                    }
                    (último score)
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {dashboardData.trends.last7Days.map(
                    (score: number, index: number) => (
                      <div key={index} className="text-center">
                        <div className="h-20 bg-muted rounded flex items-end justify-center p-1">
                          <div
                            className="w-full bg-primary rounded-sm"
                            style={{ height: `${(score / 100) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs mt-1 font-medium">{score}</div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breakdown por Categoria */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Por Role */}
            <Card>
              <CardHeader>
                <CardTitle>Performance por Role</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.breakdown.byRole.map((item) => (
                  <div key={item.role} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.role}</span>
                      <span className="font-medium">
                        {item.avgScore.toFixed(1)}
                      </span>
                    </div>
                    <Progress
                      value={(item.avgScore / 100) * 100}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      {item.games} partidas
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Por Rank */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução por Rank</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.breakdown.byRank.map((item) => (
                  <div key={item.rank} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.rank}</span>
                      <span className="font-medium">
                        {item.avgScore.toFixed(1)}
                      </span>
                    </div>
                    <Progress
                      value={(item.avgScore / 100) * 100}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      {item.games} partidas
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Por Champion */}
            <Card>
              <CardHeader>
                <CardTitle>Melhores Champions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.breakdown.byChampion.map((item) => (
                  <div key={item.champion} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.champion}</span>
                      <span className="font-medium">
                        {item.avgScore.toFixed(1)}
                      </span>
                    </div>
                    <Progress
                      value={(item.avgScore / 100) * 100}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      {item.games} partidas
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Conquistas */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Conquistas</h2>
              <p className="text-muted-foreground">
                Desbloqueie conquistas melhorando seu gameplay
              </p>
            </div>

            {/* Conquistas Desbloqueadas */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                Desbloqueadas ({unlockedAchievements.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    onClick={() => handleAchievementClick(achievement)}
                  />
                ))}
              </div>
            </div>

            {/* Conquistas em Progresso */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Em Progresso ({inProgressAchievements.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgressAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    onClick={() => handleAchievementClick(achievement)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <Card className="text-center">
            <CardContent className="py-8">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-xl font-bold mb-2">Continue Evoluindo!</h3>
              <p className="text-muted-foreground mb-4">
                Faça upload de mais replays para continuar melhorando seu
                WardScore
              </p>
              <Button asChild>
                <Link href="/upload">Enviar Novo Replay</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
