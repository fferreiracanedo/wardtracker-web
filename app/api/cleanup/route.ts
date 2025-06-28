import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const UPLOAD_DIR = './uploads'
const MAX_FILE_AGE = 24 * 60 * 60 * 1000 // 24 horas em millisegundos

// Função para limpar arquivos antigos
async function cleanupOldFiles() {
    if (!existsSync(UPLOAD_DIR)) {
        return { message: 'Diretório de uploads não existe', deletedFiles: 0 }
    }

    try {
        const files = await readdir(UPLOAD_DIR)
        const now = Date.now()
        let deletedCount = 0
        const deletedFiles: string[] = []

        for (const file of files) {
            const filePath = path.join(UPLOAD_DIR, file)

            try {
                const fileStats = await stat(filePath)
                const fileAge = now - fileStats.mtime.getTime()

                // Se o arquivo é mais antigo que MAX_FILE_AGE, deletar
                if (fileAge > MAX_FILE_AGE) {
                    await unlink(filePath)
                    deletedFiles.push(file)
                    deletedCount++
                    console.log(`🗑️ Arquivo deletado: ${file} (${Math.round(fileAge / 1000 / 60 / 60)}h antigo)`)
                }
            } catch (error) {
                console.error(`❌ Erro ao processar arquivo ${file}:`, error)
            }
        }

        return {
            message: `Cleanup concluído. ${deletedCount} arquivo(s) removido(s)`,
            deletedFiles: deletedFiles,
            deletedCount: deletedCount,
            totalFiles: files.length
        }

    } catch (error) {
        console.error('❌ Erro durante cleanup:', error)
        throw new Error('Erro ao executar cleanup de arquivos')
    }
}

// Função para obter estatísticas do diretório
async function getUploadStats() {
    if (!existsSync(UPLOAD_DIR)) {
        return {
            totalFiles: 0,
            totalSize: 0,
            oldestFile: null,
            newestFile: null
        }
    }

    try {
        const files = await readdir(UPLOAD_DIR)
        let totalSize = 0
        let oldestTime = Date.now()
        let newestTime = 0
        let oldestFile = ''
        let newestFile = ''

        for (const file of files) {
            const filePath = path.join(UPLOAD_DIR, file)
            const fileStats = await stat(filePath)

            totalSize += fileStats.size

            if (fileStats.mtime.getTime() < oldestTime) {
                oldestTime = fileStats.mtime.getTime()
                oldestFile = file
            }

            if (fileStats.mtime.getTime() > newestTime) {
                newestTime = fileStats.mtime.getTime()
                newestFile = file
            }
        }

        return {
            totalFiles: files.length,
            totalSize: totalSize,
            totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
            oldestFile: oldestFile ? {
                name: oldestFile,
                date: new Date(oldestTime).toISOString(),
                ageHours: Math.round((Date.now() - oldestTime) / 1000 / 60 / 60)
            } : null,
            newestFile: newestFile ? {
                name: newestFile,
                date: new Date(newestTime).toISOString(),
                ageHours: Math.round((Date.now() - newestTime) / 1000 / 60 / 60)
            } : null
        }
    } catch (error) {
        console.error('❌ Erro ao obter estatísticas:', error)
        throw new Error('Erro ao obter estatísticas dos uploads')
    }
}

// POST - Executar cleanup
export async function POST(request: NextRequest) {
    try {
        const result = await cleanupOldFiles()

        return NextResponse.json({
            success: true,
            data: result
        })
    } catch (error) {
        console.error('❌ Erro no cleanup:', error)

        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno no cleanup'
            },
            { status: 500 }
        )
    }
}

// GET - Obter estatísticas
export async function GET(request: NextRequest) {
    try {
        const stats = await getUploadStats()

        return NextResponse.json({
            success: true,
            data: {
                ...stats,
                config: {
                    maxFileAge: `${MAX_FILE_AGE / 1000 / 60 / 60}h`,
                    uploadDir: UPLOAD_DIR,
                    cleanupThreshold: `Arquivos com mais de ${MAX_FILE_AGE / 1000 / 60 / 60} horas`
                }
            }
        })
    } catch (error) {
        console.error('❌ Erro ao obter estatísticas:', error)

        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao obter estatísticas'
            },
            { status: 500 }
        )
    }
} 