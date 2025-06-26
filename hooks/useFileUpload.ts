import { useState, useCallback } from 'react'
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

    const resetUpload = useCallback(() => {
        setUploadState({
            file: null,
            progress: 0,
            isUploading: false,
            error: null,
            status: 'idle',
        })
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
                setUploadState(prev => ({
                    ...prev,
                    status: 'success',
                    isUploading: false,
                    progress: 100,
                }))

                toast.success('Arquivo enviado com sucesso! Processando análise...')

                // Redirecionar para a página de análise
                const matchId = response.data.matchId
                router.push(`/analysis/${matchId}`)
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

    return {
        ...uploadState,
        selectFile,
        uploadFile,
        resetUpload,
        canUpload: uploadState.file !== null && !uploadState.isUploading,
    }
} 