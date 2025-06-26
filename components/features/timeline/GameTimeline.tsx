"use client";

import { useState, useMemo } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Eye,
  Skull,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GameTimeline as GameTimelineType, GameEvent } from "@/types";

interface GameTimelineProps {
  timeline: GameTimelineType;
  className?: string;
}

export default function GameTimeline({
  timeline,
  className,
}: GameTimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);

  // Converter segundos para formato MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Obter eventos visíveis na timeline atual
  const visibleEvents = useMemo(() => {
    const windowSize = 60; // 1 minuto de janela
    return timeline.events.filter(
      (event) => Math.abs(event.timestamp - currentTime) <= windowSize
    );
  }, [timeline.events, currentTime]);

  // Obter score atual baseado no tempo
  const currentScore = useMemo(() => {
    const scoreData =
      timeline.wardScoreProgression.find(
        (item) => item.timestamp <= currentTime
      ) || timeline.wardScoreProgression[0];
    return scoreData?.score || 0;
  }, [timeline.wardScoreProgression, currentTime]);

  const getEventIcon = (type: GameEvent["type"]) => {
    switch (type) {
      case "ward_placed":
      case "vision_score":
        return <Eye className="h-4 w-4" />;
      case "death":
        return <Skull className="h-4 w-4" />;
      case "objective":
        return <Trophy className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getEventColor = (impact: GameEvent["impact"]) => {
    switch (impact) {
      case "positive":
        return "text-green-600 bg-green-100";
      case "negative":
        return "text-red-600 bg-red-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  const handleTimeChange = (newTime: number) => {
    setCurrentTime(newTime);
    setIsPlaying(false);
  };

  const getPhaseInfo = (timestamp: number) => {
    if (timestamp <= 900) return { name: "Early Game", color: "bg-green-500" };
    if (timestamp <= 1800) return { name: "Mid Game", color: "bg-yellow-500" };
    return { name: "Late Game", color: "bg-red-500" };
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Timeline da Partida</span>
          <Badge variant="outline">
            {formatTime(currentTime)} / {formatTime(timeline.duration)}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Controles de Reprodução */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTimeChange(Math.max(0, currentTime - 60))}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleTimeChange(Math.min(timeline.duration, currentTime + 60))
            }
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <Progress
              value={(currentTime / timeline.duration) * 100}
              className="h-2"
            />
          </div>
        </div>

        {/* Informações Atuais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-lol-gold">
                  {currentScore}
                </div>
                <div className="text-sm text-muted-foreground">
                  WardScore Atual
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {getPhaseInfo(currentTime).name}
                </div>
                <div
                  className={`w-full h-2 rounded-full mt-2 ${
                    getPhaseInfo(currentTime).color
                  }`}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {visibleEvents.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Eventos Próximos
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Visual */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

          <div className="space-y-4">
            {visibleEvents.map((event) => (
              <div
                key={event.id}
                className={`relative flex items-start space-x-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedEvent?.id === event.id
                    ? "bg-muted ring-2 ring-primary"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedEvent(event)}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getEventColor(
                    event.impact
                  )}`}
                >
                  {getEventIcon(event.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{event.description}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Score: {event.wardScore}
                    </Badge>
                    {event.position && (
                      <Badge variant="outline" className="text-xs">
                        ({event.position.x}, {event.position.y})
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detalhes do Evento Selecionado */}
        {selectedEvent && (
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Detalhes do Evento</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Tempo:</span>{" "}
                    {formatTime(selectedEvent.timestamp)}
                  </div>
                  <div>
                    <span className="font-medium">WardScore:</span>{" "}
                    {selectedEvent.wardScore}
                  </div>
                  <div>
                    <span className="font-medium">Impacto:</span>
                    <Badge
                      variant="outline"
                      className={`ml-2 ${getEventColor(selectedEvent.impact)}`}
                    >
                      {selectedEvent.impact === "positive"
                        ? "Positivo"
                        : selectedEvent.impact === "negative"
                        ? "Negativo"
                        : "Neutro"}
                    </Badge>
                  </div>
                  {selectedEvent.position && (
                    <div>
                      <span className="font-medium">Posição:</span>(
                      {selectedEvent.position.x}, {selectedEvent.position.y})
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resumo das Fases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-2"></div>
                <div className="font-semibold">Early Game</div>
                <div className="text-sm text-muted-foreground">0-15 min</div>
                <div className="text-lg font-bold mt-1">
                  {timeline.phases.early.avgScore.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Score Médio</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mx-auto mb-2"></div>
                <div className="font-semibold">Mid Game</div>
                <div className="text-sm text-muted-foreground">15-30 min</div>
                <div className="text-lg font-bold mt-1">
                  {timeline.phases.mid.avgScore.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Score Médio</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-2"></div>
                <div className="font-semibold">Late Game</div>
                <div className="text-sm text-muted-foreground">30+ min</div>
                <div className="text-lg font-bold mt-1">
                  {timeline.phases.late.avgScore.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Score Médio</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
