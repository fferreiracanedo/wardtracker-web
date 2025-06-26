"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Shield, Filter } from "lucide-react";
import { WardSuggestion } from "@/types";
import WardSuggestionPin from "./WardSuggestionPin";

interface WardSuggestionsMapProps {
  suggestions: WardSuggestion[];
  className?: string;
}

export default function WardSuggestionsMap({
  suggestions,
  className,
}: WardSuggestionsMapProps) {
  const [selectedType, setSelectedType] = useState<
    "all" | "control" | "vision"
  >("all");
  const [selectedPriority, setSelectedPriority] = useState<
    "all" | "high" | "medium" | "low"
  >("all");
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<WardSuggestion | null>(null);

  const filteredSuggestions = suggestions.filter((suggestion) => {
    const typeMatch =
      selectedType === "all" || suggestion.type === selectedType;
    const priorityMatch =
      selectedPriority === "all" || suggestion.priority === selectedPriority;
    return typeMatch && priorityMatch;
  });

  const getTypeCount = (type: "control" | "vision") => {
    return suggestions.filter((s) => s.type === type).length;
  };

  const getPriorityCount = (priority: "high" | "medium" | "low") => {
    return suggestions.filter((s) => s.priority === priority).length;
  };

  const handleSuggestionClick = (suggestion: WardSuggestion) => {
    setSelectedSuggestion(suggestion);
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Mapa Principal */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sugestões de Wards</span>
              <Badge variant="secondary">
                {filteredSuggestions.length} sugestões
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="mb-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType("all")}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  Todos ({suggestions.length})
                </Button>
                <Button
                  variant={selectedType === "control" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType("control")}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Controle ({getTypeCount("control")})
                </Button>
                <Button
                  variant={selectedType === "vision" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType("vision")}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Visão ({getTypeCount("vision")})
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedPriority === "all" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPriority("all")}
                >
                  Todas Prioridades
                </Button>
                <Button
                  variant={selectedPriority === "high" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPriority("high")}
                  className="text-red-600"
                >
                  Alta ({getPriorityCount("high")})
                </Button>
                <Button
                  variant={
                    selectedPriority === "medium" ? "secondary" : "ghost"
                  }
                  size="sm"
                  onClick={() => setSelectedPriority("medium")}
                  className="text-yellow-600"
                >
                  Média ({getPriorityCount("medium")})
                </Button>
                <Button
                  variant={selectedPriority === "low" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPriority("low")}
                  className="text-green-600"
                >
                  Baixa ({getPriorityCount("low")})
                </Button>
              </div>
            </div>

            {/* Mapa com Pins */}
            <div className="relative w-full h-[400px] bg-gradient-to-br from-green-900 via-green-800 to-green-700 rounded-lg overflow-hidden border">
              {/* Fundo do mapa (mock do Summoner's Rift) */}
              <div className="absolute inset-0 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Rio */}
                  <path
                    d="M0,50 Q25,30 50,50 Q75,70 100,50"
                    stroke="#4A90E2"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Jungle areas */}
                  <circle cx="25" cy="25" r="8" fill="#2D5A4A" opacity="0.6" />
                  <circle cx="75" cy="75" r="8" fill="#2D5A4A" opacity="0.6" />
                  <circle cx="75" cy="25" r="8" fill="#2D5A4A" opacity="0.6" />
                  <circle cx="25" cy="75" r="8" fill="#2D5A4A" opacity="0.6" />
                  {/* Lanes */}
                  <line
                    x1="10"
                    y1="10"
                    x2="90"
                    y2="90"
                    stroke="#8B5A3C"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <line
                    x1="10"
                    y1="90"
                    x2="90"
                    y2="10"
                    stroke="#8B5A3C"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <line
                    x1="50"
                    y1="0"
                    x2="50"
                    y2="100"
                    stroke="#8B5A3C"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  {/* Objetivos */}
                  <circle
                    cx="30"
                    cy="70"
                    r="3"
                    fill="#FFD700"
                    opacity="0.8"
                  />{" "}
                  {/* Dragão */}
                  <circle
                    cx="70"
                    cy="30"
                    r="3"
                    fill="#8A2BE2"
                    opacity="0.8"
                  />{" "}
                  {/* Barão */}
                </svg>
              </div>

              {/* Pins de Sugestão */}
              {filteredSuggestions.map((suggestion) => (
                <WardSuggestionPin
                  key={suggestion.id}
                  suggestion={suggestion}
                  onClick={handleSuggestionClick}
                />
              ))}

              {/* Legenda no canto inferior esquerdo */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
                <div className="text-xs font-semibold mb-2">Legenda</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500 flex items-center justify-center">
                      <Shield className="h-2 w-2 text-blue-600" />
                    </div>
                    <span className="text-xs">Ward de Controle</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-500 flex items-center justify-center">
                      <Eye className="h-2 w-2 text-yellow-600" />
                    </div>
                    <span className="text-xs">Ward de Visão</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Painel Lateral de Detalhes */}
      <div className="space-y-4">
        {/* Sugestão Selecionada */}
        {selectedSuggestion ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                {selectedSuggestion.type === "control" ? (
                  <Shield className="h-5 w-5 text-blue-600" />
                ) : (
                  <Eye className="h-5 w-5 text-yellow-600" />
                )}
                <span>{selectedSuggestion.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    selectedSuggestion.priority === "high"
                      ? "destructive"
                      : selectedSuggestion.priority === "medium"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {selectedSuggestion.priority === "high"
                    ? "Alta"
                    : selectedSuggestion.priority === "medium"
                    ? "Média"
                    : "Baixa"}{" "}
                  Prioridade
                </Badge>
                <Badge variant="outline">
                  {selectedSuggestion.type === "control" ? "Controle" : "Visão"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedSuggestion.description}
              </p>

              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  Posição: {selectedSuggestion.position.x}%,{" "}
                  {selectedSuggestion.position.y}%
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  Clique em um pin no mapa para ver detalhes da sugestão
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resumo das Sugestões */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-semibold text-blue-600">
                  {getTypeCount("control")}
                </div>
                <div className="text-blue-700">Controle</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-semibold text-yellow-600">
                  {getTypeCount("vision")}
                </div>
                <div className="text-yellow-700">Visão</div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Alta Prioridade:</span>
                <span className="font-semibold text-red-600">
                  {getPriorityCount("high")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Média Prioridade:</span>
                <span className="font-semibold text-yellow-600">
                  {getPriorityCount("medium")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Baixa Prioridade:</span>
                <span className="font-semibold text-green-600">
                  {getPriorityCount("low")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
