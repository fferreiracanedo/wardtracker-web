import { NextRequest, NextResponse } from 'next/server'
import { replayQueue } from '@/lib/queue'

// GET - Obter status de um job específico
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const jobId = params.id

        if (!jobId) {
            return NextResponse.json(
                { success: false, message: 'ID do job é obrigatório' },
                { status: 400 }
            )
        }

        const job = replayQueue.getJob(jobId)

        if (!job) {
            return NextResponse.json(
                { success: false, message: 'Job não encontrado' },
                { status: 404 }
            )
        }

        // Calcular tempo estimado restante
        const getEstimatedTime = () => {
            if (job.status === 'completed' || job.status === 'failed') {
                return '0 segundos'
            }

            if (job.status === 'waiting') {
                return '2-5 minutos'
            }

            if (job.status === 'processing') {
                const remaining = 100 - job.progress
                const estimatedSeconds = (remaining / 100) * 120 // Estimar 2 minutos total
                return `${Math.max(10, Math.round(estimatedSeconds))} segundos`
            }

            return 'Calculando...'
        }

        return NextResponse.json({
            success: true,
            data: {
                id: job.id,
                fileName: job.fileName,
                status: job.status,
                progress: Math.round(job.progress),
                estimatedTime: getEstimatedTime(),
                createdAt: job.createdAt.toISOString(),
                startedAt: job.startedAt?.toISOString(),
                completedAt: job.completedAt?.toISOString(),
                error: job.error,
                result: job.result
            }
        })

    } catch (error) {
        console.error('❌ Erro ao obter status do job:', error)

        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno'
            },
            { status: 500 }
        )
    }
} 