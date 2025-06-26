"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatScore, getScoreColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface WardScoreDisplayProps {
  score: number;
  description: string;
  previousScore?: number;
  className?: string;
}

export default function WardScoreDisplay({
  score,
  description,
  previousScore,
  className,
}: WardScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Animação de contagem
  useEffect(() => {
    const duration = 1500; // 1.5 segundos
    const steps = 60;
    const increment = score / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setDisplayScore(Math.min(increment * currentStep, score));

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayScore(score);
        setIsAnimating(false);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreIcon = () => {
    if (!previousScore) return null;

    if (score > previousScore) {
      return <TrendingUp className="h-6 w-6 text-green-500" />;
    } else if (score < previousScore) {
      return <TrendingDown className="h-6 w-6 text-red-500" />;
    } else {
      return <Minus className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getScoreDifference = () => {
    if (!previousScore) return null;

    const diff = score - previousScore;
    const sign = diff > 0 ? "+" : "";
    const color =
      diff > 0
        ? "text-green-500"
        : diff < 0
        ? "text-red-500"
        : "text-muted-foreground";

    return (
      <span className={`text-sm ${color} flex items-center`}>
        {getScoreIcon()}
        <span className="ml-1">
          {sign}
          {formatScore(diff)}
        </span>
      </span>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">Seu WardScore</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {/* Score Display */}
        <div className="space-y-2">
          <div
            className={`text-6xl font-bold tabular-nums ${getScoreColor(
              score
            )} ${isAnimating ? "animate-count-up" : ""}`}
          >
            {formatScore(displayScore)}
          </div>

          {/* Score Comparison */}
          {previousScore && (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Anterior: {formatScore(previousScore)}
              </span>
              {getScoreDifference()}
            </div>
          )}
        </div>

        {/* Score Bar */}
        <div className="relative">
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                score >= 80
                  ? "bg-green-500"
                  : score >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${Math.min(score, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Score Categories */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="h-2 w-full bg-red-200 rounded-full mb-1">
              <div
                className="h-2 bg-red-500 rounded-full"
                style={{ width: "100%" }}
              />
            </div>
            <span className="text-red-600">0-49</span>
            <br />
            <span className="text-muted-foreground">Iniciante</span>
          </div>
          <div className="text-center">
            <div className="h-2 w-full bg-yellow-200 rounded-full mb-1">
              <div
                className="h-2 bg-yellow-500 rounded-full"
                style={{ width: "100%" }}
              />
            </div>
            <span className="text-yellow-600">50-79</span>
            <br />
            <span className="text-muted-foreground">Intermediário</span>
          </div>
          <div className="text-center">
            <div className="h-2 w-full bg-green-200 rounded-full mb-1">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{ width: "100%" }}
              />
            </div>
            <span className="text-green-600">80-100</span>
            <br />
            <span className="text-muted-foreground">Avançado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
