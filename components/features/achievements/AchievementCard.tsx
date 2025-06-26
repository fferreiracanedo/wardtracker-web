"use client";

import { useState } from "react";
import { Trophy, Star, Crown, Zap, Lock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Achievement } from "@/types";

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: (achievement: Achievement) => void;
}

export default function AchievementCard({
  achievement,
  onClick,
}: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getRarityColor = () => {
    switch (achievement.rarity) {
      case "common":
        return "text-gray-600 bg-gray-100 border-gray-300";
      case "rare":
        return "text-blue-600 bg-blue-100 border-blue-300";
      case "epic":
        return "text-purple-600 bg-purple-100 border-purple-300";
      case "legendary":
        return "text-yellow-600 bg-yellow-100 border-yellow-300";
      default:
        return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  const getRarityIcon = () => {
    switch (achievement.rarity) {
      case "common":
        return <Star className="h-4 w-4" />;
      case "rare":
        return <Zap className="h-4 w-4" />;
      case "epic":
        return <Trophy className="h-4 w-4" />;
      case "legendary":
        return <Crown className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryEmoji = () => {
    switch (achievement.category) {
      case "ward":
        return "👁️";
      case "vision":
        return "🔍";
      case "improvement":
        return "📈";
      case "streak":
        return "🔥";
      case "special":
        return "⭐";
      default:
        return "🏆";
    }
  };

  return (
    <Card
      className={`
        relative transition-all duration-300 cursor-pointer
        ${achievement.isUnlocked ? "hover:shadow-lg" : "opacity-60"}
        ${isHovered ? "scale-105" : ""}
        ${
          achievement.isUnlocked
            ? getRarityColor().split(" ")[2]
            : "border-gray-300"
        }
      `}
      onClick={() => onClick?.(achievement)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect para conquistas desbloqueadas */}
      {achievement.isUnlocked && (
        <div
          className={`absolute inset-0 rounded-lg blur-sm opacity-20 ${
            getRarityColor().split(" ")[1]
          }`}
        ></div>
      )}

      <CardContent className="p-4 relative">
        <div className="flex items-start space-x-4">
          {/* Ícone da Conquista */}
          <div
            className={`
            relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
            ${
              achievement.isUnlocked
                ? getRarityColor()
                : "bg-gray-100 text-gray-400 border border-gray-300"
            }
          `}
          >
            {achievement.isUnlocked ? (
              <span className="text-2xl">{getCategoryEmoji()}</span>
            ) : (
              <Lock className="h-6 w-6" />
            )}

            {/* Badge de desbloqueado */}
            {achievement.isUnlocked && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3
                className={`font-semibold text-sm truncate ${
                  achievement.isUnlocked
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {achievement.title}
              </h3>

              <Badge
                variant="outline"
                className={`ml-2 flex items-center space-x-1 ${getRarityColor()}`}
              >
                {getRarityIcon()}
                <span className="text-xs capitalize">{achievement.rarity}</span>
              </Badge>
            </div>

            <p
              className={`text-xs mb-3 leading-relaxed ${
                achievement.isUnlocked
                  ? "text-muted-foreground"
                  : "text-muted-foreground/70"
              }`}
            >
              {achievement.description}
            </p>

            {/* Progresso */}
            {!achievement.isUnlocked && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="text-muted-foreground">
                    {achievement.progress}%
                  </span>
                </div>
                <Progress value={achievement.progress} className="h-2" />
              </div>
            )}

            {/* Recompensa */}
            {achievement.isUnlocked && (
              <div className="flex items-center space-x-2 text-xs text-green-600">
                <Zap className="h-3 w-3" />
                <span>+{achievement.reward.xp} XP</span>
                {achievement.reward.badge && (
                  <>
                    <span>•</span>
                    <span>Badge: {achievement.reward.badge}</span>
                  </>
                )}
              </div>
            )}

            {/* Data de desbloqueio */}
            {achievement.isUnlocked && achievement.unlockedAt && (
              <div className="mt-2 text-xs text-muted-foreground">
                Desbloqueado em{" "}
                {new Date(achievement.unlockedAt).toLocaleDateString("pt-BR")}
              </div>
            )}
          </div>
        </div>

        {/* Efeito de brilho para conquistas legendárias */}
        {achievement.isUnlocked && achievement.rarity === "legendary" && (
          <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200 to-transparent opacity-20 transform -skew-x-12 animate-pulse"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
