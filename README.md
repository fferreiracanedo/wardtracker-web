# 🏆 WardScore - Análise Inteligente de League of Legends

<div align="center">

```
✦ ──────────── ✦ ──────────── ✦
      W A R D   S C O R E
     League of Legends Analytics
✦ ──────────── ✦ ──────────── ✦
```

**Transforme sua gameplay com análise de IA**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🚀 Demo](https://wardtracker-client.vercel.app) • [📚 Documentação](docs/) • [🐛 Reportar Bug](issues/) • [💡 Sugerir Feature](issues/)

</div>

## 🎯 Sobre o Projeto

O **WardScore** é uma aplicação web moderna que revoluciona a forma como os jogadores de League of Legends analisam sua performance. Utilizando inteligência artificial avançada, a plataforma calcula uma métrica única - o **WardScore** - que avalia sua visão de jogo, posicionamento estratégico e controle de mapa.

### ✨ Por que usar o WardScore?

- 🔍 **Análise Precisa**: IA que examina cada detalhe do seu replay
- 📊 **Métricas Personalizadas**: WardScore exclusivo baseado em dados profissionais
- 🎯 **Sugestões Inteligentes**: Dicas específicas para seu estilo de jogo
- 🏆 **Sistema de Ranking**: Compare-se com jogadores globalmente
- 📱 **Interface Moderna**: Design responsivo e intuitivo

## 🚀 Funcionalidades

### ✅ Implementadas

| Funcionalidade           | Descrição                            | Status |
| ------------------------ | ------------------------------------ | ------ |
| 📤 **Upload de Replays** | Arraste e solte arquivos .rofl       | ✅     |
| 🧠 **Análise de IA**     | Processamento inteligente de dados   | ✅     |
| 📊 **WardScore Display** | Visualização animada da pontuação    | ✅     |
| 🏆 **Ranking Global**    | Classificação de jogadores           | ✅     |
| 🔗 **Compartilhamento**  | Twitter/X e Discord                  | ✅     |
| 🔐 **Auth Riot**         | Login com conta da Riot Games        | ✅     |
| 📱 **Responsivo**        | Otimizado para todos os dispositivos | ✅     |
| ♿ **Acessibilidade**    | Suporte completo a screen readers    | ✅     |

### 🚧 Em Desenvolvimento

- 🗺️ **Mapas de Calor** - Visualização de hotspots
- 📍 **Sugestões de Wards** - Pins interativos no mapa
- 💳 **Sistema Premium** - Funcionalidades avançadas
- ⚙️ **Configurações** - Painel de privacidade personalizado
- 📈 **Histórico Detalhado** - Análise temporal de performance

## 🛠️ Tecnologias

<div align="center">

| Frontend    | Backend  | Ferramentas    |
| ----------- | -------- | -------------- |
| Next.js 14  | Node.js  | TypeScript     |
| React 18    | Express  | ESLint         |
| TailwindCSS | MongoDB  | Prettier       |
| Zustand     | Riot API | Vercel         |
| Radix UI    | JWT      | GitHub Actions |

</div>

### 🏗️ Arquitetura

```
📁 WardScore/
├── 🎨 app/                    # Rotas e páginas (App Router)
│   ├── page.tsx              # Landing page
│   ├── upload/               # Sistema de upload
│   ├── analysis/             # Análise detalhada
│   ├── ranking/              # Ranking global
│   └── api/                  # API routes
├── 🧩 components/
│   ├── ui/                   # Componentes base
│   └── features/             # Funcionalidades específicas
├── 🎣 hooks/                 # Custom hooks
├── 📚 lib/                   # Utilitários
├── 🗂️ store/                 # Estado global
└── 📝 types/                 # Definições TypeScript
```

## 🚀 Começando

### Pré-requisitos

- **Node.js** 18.0.0 ou superior
- **npm** ou **yarn**
- **Conta Riot Games** (para autenticação)

### 💻 Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/wardtracker-client.git
   cd wardtracker-client
   ```

2. **Instale as dependências**

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env.local
   ```

   Edite `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   RIOT_CLIENT_ID=your_riot_client_id
   RIOT_CLIENT_SECRET=your_riot_client_secret
   ```

4. **Execute o servidor de desenvolvimento**

   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse a aplicação**

   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🎨 Design System

### 🎨 Paleta de Cores

```css
/* Cores Primárias */
--lol-gold: #c8aa6e; /* Dourado League of Legends */
--lol-blue: #0596aa; /* Azul League of Legends */
--lol-dark: #0f1419; /* Escuro League of Legends */

/* Cores Secundárias */
--background: #ffffff; /* Fundo claro */
--foreground: #0f1419; /* Texto principal */
--muted: #f1f5f9; /* Fundos suaves */
--border: #e2e8f0; /* Bordas */
```

### 📐 Componentes

- **shadcn/ui** - Sistema de componentes moderno
- **Radix UI** - Primitivos acessíveis
- **Lucide Icons** - Ícones consistentes
- **Tailwind CSS** - Estilização utilitária

## 📡 API Integration

### 🔗 Principais Endpoints

```typescript
// Upload e análise
POST   /api/upload                 # Upload de replay
GET    /api/analysis/:matchId      # Análise detalhada
GET    /api/player/:summonerName   # Dados do jogador

// Ranking e social
GET    /api/ranking                # Ranking global
GET    /api/leaderboard            # Top jogadores
POST   /api/share                  # Compartilhamento

// Autenticação
POST   /api/auth/riot/callback     # Callback OAuth
GET    /api/auth/user              # Dados do usuário
POST   /api/auth/logout            # Logout
```

### 🔐 Autenticação

Utilizamos **OAuth 2.0** com a Riot Games API para autenticação segura:

```typescript
// Fluxo de autenticação
1. Usuário clica em "Login com Riot"
2. Redirecionamento para Riot OAuth
3. Callback com authorization code
4. Troca por access token
5. Criação de sessão JWT
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📦 Deploy

### 🚀 Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/wardtracker-client)

````

### 🏗️ Build Manual

```bash
# Build de produção
npm run build

# Iniciar servidor
npm run start
````

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Veja como você pode ajudar:

1. 🍴 **Fork** o projeto
2. 🌱 **Crie** uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. ✨ **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. 📤 **Push** para a branch (`git push origin feature/MinhaFeature`)
5. 🔄 **Abra** um Pull Request

### 📋 Diretrizes

- Mantenha o código limpo e bem documentado
- Adicione testes para novas funcionalidades
- Siga os padrões de commit convencionais
- Atualize a documentação quando necessário

## 📈 Roadmap

### 🎯 Próximas Versões

- **v2.0** - Sistema de coaching com IA
- **v2.1** - Análise de team fights
- **v2.2** - Integração com streaming
- **v3.0** - Modo torneios e equipes

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- 🐛 **Issues**: [GitHub Issues](https://github.com/fferreiracanedo/wardtracker-web/issues)

---

<div align="center">

## 👨‍💻 Criador

<img src="https://github.com/fferreiraanedo.png" width="150" height="150" style="border-radius: 50%;" alt="Foto do Criador"/>

### **Mateus - Desenvolvedor Full Stack**

_Apaixonado por tecnologia e League of Legends_ 🎮

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/fferreiracanedo/)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/MateusTechGuy)

> _"Criar ferramentas que ajudam jogadores a melhorar é minha paixão. O WardScore nasceu da necessidade de entender melhor a complexidade da visão de jogo no League of Legends."_

**Especializações:**

- 🔧 **Frontend**: React, Next.js, TypeScript
- ⚙️ **Backend**: Node.js, Python, PostgreSQL
- ☁️ **DevOps**: Docker, AWS, Vercel
- 🎮 **Gaming**: League of Legends, Análise de Dados

---

<sub>⭐ **Gostou do projeto?** Deixe uma estrela no repositório!</sub>

<sub>Feito com ❤️ e muito ☕ por [Mateus](https://github.com/fferreiracanedo)</sub>

</div>
