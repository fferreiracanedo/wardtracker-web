"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Zap,
  Crown,
  Star,
  Shield,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PricingCard from "@/components/features/pricing/PricingCard";
import { PricingPlan } from "@/types";
import { toast } from "sonner";

const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Gratuito",
    price: "R$ 0",
    features: [
      "Análise de até 5 replays por mês",
      "WardScore básico",
      "Comparação com média do rank",
      "Acesso ao ranking público",
      "Suporte por email",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 19,90",
    isPopular: true,
    features: [
      "Análise ilimitada de replays",
      "WardScore avançado com insights detalhados",
      "Mapas de calor personalizados",
      "Sugestões de wards com IA",
      "Histórico completo de partidas",
      "Exportação de relatórios",
      "Suporte prioritário",
      "Acesso antecipado a novos recursos",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 39,90",
    features: [
      "Tudo do plano Pro",
      "Análise de equipe completa",
      "Coaching personalizado com IA",
      "Comparação com jogadores profissionais",
      "API para desenvolvedores",
      "Dashboard para times",
      "Suporte 24/7 via chat",
      "Sessões de coaching 1:1 (2x/mês)",
    ],
  },
];

export default function PricingPage() {
  const handleSelectPlan = async (planId: string) => {
    if (planId === "basic") {
      toast.success("Plano gratuito ativado! Comece a usar agora.");
      return;
    }

    // Simular integração com Stripe
    try {
      toast.loading("Redirecionando para pagamento...");

      // Em produção, aqui seria a integração real com Stripe
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock de sucesso
      toast.success(`Redirecionando para checkout do plano ${planId}`);

      // Aqui seria o redirect para o Stripe Checkout
      // window.location.href = stripeCheckoutUrl
    } catch (error) {
      throw new Error("Erro ao processar pagamento");
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>

          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              Escolha o Plano Ideal para Você
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Melhore sua visão de jogo com nossas análises avançadas. Comece
              gratuitamente e evolua conforme sua necessidade.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isPopular={plan.isPopular}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Perguntas Frequentes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Como funciona o teste grátis?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Você tem 7 dias para testar todos os recursos premium
                  gratuitamente. Cancele a qualquer momento sem cobrança.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Posso trocar de plano?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sim! Você pode fazer upgrade ou downgrade do seu plano a
                  qualquer momento. Mudanças são aplicadas no próximo ciclo de
                  cobrança.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Quais são as formas de pagamento?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Aceitamos cartão de crédito, débito, PIX e boleto bancário.
                  Todos os pagamentos são processados com segurança pelo Stripe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Há garantia de reembolso?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oferecemos garantia de reembolso de 30 dias para todos os
                  planos pagos. Sem perguntas, sem complicações.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t pt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-4">
              Por que escolher o WardScore?
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Seguro e Confiável</h4>
              <p className="text-sm text-muted-foreground">
                Pagamentos seguros processados pelo Stripe. Seus dados estão
                protegidos com criptografia de ponta.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Análises Avançadas</h4>
              <p className="text-sm text-muted-foreground">
                IA treinada com milhões de replays profissionais para análises
                precisas e insights únicos.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Headphones className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Suporte Excepcional</h4>
              <p className="text-sm text-muted-foreground">
                Nossa equipe está sempre disponível para ajudar você a melhorar
                seu gameplay.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold mb-4">
            Pronto para melhorar seu WardScore?
          </h3>
          <p className="text-muted-foreground mb-6">
            Comece gratuitamente e veja a diferença em suas partidas
          </p>
          <Button size="lg" onClick={() => handleSelectPlan("basic")}>
            Começar Agora Gratuitamente
          </Button>
        </div>
      </div>
    </div>
  );
}
