import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, TrendingUp, Users, Award } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 px-4 lg:px-8 text-center">
        <div className="absolute inset-0 lol-gradient opacity-10" />
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-lol-gold to-lol-blue bg-clip-text text-transparent">
            WardScore
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Analise seus replays de League of Legends e descubra seu WardScore.
            Melhore sua visão de jogo e suba de elo!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="default"
              className="text-lg px-8"
            >
              <Link href="/upload">
                <Upload className="mr-2 h-5 w-5" />
                Enviar Replay
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8"
            >
              <Link href="/ranking">
                <TrendingUp className="mr-2 h-5 w-5" />
                Ver Ranking
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Como funciona o WardScore?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Upload className="h-12 w-12 mx-auto text-lol-gold mb-4" />
                <CardTitle>1. Envie seu Replay</CardTitle>
                <CardDescription>
                  Faça upload do seu arquivo .rofl direto da pasta Replays do
                  LoL
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 mx-auto text-lol-blue mb-4" />
                <CardTitle>2. Análise Automática</CardTitle>
                <CardDescription>
                  Nossa IA analisa sua visão de jogo, posicionamento de wards e
                  controle de mapa
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 mx-auto text-lol-gold mb-4" />
                <CardTitle>3. Receba sua Nota</CardTitle>
                <CardDescription>
                  Descubra seu WardScore e receba dicas personalizadas para
                  melhorar
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            Junte-se à comunidade WardScore
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-lol-gold mb-2">
                10,000+
              </div>
              <div className="text-muted-foreground">Replays Analisados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-lol-blue mb-2">
                5,000+
              </div>
              <div className="text-muted-foreground">Jogadores Ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-lol-gold mb-2">85%</div>
              <div className="text-muted-foreground">Melhoria no Rank</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para descobrir seu WardScore?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Envie seu primeiro replay agora e comece a melhorar sua visão de
            jogo!
          </p>
          <Button asChild size="lg" variant="default" className="text-lg px-12">
            <Link href="/upload">Começar Agora</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-lol-gold">WardScore</h3>
            <p className="text-sm text-muted-foreground">
              Melhore sua visão de jogo
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacidade
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Termos
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
