"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Eye, Users, Database, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePrivacySettings } from "@/hooks/usePrivacySettings";
import { toast } from "sonner";

export default function SettingsPage() {
  const { settings, togglePrivacy, isLoading } = usePrivacySettings();

  const handleToggle = async (key: keyof typeof settings, value: boolean) => {
    try {
      await togglePrivacy(key, value);
    } catch (error) {
      // Erro já é tratado no hook
    }
  };

  const settingsSections = [
    {
      title: "Privacidade do Perfil",
      description: "Configure quem pode ver suas informações",
      icon: <Shield className="h-5 w-5" />,
      settings: [
        {
          key: "isPublic" as const,
          label: "Perfil Público",
          description:
            "Permitir que outros usuários vejam seu perfil e estatísticas",
          value: settings.isPublic,
        },
        {
          key: "showInRanking" as const,
          label: "Aparecer no Ranking",
          description: "Exibir sua posição no ranking global de WardScore",
          value: settings.showInRanking,
        },
      ],
    },
    {
      title: "Dados e Análises",
      description: "Controle como seus dados são utilizados",
      icon: <Database className="h-5 w-5" />,
      settings: [
        {
          key: "allowDataCollection" as const,
          label: "Coleta de Dados",
          description:
            "Permitir coleta de dados para melhorar nossos algoritmos de análise",
          value: settings.allowDataCollection,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              Configurações de Privacidade
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas preferências de privacidade e dados
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Configurações de Privacidade */}
          {settingsSections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {section.icon}
                  <span>{section.title}</span>
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.settings.map((setting, settingIndex) => (
                  <div
                    key={settingIndex}
                    className="flex items-center justify-between space-x-4 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="font-medium">{setting.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {setting.description}
                      </div>
                    </div>
                    <Switch
                      checked={setting.value}
                      onCheckedChange={(checked) =>
                        handleToggle(setting.key, checked)
                      }
                      disabled={isLoading}
                      aria-label={setting.label}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Transparência de Dados</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  🔒 Como protegemos seus dados
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Seus replays são processados de forma anônima</li>
                  <li>• Nunca compartilhamos dados pessoais com terceiros</li>
                  <li>• Você pode excluir seus dados a qualquer momento</li>
                  <li>• Criptografia end-to-end em todas as transmissões</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">
                  📊 Dados que coletamos
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Estatísticas de gameplay dos replays enviados</li>
                  <li>• Informações básicas da conta Riot Games</li>
                  <li>• Dados de uso da plataforma (anonimizados)</li>
                  <li>• Preferências de configuração</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Ações Avançadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Gerenciamento de Conta</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  Baixar Meus Dados
                </Button>
                <Button variant="outline" className="w-full">
                  Histórico de Atividades
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    toast.error("Funcionalidade em desenvolvimento");
                  }}
                >
                  Excluir Conta e Dados
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Esta ação é irreversível. Todos os seus dados serão
                  permanentemente removidos.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status das Configurações */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Configurações salvas automaticamente
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Última atualização: {new Date().toLocaleString("pt-BR")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
