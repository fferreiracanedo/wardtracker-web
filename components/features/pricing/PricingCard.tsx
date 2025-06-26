"use client";

import { useState } from "react";
import { Check, Zap, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingPlan } from "@/types";
import { toast } from "sonner";

interface PricingCardProps {
  plan: PricingPlan;
  isPopular?: boolean;
  onSelectPlan: (planId: string) => Promise<void>;
}

export default function PricingCard({
  plan,
  isPopular,
  onSelectPlan,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = async () => {
    setIsLoading(true);
    try {
      await onSelectPlan(plan.id);
    } catch (error) {
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = () => {
    switch (plan.id) {
      case "basic":
        return <Zap className="h-6 w-6" />;
      case "pro":
        return <Crown className="h-6 w-6" />;
      case "premium":
        return <Star className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  const getPlanColor = () => {
    switch (plan.id) {
      case "basic":
        return "text-blue-600";
      case "pro":
        return "text-purple-600";
      case "premium":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getButtonVariant = () => {
    if (isPopular) return "default";
    return plan.id === "basic" ? "outline" : "secondary";
  };

  return (
    <Card
      className={`relative transition-all duration-300 hover:shadow-lg ${
        isPopular ? "border-primary shadow-md scale-105" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            Mais Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className={`mx-auto mb-4 ${getPlanColor()}`}>{getPlanIcon()}</div>

        <CardTitle className="text-xl">{plan.name}</CardTitle>

        <div className="space-y-1">
          <div className="text-3xl font-bold">
            {plan.price}
            {plan.id !== "basic" && (
              <span className="text-sm font-normal text-muted-foreground">
                /mês
              </span>
            )}
          </div>

          {plan.id !== "basic" && (
            <CardDescription>Cancele a qualquer momento</CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Features */}
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleSelectPlan}
          disabled={isLoading}
          variant={getButtonVariant()}
          className={`w-full ${
            isPopular ? "bg-primary hover:bg-primary/90" : ""
          }`}
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processando...</span>
            </div>
          ) : plan.id === "basic" ? (
            "Começar Gratuitamente"
          ) : (
            `Assinar ${plan.name}`
          )}
        </Button>

        {plan.id !== "basic" && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Teste grátis por 7 dias • Sem taxas de setup
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
