import { NextRequest, NextResponse } from 'next/server'
import { replayQueue } from '@/lib/queue'

// GET - Obter estatísticas da fila
export async function GET(request: NextRequest) {
    try {
        const jobs = replayQueue.getAllJobs()

        const stats = {
            total: jobs.length,
            waiting: jobs.filter(job => job.status === 'waiting').length,
            processing: jobs.filter(job => job.status === 'processing').length,
            completed: jobs.filter(job => job.status === 'completed').length,
            failed: jobs.filter(job => job.status === 'failed').length,

            // Estatísticas de tempo
            averageProcessingTime: calculateAverageProcessingTime(jobs),
            estimatedWaitTime: calculateEstimatedWaitTime(jobs),

            // Jobs recentes
            recentJobs: jobs.slice(0, 10).map(job => ({
                id: job.id,
                fileName: job.fileName,
                status: job.status,
                progress: Math.round(job.progress),
                createdAt: job.createdAt.toISOString(),
                processingTime: job.completedAt && job.startedAt
                    ? job.completedAt.getTime() - job.startedAt.getTime()
                    : null
            }))
        }

        return NextResponse.json({
            success: true,
            data: stats
        })

    } catch (error) {
        console.error('❌ Erro ao obter estatísticas da fila:', error)

        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno'
            },
            { status: 500 }
        )
    }
}

// Calcular tempo médio de processamento
function calculateAverageProcessingTime(jobs: any[]): number {
    const completedJobs = jobs.filter(job =>
        job.status === 'completed' && job.startedAt && job.completedAt
    )

    if (completedJobs.length === 0) return 120 // 2 minutos padrão

    const totalTime = completedJobs.reduce((acc, job) => {
        return acc + (job.completedAt.getTime() - job.startedAt.getTime())
    }, 0)

    return Math.round(totalTime / completedJobs.length / 1000) // em segundos
}

// Calcular tempo estimado de espera
function calculateEstimatedWaitTime(jobs: any[]): number {
    const waitingJobs = jobs.filter(job => job.status === 'waiting').length
    const processingJobs = jobs.filter(job => job.status === 'processing').length

    const avgProcessingTime = calculateAverageProcessingTime(jobs)

    // Se há job processando, considerar tempo restante
    let estimatedTime = 0

    if (processingJobs > 0) {
        // Assumir que job atual está 50% completo em média
        estimatedTime += avgProcessingTime * 0.5
    }

    // Adicionar tempo para jobs na fila
    estimatedTime += waitingJobs * avgProcessingTime

    return Math.max(0, Math.round(estimatedTime))
} 