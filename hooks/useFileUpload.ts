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
        phase: '',
    })
    const [processingJobId, setProcessingJobId] = useState<string | null>(null)
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

    const resetUpload = useCallback(() => {
        setUploadState({
            file: null,
            progress: 0,
            isUploading: false,
            error: null,
            status: 'idle',
            phase: '',
        })
        setProcessingJobId(null)

        // Limpar polling se existir
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
        }
    }, [])

    const cancelUpload = useCallback(async () => {
        // Stop polling immediately
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }

        // If there's a job being processed on the backend, tell it to cancel
        if (processingJobId) {
            try {
                const encodedJobId = encodeURIComponent(processingJobId);
                const response = await fetch(`/api/queue/${encodedJobId}`, {
                    method: 'DELETE',
                });
                const data = await response.json();

                if (response.ok && data.success) {
                    toast.success('Análise cancelada no servidor.');
                } else {
                    toast.warning(data.message || 'Não foi possível cancelar o job no servidor (pode já ter finalizado).');
                }
            } catch (error) {
                toast.error('Erro de comunicação ao tentar cancelar o job.');
            }
        }

        setUploadState(prev => ({
            ...prev,
            isUploading: false,
            status: 'idle',
            progress: 0,
            error: null,
            phase: '',
            file: null, // Limpar o arquivo para um novo upload
        }));
        setProcessingJobId(null);

        toast.info('Operação cancelada.');
    }, [processingJobId]);

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

        // Validar tamanho mínimo (1MB)
        const minSize = 1 * 1024 * 1024 // 1MB
        if (file.size < minSize) {
            return `Arquivo muito pequeno. Replays geralmente têm pelo menos 1MB. Seu arquivo: ${formatFileSize(file.size)}`
        }

        // Validar nome do arquivo
        if (file.name.length > 200) {
            return 'Nome do arquivo muito longo. Máximo 200 caracteres.'
        }

        // Verificar se contém caracteres especiais válidos
        const validNamePattern = /^[a-zA-Z0-9\s\-_.()]+\.rofl$/i
        if (!validNamePattern.test(file.name)) {
            return 'Nome do arquivo contém caracteres inválidos. Use apenas letras, números, espaços e os símbolos: - _ . ( )'
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
                    phase: 'Arquivo enviado! Iniciando processamento...',
                }))
                setProcessingJobId(matchId)

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

    const retryUpload = useCallback(() => {
        if (uploadState.file) {
            uploadFile()
        }
    }, [uploadState.file, uploadFile])

    // Polling do status de processamento
    const startStatusPolling = useCallback((jobId: string) => {
        pollIntervalRef.current = setInterval(async () => {
            try {
                const encodedJobId = encodeURIComponent(jobId);
                const response = await fetch(`/api/queue/${encodedJobId}`)
                const data = await response.json()

                if (data.success) {
                    const job = data.data

                    setUploadState(prev => ({
                        ...prev,
                        progress: job.progress,
                        phase: job.phase,
                    }))

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
                            const encodedRedirectId = encodeURIComponent(jobId);
                            router.push(`/analysis/${encodedRedirectId}`)
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
        uploadState,
        selectFile,
        uploadFile,
        resetUpload,
        cancelUpload,
        retryUpload,
        canUpload: uploadState.file !== null && !uploadState.isUploading,
        jobId: processingJobId,
    }
} 