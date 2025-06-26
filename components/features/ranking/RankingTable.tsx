"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { RankingPlayer } from "@/types";
import { DataLoadingState } from "@/components/ui/enhanced-loading";
import { formatScore } from "@/lib/utils";
import { useAuth } from "@/store/authStore";

interface RankingTableProps {
  players: RankingPlayer[];
  isLoading?: boolean;
  className?: string;
}

// Enhanced skeleton loader component
function RankingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 rounded-lg border animate-fade-in"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer rounded" />
          <div className="w-10 h-10 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer rounded" />
            <div className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer rounded w-2/3" />
          </div>
          <div className="w-16 h-6 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer rounded" />
        </div>
      ))}
      <div className="text-center py-4">
        <DataLoadingState type="ranking" />
      </div>
    </div>
  );
}

function RankingRow({
  player,
  isCurrentUser,
}: {
  player: RankingPlayer;
  isCurrentUser: boolean;
}) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <span className="text-sm font-semibold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: "bg-yellow-100 text-yellow-800 border-yellow-300",
        2: "bg-gray-100 text-gray-800 border-gray-300",
        3: "bg-amber-100 text-amber-800 border-amber-300",
      };
      return colors[rank as keyof typeof colors];
    }
    return "bg-muted text-muted-foreground";
  };

  return (
    <div
      className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors ${
        isCurrentUser
          ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20"
          : "hover:bg-muted/50"
      }`}
    >
      {/* Rank */}
      <div className="flex items-center justify-center w-8">
        {getRankIcon(player.rank)}
      </div>

      {/* Avatar */}
      <Avatar className="h-10 w-10">
        <AvatarImage src={player.avatarUrl} alt={player.name} />
        <AvatarFallback>
          {player.name?.slice(0, 2).toUpperCase() || "??"}
        </AvatarFallback>
      </Avatar>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3
            className={`font-semibold truncate ${
              isCurrentUser ? "text-primary" : ""
            }`}
          >
            {player.name}
          </h3>
          {isCurrentUser && (
            <Badge variant="secondary" className="text-xs">
              Você
            </Badge>
          )}
          {player.rank <= 3 && (
            <Badge className={`text-xs ${getRankBadge(player.rank)}`}>
              Top {player.rank}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {player.gamesPlayed} partidas analisadas
        </p>
      </div>

      {/* Score */}
      <div className="text-right">
        <div
          className={`text-lg font-bold ${
            player.score >= 80
              ? "text-green-600"
              : player.score >= 50
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {formatScore(player.score)}
        </div>
        <div className="text-xs text-muted-foreground">WardScore</div>
      </div>
    </div>
  );
}

export default function RankingTable({
  players,
  isLoading = false,
  className,
}: RankingTableProps) {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            Ranking Global
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RankingSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-lol-gold" />
            Ranking Global
          </div>
          <Badge variant="secondary">{players.length} jogadores</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {players.map((player) => (
            <RankingRow
              key={player.rank}
              player={player}
              isCurrentUser={user?.username === player.name}
            />
          ))}
        </div>

        {players.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum jogador encontrado no ranking.</p>
            <p className="text-sm mt-2">Seja o primeiro a enviar um replay!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
