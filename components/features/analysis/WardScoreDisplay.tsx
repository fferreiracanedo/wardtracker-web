"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WardScoreDisplayProps {
  score: number;
  rank: string;
}

export default function WardScoreDisplay({
  score,
  rank,
}: WardScoreDisplayProps) {
  const getRankColor = (rank: string) => {
    if (rank.startsWith("S")) return "bg-yellow-500 hover:bg-yellow-600";
    if (rank.startsWith("A")) return "bg-green-500 hover:bg-green-600";
    if (rank.startsWith("B")) return "bg-blue-500 hover:bg-blue-600";
    return "bg-gray-500 hover:bg-gray-600";
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Seu WardScore™</CardTitle>
        <CardDescription>
          Uma métrica que avalia sua performance de visão.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
        <div className="text-7xl font-bold text-primary">{score}</div>
        <Badge className={`${getRankColor(rank)} text-white text-lg px-4 py-1`}>
          Rank {rank}
        </Badge>
      </CardContent>
    </Card>
  );
}
