"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeathHeatmapData } from "@/types";

interface DeathHeatmapProps {
  data: DeathHeatmapData[];
  className?: string;
}

// Skeleton loader para o mapa
function MapSkeleton() {
  return (
    <div className="w-full h-[400px] bg-muted rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-muted-foreground/20 rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando mapa...</p>
      </div>
    </div>
  );
}

export default function DeathHeatmap({ data, className }: DeathHeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    // Simular carregamento do mapa
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && mapRef.current && !map) {
      initializeMap();
    }
  }, [isLoading, map]);

  const initializeMap = async () => {
    try {
      // Implementação mock - em produção seria Mapbox GL JS
      console.log("Inicializando mapa com dados:", data);

      // Mock: criar pontos de calor na div
      if (mapRef.current) {
        mapRef.current.innerHTML = generateHeatmapHTML(data);
        setMap({ mock: true });
      }
    } catch (error) {
      console.error("Erro ao carregar mapa:", error);
    }
  };

  const generateHeatmapHTML = (heatmapData: DeathHeatmapData[]) => {
    const maxIntensity = Math.max(...heatmapData.map((d) => d.intensity));

    const points = heatmapData
      .map((point, index) => {
        const opacity = point.intensity / maxIntensity;
        const size = Math.max(8, (point.intensity / maxIntensity) * 24);

        return `
        <div 
          class="absolute rounded-full bg-red-500 pointer-events-none transition-all duration-300 hover:scale-110"
          style="
            left: ${point.x}%;
            top: ${point.y}%;
            width: ${size}px;
            height: ${size}px;
            opacity: ${opacity};
            transform: translate(-50%, -50%);
            box-shadow: 0 0 ${size}px rgba(239, 68, 68, ${opacity * 0.6});
          "
          title="Morte - Intensidade: ${point.intensity}"
        ></div>
      `;
      })
      .join("");

    return `
      <div class="relative w-full h-full bg-gradient-to-br from-green-900 via-green-800 to-green-700 rounded-lg overflow-hidden">
        <!-- Mapa de Summoner's Rift mock -->
        <div class="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 100" class="w-full h-full">
            <!-- Rio do meio -->
            <path d="M0,50 Q25,30 50,50 Q75,70 100,50" stroke="#4A90E2" stroke-width="2" fill="none"/>
            
            <!-- Jungle areas -->
            <circle cx="25" cy="25" r="8" fill="#2D5A4A" opacity="0.6"/>
            <circle cx="75" cy="75" r="8" fill="#2D5A4A" opacity="0.6"/>
            <circle cx="75" cy="25" r="8" fill="#2D5A4A" opacity="0.6"/>
            <circle cx="25" cy="75" r="8" fill="#2D5A4A" opacity="0.6"/>
            
            <!-- Lanes -->
            <line x1="10" y1="10" x2="90" y2="90" stroke="#8B5A3C" stroke-width="1" opacity="0.4"/>
            <line x1="10" y1="90" x2="90" y2="10" stroke="#8B5A3C" stroke-width="1" opacity="0.4"/>
            <line x1="50" y1="0" x2="50" y2="100" stroke="#8B5A3C" stroke-width="1" opacity="0.4"/>
          </svg>
        </div>
        
        <!-- Pontos de calor -->
        ${points}
        
        <!-- Legenda -->
        <div class="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
          <div class="text-xs font-semibold mb-2">Intensidade de Mortes</div>
          <div class="flex items-center space-x-2">
            <div class="flex space-x-1">
              <div class="w-3 h-3 rounded-full bg-red-500 opacity-30"></div>
              <div class="w-3 h-3 rounded-full bg-red-500 opacity-50"></div>
              <div class="w-3 h-3 rounded-full bg-red-500 opacity-70"></div>
              <div class="w-3 h-3 rounded-full bg-red-500 opacity-100"></div>
            </div>
            <span class="text-xs">Alta</span>
          </div>
        </div>
        
        <!-- Info no canto superior direito -->
        <div class="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white">
          <div class="text-xs">${heatmapData.length} mortes analisadas</div>
        </div>
      </div>
    `;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Mapa de Calor - Mortes</CardTitle>
        </CardHeader>
        <CardContent>
          <MapSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mapa de Calor - Mortes</span>
          <div className="text-sm text-muted-foreground">Summoner's Rift</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="w-full h-[400px] rounded-lg border"
          role="img"
          aria-label="Mapa de calor mostrando localizações de mortes no Summoner's Rift"
        />

        {/* Insights abaixo do mapa */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-semibold text-red-600">
              {data.length}
            </div>
            <div className="text-sm text-muted-foreground">Total de Mortes</div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">
              {Math.round(
                (data.filter((d) => d.y < 50).length / data.length) * 100
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">Lado Azul</div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-semibold text-purple-600">
              {Math.round(
                data.reduce((acc, d) => acc + d.intensity, 0) / data.length
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Intensidade Média
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
