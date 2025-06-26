import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { PrivacySettings } from '@/types'
import { updatePrivacySettings } from '@/lib/api'

export const usePrivacySettings = () => {
    const [settings, setSettings] = useState<PrivacySettings>({
        isPublic: true,
        allowDataCollection: true,
        showInRanking: true,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Carregar configurações atuais
    useEffect(() => {
        // TODO: Implementar carregamento das configurações do usuário
        // loadUserSettings()
    }, [])

    const togglePrivacy = async (key: keyof PrivacySettings, value: boolean) => {
        // Atualização otimista
        const previousSettings = { ...settings }
        const newSettings = { ...settings, [key]: value }
        setSettings(newSettings)
        setError(null)

        try {
            setIsLoading(true)
            const response = await updatePrivacySettings(newSettings)

            if (response.success) {
                toast.success('Configuração atualizada com sucesso!')
            } else {
                throw new Error('Erro ao atualizar configuração')
            }
        } catch (error) {
            // Reverter mudança em caso de erro
            setSettings(previousSettings)

            const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar configuração'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        settings,
        isLoading,
        error,
        togglePrivacy,
    }
} 