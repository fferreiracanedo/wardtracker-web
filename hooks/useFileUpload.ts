import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UploadState } from '@/types'
import { uploadReplay } from '@/lib/api'
import { validateRoflFile, formatFileSize } from '@/lib/utils'

export const useFileUpload = () => {
    const router = useRouter()
    const [uploadState, setUploadState] = useState<UploadState>({
        file: null,
        progress: 0,
        isUploading: false,
        error: null,
        status: 'idle',
    })
    const [processingJobId, setProcessingJobId] = useState<string | null>(null)
    const [processingStatus, setProcessingStatus] = useState<string>('')
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

    const resetUpload = useCallback(() => {
        setUploadState({
            file: null,
            progress: 0,
            isUploading: false,
            error: null,
            status: 'idle',
        })
        setProcessingJobId(null)
        setProcessingStatus('')

        // Limpar polling se existir
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
        }
    }, [])

    const validateFile = useCallback((file: File): string | null => {
        // Validar extensão
        if (!validateRoflFile(file)) {
            return 'Formato inválido. Por favor, envie um arquivo .rofl.'
        }

        // Validar tamanho (máximo 50MB)
        const maxSize = 50 * 1024 * 1024 // 50MB
        if (file.size > maxSize) {
            return `Arquivo muito grande. Tamanho máximo: 50MB. Seu arquivo: ${formatFileSize(file.size)}`
        }

        return null
    }, [])

    const selectFile = useCallback((file: File) => {
        const validationError = validateFile(file)

        if (validationError) {
            setUploadState(prev => ({
                ...prev,
                error: validationError,
                status: 'error',
            }))
            return false
        }

        setUploadState(prev => ({
            ...prev,
            file,
            error: null,
            status: 'idle',
        }))

        return true
    }, [validateFile])

    const uploadFile = useCallback(async () => {
        if (!uploadState.file) {
            toast.error('Nenhum arquivo selecionado')
            return
        }

        setUploadState(prev => ({
            ...prev,
            isUploading: true,
            status: 'uploading',
            progress: 0,
            error: null,
        }))

        try {
            const response = await uploadReplay(
                uploadState.file,
                (progress) => {
                    setUploadState(prev => ({
                        ...prev,
                        progress: Math.round(progress),
                    }))
                }
            )

            if (response.success) {
                const matchId = response.data.matchId

                setUploadState(prev => ({
                    ...prev,
                    status: 'processing',
                    isUploading: true,
                    progress: 100,
                }))

                setProcessingJobId(matchId)
                setProcessingStatus('Arquivo enviado! Iniciando processamento...')

                toast.success('Arquivo enviado com sucesso! Processando análise...')

                // Iniciar polling do status
                startStatusPolling(matchId)
            } else {
                throw new Error(response.message || 'Erro desconhecido no upload')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar arquivo'

            setUploadState(prev => ({
                ...prev,
                isUploading: false,
                error: errorMessage,
                status: 'error',
                progress: 0,
            }))

            toast.error(errorMessage)
        }
    }, [uploadState.file, router])

    // Polling do status de processamento
    const startStatusPolling = useCallback((jobId: string) => {
        pollIntervalRef.current = setInterval(async () => {
            try {
                const response = await fetch(`/api/queue/${jobId}`)
                const data = await response.json()

                if (data.success) {
                    const job = data.data

                    setUploadState(prev => ({
                        ...prev,
                        progress: job.progress,
                    }))

                    // Atualizar status de processamento
                    const statusMap = {
                        'waiting': 'Na fila de processamento...',
                        'processing': `Processando... (${job.progress}%)`,
                        'completed': 'Análise concluída!',
                        'failed': 'Erro no processamento'
                    }

                    setProcessingStatus(statusMap[job.status as keyof typeof statusMap] || 'Processando...')

                    // Se completou ou falhou, parar polling
                    if (job.status === 'completed') {
                        setUploadState(prev => ({
                            ...prev,
                            status: 'success',
                            isUploading: false,
                        }))

                        toast.success('Análise concluída! Redirecionando...')

                        // Parar polling e redirecionar
                        if (pollIntervalRef.current) {
                            clearInterval(pollIntervalRef.current)
                            pollIntervalRef.current = null
                        }

                        setTimeout(() => {
                            router.push(`/analysis/${jobId}`)
                        }, 1500)

                    } else if (job.status === 'failed') {
                        setUploadState(prev => ({
                            ...prev,
                            status: 'error',
                            isUploading: false,
                            error: job.error || 'Erro no processamento'
                        }))

                        toast.error('Erro no processamento: ' + (job.error || 'Erro desconhecido'))

                        // Parar polling
                        if (pollIntervalRef.current) {
                            clearInterval(pollIntervalRef.current)
                            pollIntervalRef.current = null
                        }
                    }
                }
            } catch (error) {
                console.error('Erro ao verificar status:', error)
            }
        }, 2000) // Verificar a cada 2 segundos
    }, [router])

    // Cleanup no unmount
    useEffect(() => {
        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current)
            }
        }
    }, [])

    return {
        ...uploadState,
        selectFile,
        uploadFile,
        resetUpload,
        canUpload: uploadState.file !== null && !uploadState.isUploading,
        processingStatus,
        jobId: processingJobId,
    }
} 