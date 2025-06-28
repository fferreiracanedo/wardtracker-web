// Tipos de usuário
export interface User {
    id: string;
    riotId: string;
    username: string;
    avatarUrl?: string;
    isPro: boolean;
    createdAt: string;
}

// Tipos de replay
export interface ReplayData {
    id: string;
    matchId: string;
    userId: string;
    fileName: string;
    gameMode: string;
    gameVersion: string;
    duration: number;
    wardScore: number;
    uploadedAt: string;
    processedAt?: string;
    status: 'processing' | 'completed' | 'failed';
}

// Tipos de análise
export interface DeathHeatmapData {
    x: number; // Posição X em porcentagem (0-100)
    y: number; // Posição Y em porcentagem (0-100)
    intensity: number; // Intensidade da morte (1-10)
}

export interface WardSuggestion {
    id: string;
    position: {
        x: number;
        y: number;
    };
    type: 'control' | 'vision';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
}

// Tipos de ranking
export interface RankingPlayer {
    rank: number;
    avatarUrl: string;
    name: string;
    score: number;
    gamesPlayed: number;
}

// Tipos de autenticação
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Tipos de configurações
export interface PrivacySettings {
    isPublic: boolean;
    allowDataCollection: boolean;
    showInRanking: boolean;
}

// Tipos de planos
export interface PricingPlan {
    id: string;
    name: string;
    price: string;
    features: string[];
    isPopular?: boolean;
}

// Tipos de upload
export interface UploadState {
    file: File | null;
    progress: number;
    isUploading: boolean;
    error: string | null;
    status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
    phase?: string;
}

// Tipos de API
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export interface ApiError {
    message: string;
    code: string;
    details?: any;
}

// ===== FUNCIONALIDADES EXTRAS =====

// Tipos de Achievements/Conquistas
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'ward' | 'vision' | 'improvement' | 'streak' | 'special';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    requirement: {
        type: 'score' | 'games' | 'improvement' | 'streak' | 'special';
        value: number;
    };
    reward: {
        xp: number;
        badge?: string;
    };
    unlockedAt?: string;
    isUnlocked: boolean;
    progress: number; // 0-100
}

// Tipos de Dashboard Avançado
export interface DashboardMetrics {
    overview: {
        totalGames: number;
        averageWardScore: number;
        bestWardScore: number;
        improvementRate: number;
        currentStreak: number;
    };
    trends: {
        last7Days: number[];
        last30Days: number[];
        wardScoreHistory: { date: string; score: number }[];
    };
    breakdown: {
        byRole: { role: string; games: number; avgScore: number }[];
        byRank: { rank: string; games: number; avgScore: number }[];
        byChampion: { champion: string; games: number; avgScore: number }[];
    };
    achievements: Achievement[];
}

// Tipos de Timeline de Partida
export interface GameEvent {
    id: string;
    timestamp: number; // em segundos
    type: 'ward_placed' | 'ward_destroyed' | 'death' | 'kill' | 'objective' | 'vision_score';
    position?: { x: number; y: number };
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
    wardScore: number; // score naquele momento
}

export interface GameTimeline {
    matchId: string;
    duration: number;
    events: GameEvent[];
    wardScoreProgression: { timestamp: number; score: number }[];
    phases: {
        early: { start: 0; end: 900; avgScore: number }; // 0-15min
        mid: { start: 900; end: 1800; avgScore: number }; // 15-30min
        late: { start: 1800; end: number; avgScore: number }; // 30min+
    };
}

// Tipos de Tema
export interface ThemeSettings {
    mode: 'light' | 'dark' | 'system';
    accentColor: 'default' | 'blue' | 'green' | 'purple' | 'gold';
    compactMode: boolean;
    animations: boolean;
}

// Tipos de Notificações
export interface Notification {
    id: string;
    type: 'achievement' | 'rank_up' | 'analysis_ready' | 'system' | 'coaching';
    title: string;
    message: string;
    icon?: string;
    timestamp: string;
    isRead: boolean;
    actionUrl?: string;
    priority: 'low' | 'medium' | 'high';
}

// Tipos de Comparação de Jogadores
export interface PlayerComparison {
    id: string;
    player1: PlayerProfile;
    player2: PlayerProfile;
    comparison: PlayerComparisonData;
    createdAt: string;
}

export interface PlayerProfile {
    riotId: string;
    gameName: string;
    tagLine: string;
    rank: {
        tier: string;
        division: string;
        lp: number;
    };
    region: string;
    level: number;
    profileIcon: number;
    stats: PlayerStats;
    recentMatches: RecentMatch[];
}

export interface PlayerStats {
    wardScore: {
        current: number;
        average: number;
        trend: "up" | "down" | "stable";
        percentile: number;
    };
    vision: {
        avgVisionScore: number;
        avgWardsPlaced: number;
        avgWardsDestroyed: number;
        avgControlWards: number;
    };
    performance: {
        winRate: number;
        avgKDA: number;
        avgCS: number;
        avgGoldPerMinute: number;
    };
    championMastery: ChampionMastery[];
}

export interface ChampionMastery {
    championId: string;
    championName: string;
    masteryLevel: number;
    masteryPoints: number;
    gamesPlayed: number;
    winRate: number;
    avgWardScore: number;
}

export interface RecentMatch {
    matchId: string;
    champion: string;
    role: string;
    result: "victory" | "defeat";
    wardScore: number;
    duration: number;
    createdAt: string;
    kda: {
        kills: number;
        deaths: number;
        assists: number;
    };
}

export interface PlayerComparisonData {
    overall: {
        advantage: "player1" | "player2" | "equal";
        score: number; // 0-100, 50 sendo igual
    };
    categories: {
        wardScore: ComparisonCategory;
        vision: ComparisonCategory;
        performance: ComparisonCategory;
        consistency: ComparisonCategory;
    };
    headToHead?: {
        matchesPlayed: number;
        player1Wins: number;
        player2Wins: number;
        avgWardScoreDiff: number;
    };
    recommendations: {
        player1: string[];
        player2: string[];
    };
}

export interface ComparisonCategory {
    player1Value: number;
    player2Value: number;
    advantage: "player1" | "player2" | "equal";
    difference: number;
    percentageDiff: number;
}

export interface QueueJob {
    id: string;
    status: 'waiting' | 'processing' | 'completed' | 'failed';
    progress: number;
    phase?: string;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
    result?: any;
}

export interface PlayerAnalysis {
    id: string;
    playerName: string;
    champion: string;
    wardScore: number;
    rank: string;
    gameStats: {
        duration: number;
        wardsPlaced: number;
        wardsDestroyed: number;
        visionScore: number;
        controlWardsPlaced: number;
        role: string;
        kda: string;
        win: boolean;
    };
} 