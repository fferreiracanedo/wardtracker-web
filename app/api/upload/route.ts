import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { replayQueue } from '@/lib/queue'

// Configurações do upload
const UPLOAD_DIR = './uploads'
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_EXTENSIONS = ['.rofl']

// Criar diretório de uploads se não existir
async function ensureUploadDir() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true })
    }
}

// Validar arquivo
function validateFile(file: File) {
    // Verificar extensão
    const extension = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
        throw new Error('Formato inválido. Apenas arquivos .rofl são aceitos.')
    }

    // Verificar tamanho
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Arquivo muito grande. Tamanho máximo: 50MB. Seu arquivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
    }

    // Verificar se não está vazio
    if (file.size === 0) {
        throw new Error('Arquivo vazio não é permitido.')
    }
}

// Gerar nome único para o arquivo
function generateFileName(originalName: string) {
    const extension = path.extname(originalName)
    const uniqueId = uuidv4()
    const timestamp = Date.now()
    return `${timestamp}_${uniqueId}${extension}`
}

// Simular processamento do arquivo
async function processReplayFile(filePath: string, fileName: string) {
    // Simular tempo de processamento (1-3 segundos)
    const processingTime = Math.random() * 2000 + 1000
    await new Promise(resolve => setTimeout(resolve, processingTime))

    // Simular análise mockada
    const mockAnalysis = {
        matchId: `BR1_${Date.now()}`,
        fileName: fileName,
        wardScore: Math.floor(Math.random() * 40) + 60, // 60-100
        gameStats: {
            duration: Math.floor(Math.random() * 20) + 25, // 25-45 min
            wardsPlaced: Math.floor(Math.random() * 15) + 10,
            wardsDestroyed: Math.floor(Math.random() * 8) + 2,
            visionScore: Math.floor(Math.random() * 30) + 40,
        },
        insights: [
            "Boa colocação de wards nas entradas da jungle",
            "Considere melhorar o timing de deep wards",
            "Excelente controle de visão nos objetivos"
        ]
    }

    return mockAnalysis
}

export async function POST(request: NextRequest) {
    try {
        // Garantir que o diretório existe
        await ensureUploadDir()

        // Obter dados do form
        const formData = await request.formData()
        const file = formData.get('replay') as File

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'Nenhum arquivo enviado.' },
                { status: 400 }
            )
        }

        // Validar arquivo
        validateFile(file)

        // Gerar nome único
        const fileName = generateFileName(file.name)
        const filePath = path.join(UPLOAD_DIR, fileName)

        // Converter para buffer e salvar
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)

        console.log(`📁 Arquivo salvo: ${filePath} (${file.size} bytes)`)

        // Gerar ID único para análise
        const matchId = `BR1_${Date.now()}`

        // Adicionar à queue de processamento
        const queueJob = replayQueue.addJob(matchId, fileName)

        console.log(`📋 Arquivo adicionado à queue: ${matchId}`)

        return NextResponse.json({
            success: true,
            message: 'Upload realizado com sucesso! Arquivo adicionado à fila de processamento.',
            data: {
                matchId: matchId,
                fileName: file.name,
                fileSize: file.size,
                uploadedAt: new Date().toISOString(),
                queueStatus: queueJob.status,
                estimatedTime: '2-5 minutos'
            }
        })

    } catch (error) {
        console.error('❌ Erro no upload:', error)

        const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor'

        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: error instanceof Error && error.message.includes('Formato inválido') ? 400 : 500 }
        )
    }
}

// Método GET para verificar status da API
export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'API de upload funcionando',
        config: {
            maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
            allowedExtensions: ALLOWED_EXTENSIONS,
            uploadDir: UPLOAD_DIR
        }
    })
} 