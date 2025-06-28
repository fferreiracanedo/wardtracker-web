// Sistema de Queue Mock para processamento de replays

export interface QueueJob {
    id: string
    fileName: string
    status: 'waiting' | 'processing' | 'completed' | 'failed'
    progress: number
    createdAt: Date
    startedAt?: Date
    completedAt?: Date
    error?: string
    result?: any
}

class ReplayQueue {
    private jobs: Map<string, QueueJob> = new Map()
    private processing: boolean = false

    // Adicionar job à queue
    addJob(id: string, fileName: string): QueueJob {
        const job: QueueJob = {
            id,
            fileName,
            status: 'waiting',
            progress: 0,
            createdAt: new Date()
        }

        this.jobs.set(id, job)
        console.log(`📋 Job adicionado à queue: ${id} (${fileName})`)

        // Processar queue automaticamente
        this.processQueue()

        return job
    }

    // Obter status de um job
    getJob(id: string): QueueJob | undefined {
        return this.jobs.get(id)
    }

    // Obter todos os jobs
    getAllJobs(): QueueJob[] {
        return Array.from(this.jobs.values()).sort((a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        )
    }

    // Processar queue (simulado)
    private async processQueue() {
        if (this.processing) return

        const waitingJobs = Array.from(this.jobs.values())
            .filter(job => job.status === 'waiting')
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

        if (waitingJobs.length === 0) return

        this.processing = true
        const job = waitingJobs[0]

        await this.processJob(job)

        this.processing = false

        // Processar próximo job se houver
        setTimeout(() => this.processQueue(), 100)
    }

    // Processar um job específico
    private async processJob(job: QueueJob) {
        console.log(`⚡ Iniciando processamento: ${job.id}`)

        // Atualizar status para processando
        job.status = 'processing'
        job.startedAt = new Date()
        job.progress = 0

        try {
            // Simular fases do processamento
            const phases = [
                { name: 'Validando arquivo', duration: 500, progress: 20 },
                { name: 'Extraindo dados', duration: 1000, progress: 40 },
                { name: 'Analisando wards', duration: 1500, progress: 70 },
                { name: 'Calculando score', duration: 800, progress: 90 },
                { name: 'Finalizando', duration: 300, progress: 100 }
            ]

            for (const phase of phases) {
                console.log(`📊 ${job.id}: ${phase.name}...`)

                // Atualizar progresso gradualmente
                const steps = 5
                const progressIncrement = (phase.progress - job.progress) / steps
                const timeIncrement = phase.duration / steps

                for (let i = 0; i < steps; i++) {
                    await new Promise(resolve => setTimeout(resolve, timeIncrement))
                    job.progress = Math.min(phase.progress, job.progress + progressIncrement)
                }
            }

            // Simular resultado da análise
            const mockResult = this.generateMockAnalysis(job.fileName)

            job.status = 'completed'
            job.progress = 100
            job.completedAt = new Date()
            job.result = mockResult

            console.log(`✅ Processamento concluído: ${job.id}`)

        } catch (error) {
            console.error(`❌ Erro no processamento: ${job.id}`, error)

            job.status = 'failed'
            job.error = error instanceof Error ? error.message : 'Erro desconhecido'
            job.completedAt = new Date()
        }
    }

    // Gerar análise mock
    private generateMockAnalysis(fileName: string) {
        const wardScore = Math.floor(Math.random() * 40) + 60 // 60-100

        return {
            wardScore,
            rank: this.getScoreRank(wardScore),
            gameStats: {
                duration: Math.floor(Math.random() * 20) + 25, // 25-45 min
                wardsPlaced: Math.floor(Math.random() * 15) + 10,
                wardsDestroyed: Math.floor(Math.random() * 8) + 2,
                visionScore: Math.floor(Math.random() * 30) + 40,
                role: ['ADC', 'Support', 'Jungle', 'Mid', 'Top'][Math.floor(Math.random() * 5)]
            },
            insights: this.generateInsights(wardScore),
            heatmapData: this.generateHeatmapData(),
            suggestions: this.generateSuggestions(wardScore)
        }
    }

    // Determinar rank baseado no score
    private getScoreRank(score: number): string {
        if (score >= 90) return 'S+'
        if (score >= 85) return 'S'
        if (score >= 80) return 'A+'
        if (score >= 75) return 'A'
        if (score >= 70) return 'B+'
        if (score >= 65) return 'B'
        return 'C'
    }

    // Gerar insights baseados no score
    private generateInsights(score: number): string[] {
        const allInsights = [
            "Excelente colocação de wards nas entradas da jungle",
            "Boa cobertura de visão nos objetivos principais",
            "Considere melhorar o timing de deep wards",
            "Ótimo controle de visão durante team fights",
            "Melhore a coordenação com o suporte para wards",
            "Coloque mais wards defensivas quando atrás",
            "Excelente uso de control wards",
            "Considere mais wards ofensivas quando à frente",
            "Boa limpeza de wards inimigas",
            "Melhore a visão em transições de lanes"
        ]

        const numInsights = score >= 80 ? 4 : score >= 70 ? 3 : 2
        return allInsights.sort(() => 0.5 - Math.random()).slice(0, numInsights)
    }

    // Gerar dados de heatmap mock
    private generateHeatmapData() {
        const zones = ['river', 'jungle', 'lanes', 'objectives']
        return zones.map(zone => ({
            zone,
            intensity: Math.random(),
            wardsPlaced: Math.floor(Math.random() * 10) + 1,
            efficiency: Math.random()
        }))
    }

    // Gerar sugestões baseadas no score
    private generateSuggestions(score: number): string[] {
        if (score >= 85) {
            return [
                "Continue mantendo essa excelente visão de jogo!",
                "Tente ensinar suas técnicas para o time"
            ]
        } else if (score >= 70) {
            return [
                "Foque mais em deep wards quando seguro",
                "Coordene melhor com seu suporte"
            ]
        } else {
            return [
                "Coloque mais wards básicas primeiro",
                "Foque na visão dos objetivos principais",
                "Assista replays de jogadores profissionais"
            ]
        }
    }

    // Limpar jobs antigos (mais de 1 hora)
    cleanup() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

        Array.from(this.jobs.entries()).forEach(([id, job]) => {
            if (job.createdAt < oneHourAgo) {
                this.jobs.delete(id)
                console.log(`🗑️ Job removido da queue: ${id}`)
            }
        })
    }
}

// Instância singleton da queue
export const replayQueue = new ReplayQueue()

// Auto-cleanup a cada 30 minutos
setInterval(() => {
    replayQueue.cleanup()
}, 30 * 60 * 1000) 