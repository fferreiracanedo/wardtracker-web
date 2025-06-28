# 🗺️ ROADMAP - WardScore Development

> **Guia completo de desenvolvimento para o projeto WardScore**  
> Documento de referência para todas as implementações e melhorias necessárias

---

## 📊 **Status Atual do Projeto**

- ✅ **Frontend Base**: Interface e componentes implementados
- ✅ **Design System**: Cores, tipografia e componentes UI
- ✅ **Mocks**: Simulações funcionais para demonstração
- ❌ **Backend**: API real não implementada
- ❌ **Integração Riot**: Autenticação pendente
- ❌ **Deploy**: Apenas repositório GitHub configurado

**Progresso Geral**: 35% concluído

---

## 🎯 **FASE 1: MVP (Mínimo Produto Viável)**

_Prioridade: 🔥 CRÍTICA - Prazo: 4-6 semanas_

### 🔧 **1.1 Configuração Essencial**

#### ⚙️ **Environment Setup**

- [ ] Criar arquivo `.env.example` com todas as variáveis
- [ ] Configurar `.env.local` para desenvolvimento
- [ ] Documentar process de setup no README
- [ ] Configurar scripts de build para produção

**Variáveis necessárias:**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
API_SECRET_KEY=your_secret_key

# Riot Games API
RIOT_CLIENT_ID=your_riot_client_id
RIOT_CLIENT_SECRET=your_riot_client_secret
RIOT_API_KEY=your_riot_api_key

# Mapbox (para mapas)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wardscore
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# External Services
UPLOADTHING_SECRET=your_uploadthing_secret
STRIPE_SECRET_KEY=your_stripe_secret (para futuro)
```

#### 🎨 **Theme Configuration**

- [ ] Finalizar configuração das cores LoL no `tailwind.config.js`
- [ ] Implementar provider de tema dark/light
- [ ] Testar responsividade em dispositivos móveis
- [ ] Otimizar loading states e transições

### 🔗 **1.2 Backend Development**

#### 🚀 **API Base Structure**

- [ ] Configurar Next.js API Routes ou Express.js separado
- [ ] Implementar middleware de CORS e rate limiting
- [ ] Configurar validação de dados com Zod
- [ ] Implementar error handling global
- [ ] Configurar logging (Winston ou similar)

#### 📦 **Database Setup**

- [ ] Escolher database: PostgreSQL (recomendado) ou MongoDB
- [ ] Configurar ORM: Prisma (PostgreSQL) ou Mongoose (MongoDB)
- [ ] Criar schema para:
  - Usuários (users)
  - Replays (replays)
  - Análises (analyses)
  - Rankings (rankings)
  - Sessões (sessions)

**Schema Exemplo (Prisma):**

```prisma
model User {
  id          String   @id @default(cuid())
  riotId      String   @unique
  username    String
  email       String?
  avatarUrl   String?
  isPro       Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  replays     Replay[]
  analyses    Analysis[]

  @@map("users")
}

model Replay {
  id          String   @id @default(cuid())
  fileName    String
  fileSize    Int
  filePath    String
  uploadedAt  DateTime @default(now())
  status      ReplayStatus

  userId      String
  user        User     @relation(fields: [userId], references: [id])
  analysis    Analysis?

  @@map("replays")
}

model Analysis {
  id          String   @id @default(cuid())
  wardScore   Float
  gameData    Json
  insights    Json
  createdAt   DateTime @default(now())

  replayId    String   @unique
  replay      Replay   @relation(fields: [replayId], references: [id])

  @@map("analyses")
}

enum ReplayStatus {
  UPLOADED
  PROCESSING
  COMPLETED
  FAILED
}
```

#### 🔐 **Authentication System**

- [ ] Implementar OAuth 2.0 com Riot Games API
- [ ] Configurar NextAuth.js ou sistema JWT custom
- [ ] Criar middleware de autenticação
- [ ] Implementar refresh tokens
- [ ] Configurar proteção de rotas

### 📤 **1.3 Upload System**

#### 📁 **File Upload**

- [x] Implementar upload de arquivos .rofl real
- [x] Configurar validação de arquivos (tipo, tamanho)
- [x] Implementar progress tracking real
- [x] Configurar storage: local ou cloud (AWS S3/UploadThing)
- [x] Implementar cleanup de arquivos antigos
- [x] Implementar cancelamento e retry de uploads (frontend + backend)

#### ⚡ **File Processing**

- [x] Pesquisar/implementar parser de arquivos .rofl (mock)
- [x] Criar queue system para processamento (Bull/Agenda)
- [x] Implementar extração de dados do replay (mock)
- [x] Configurar notificações de status (progresso, fases e conclusão)
- [x] Integrar status real da fila na interface de upload

### 📊 **1.4 WardScore Algorithm**

#### 🧮 **Core Algorithm**

- [ ] Definir métricas base do WardScore:
  - Quantidade de wards colocadas
  - Eficiência de posicionamento
  - Tempo de vida das wards
  - Control wards utilizadas
  - Visão negada ao inimigo
- [ ] Implementar cálculo de pontuação (0-100)
- [ ] Criar sistema de pesos por posição/role
- [ ] Implementar normalização por tier/elo

#### 📈 **Metrics Calculation**

- [ ] Extrair timeline de eventos do replay
- [ ] Calcular posicionamento ótimo de wards
- [ ] Análise de heat zones importantes
- [ ] Comparação com dados de jogadores pro

### 🏆 **1.5 Ranking System**

#### 📊 **Basic Ranking**

- [ ] Implementar algoritmo de ranking simples
- [ ] Criar tabelas de leaderboard
- [ ] Implementar filtros por região/tier
- [ ] Configurar update automático de rankings
- [ ] Implementar cache de rankings (Redis)

---

## 🚀 **FASE 2: Core Features**

_Prioridade: 📊 ALTA - Prazo: 6-8 semanas_

### 🗺️ **2.1 Interactive Maps**

#### 🌍 **Mapbox Integration**

- [ ] Configurar Mapbox GL JS com mapas do LoL
- [ ] Implementar sobreposição de dados de ward
- [ ] Criar heatmaps de mortes e posicionamento
- [ ] Implementar zoom e navegação no mapa

#### 📍 **Ward Suggestions**

- [ ] Algoritmo de sugestão de wards
- [ ] Pins interativos no mapa
- [ ] Explicações contextuais para sugestões
- [ ] Sistema de feedback das sugestões

### 📈 **2.2 Advanced Analytics**

#### 🔍 **Detailed Analysis**

- [ ] Análise temporal do WardScore
- [ ] Comparação com outros jogadores
- [ ] Insights personalizado baseados em dados
- [ ] Relatórios de melhoria

#### 📊 **Data Visualization**

- [ ] Gráficos de progresso temporal
- [ ] Charts de comparação
- [ ] Mapas de calor detalhados
- [ ] Visualizações interativas

### 👥 **2.3 Social Features**

#### 🤝 **Player Comparison**

- [ ] Sistema de comparação head-to-head
- [ ] Análise de diferenças de gameplay
- [ ] Recommendations baseadas em comparação
- [ ] Sharing de comparações

#### 📢 **Sharing System**

- [ ] Compartilhamento no Twitter/X
- [ ] Integração com Discord
- [ ] Geração de imagens para social media
- [ ] Links personalizados de análise

---

## ⭐ **FASE 3: Advanced Features**

_Prioridade: 📱 MÉDIA - Prazo: 8-12 semanas_

### 🏅 **3.1 Gamification**

#### 🎖️ **Achievement System**

- [ ] Sistema de conquistas/badges
- [ ] Progressão e XP
- [ ] Challenges semanais/mensais
- [ ] Notificações de achievements

#### 🎮 **User Engagement**

- [ ] Streak system
- [ ] Daily/weekly goals
- [ ] Seasonal competitions
- [ ] Community challenges

### 🤖 **3.2 AI Coaching**

#### 🧠 **AI Insights**

- [ ] Análise de padrões de gameplay
- [ ] Sugestões personalizadas de melhoria
- [ ] Predições de performance
- [ ] Coaching contextual

#### 📚 **Learning System**

- [ ] Tutoriais interativos
- [ ] Guias baseados em análise
- [ ] Video suggestions
- [ ] Progress tracking educacional

### 💳 **3.3 Monetization**

#### 💎 **Premium Features**

- [ ] Planos de assinatura
- [ ] Funcionalidades premium:
  - Análises ilimitadas
  - Histórico extendido
  - Comparações avançadas
  - Coaching AI premium
- [ ] Sistema de trials
- [ ] Gerenciamento de billing

#### 💰 **Payment Integration**

- [ ] Integração com Stripe
- [ ] Múltiplos métodos de pagamento
- [ ] Billing automático
- [ ] Cancelamento e reembolsos

---

## 🚀 **FASE 4: Production & Scale**

_Prioridade: ☁️ BAIXA - Prazo: 12+ semanas_

### 🏗️ **4.1 Infrastructure**

#### ☁️ **Production Deploy**

- [ ] Configurar Vercel/Netlify para frontend
- [ ] Deploy de backend (Railway/Heroku/AWS)
- [ ] Configurar CDN para assets
- [ ] Setup de domínio personalizado

#### 🔒 **Security & Performance**

- [ ] HTTPS/SSL certificates
- [ ] Rate limiting avançado
- [ ] Input sanitization
- [ ] SQL injection protection
- [ ] CSRF protection

#### 📊 **Monitoring & Analytics**

- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] User analytics
- [ ] Server monitoring

### 📱 **4.2 Mobile & PWA**

#### 📲 **Progressive Web App**

- [ ] Service Worker implementation
- [ ] Offline functionality
- [ ] Push notifications
- [ ] App-like experience

#### 📱 **Mobile Optimization**

- [ ] Touch-friendly interface
- [ ] Mobile-specific features
- [ ] App store submission (futuro)

### 🌍 **4.3 Internationalization**

#### 🗣️ **Multi-language Support**

- [ ] i18n configuration
- [ ] Portuguese translations
- [ ] English translations
- [ ] Spanish translations (futuro)

---

## 📋 **CHECKLIST DE DESENVOLVIMENTO**

### 🔧 **Setup Inicial**

- [ ] Configurar ambiente de desenvolvimento
- [ ] Instalar dependências necessárias
- [ ] Configurar database local
- [ ] Testar conexões básicas

### 📝 **Cada Feature**

- [ ] Criar branch específica
- [ ] Implementar funcionalidade
- [ ] Escrever testes (se aplicável)
- [ ] Testar em diferentes dispositivos
- [ ] Code review
- [ ] Merge para main
- [ ] Deploy para staging
- [ ] Testes de QA
- [ ] Deploy para produção

### 🐛 **Debugging Checklist**

- [ ] Error boundaries implementados
- [ ] Logs adequados configurados
- [ ] Fallbacks para erros de rede
- [ ] Estados de loading everywhere
- [ ] Validação de entrada

---

## 🛠️ **FERRAMENTAS E TECNOLOGIAS**

### 📦 **Dependencies a Adicionar**

```bash
# Backend/API
npm install express cors helmet morgan bcryptjs jsonwebtoken
npm install prisma @prisma/client # ou mongoose para MongoDB
npm install zod joi # validação
npm install bull agenda # queue system
npm install nodemailer # emails
npm install multer # file upload

# Frontend adicional
npm install react-query @tanstack/react-query # data fetching
npm install react-hook-form # forms
npm install recharts # charts
npm install framer-motion # animations
npm install next-auth # authentication
npm install uploadthing # file upload (opcional)

# Development
npm install --save-dev vitest @testing-library/react # testing
npm install --save-dev prettier eslint-config-prettier # formatting
```

### 🔧 **Serviços Externos Necessários**

- **Riot Games API**: Developer Account e API Key
- **Mapbox**: Token para mapas
- **Database**: PostgreSQL (Supabase/Railway) ou MongoDB (Atlas)
- **File Storage**: AWS S3, UploadThing, ou similar
- **Email**: SendGrid, Resend, ou similar
- **Monitoring**: Sentry para error tracking
- **Analytics**: Vercel Analytics ou Google Analytics

---

## 📊 **MÉTRICAS DE SUCESSO**

### 🎯 **MVP Goals**

- [ ] Upload funcional de replays .rofl
- [ ] Cálculo básico do WardScore
- [ ] Sistema de ranking simples
- [ ] Autenticação com Riot
- [ ] Deploy em produção

### 📈 **Growth Metrics**

- [ ] 100+ usuários registrados
- [ ] 500+ replays analisados
- [ ] <2s tempo de loading médio
- [ ] > 90% uptime
- [ ] <5% taxa de erro

### 💡 **Innovation Metrics**

- [ ] Algoritmo de WardScore validado
- [ ] Feedback positivo da comunidade
- [ ] Parcerias com streamers/pros
- [ ] Menções em comunidades LoL

---

## 🤝 **CONTRIBUIÇÃO E COLABORAÇÃO**

### 👥 **Roles Necessárias**

- **Backend Developer**: API e database
- **Data Scientist**: Algoritmo WardScore
- **UI/UX Designer**: Melhorias de interface
- **Community Manager**: Engagement e feedback
- **QA Tester**: Testing e bug reports

### 📞 **Contatos e Recursos**

- **Discord**: Servidor da comunidade
- **GitHub**: Issues e pull requests
- **Email**: Contato direto
- **Reddit**: r/leagueoflegends para divulgação

---

**📅 Última atualização**: Maio 2024  
**👨‍💻 Responsável**: [Seu Nome]  
**🔗 Repositório**: [wardtracker-web](https://github.com/fferreiracanedo/wardtracker-web)

---

> 💡 **Dica**: Mantenha este arquivo sempre atualizado conforme o progresso do projeto. Use-o como referência principal para todas as decisões de desenvolvimento!
