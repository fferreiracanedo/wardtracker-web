'use client'

import { useState, useEffect } from 'react'
import { ThemeSettings } from '@/types'

const defaultTheme: ThemeSettings = {
    mode: 'system',
    accentColor: 'default',
    compactMode: false,
    animations: true
}

export function useTheme() {
    const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)
    const [isLoading, setIsLoading] = useState(true)

    // Carregar configurações do localStorage
    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('wardScore-theme')
            if (savedTheme) {
                setTheme({ ...defaultTheme, ...JSON.parse(savedTheme) })
            }
        } catch (error) {
            console.error('Erro ao carregar tema:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Aplicar tema no documento
    useEffect(() => {
        if (isLoading) return

        const root = document.documentElement

        // Aplicar modo de cor
        if (theme.mode === 'dark') {
            root.classList.add('dark')
        } else if (theme.mode === 'light') {
            root.classList.remove('dark')
        } else {
            // Sistema - detectar preferência do OS
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (prefersDark) {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
        }

        // Aplicar cor de destaque
        root.setAttribute('data-accent-color', theme.accentColor)

        // Aplicar modo compacto
        if (theme.compactMode) {
            root.classList.add('compact')
        } else {
            root.classList.remove('compact')
        }

        // Aplicar animações
        if (!theme.animations) {
            root.classList.add('no-animations')
        } else {
            root.classList.remove('no-animations')
        }
    }, [theme, isLoading])

    // Salvar tema no localStorage
    const updateTheme = (newTheme: Partial<ThemeSettings>) => {
        const updatedTheme = { ...theme, ...newTheme }
        setTheme(updatedTheme)

        try {
            localStorage.setItem('wardScore-theme', JSON.stringify(updatedTheme))
        } catch (error) {
            console.error('Erro ao salvar tema:', error)
        }
    }

    // Funções de conveniência
    const toggleMode = () => {
        const modes: ThemeSettings['mode'][] = ['light', 'dark', 'system']
        const currentIndex = modes.indexOf(theme.mode)
        const nextIndex = (currentIndex + 1) % modes.length
        updateTheme({ mode: modes[nextIndex] })
    }

    const setAccentColor = (color: ThemeSettings['accentColor']) => {
        updateTheme({ accentColor: color })
    }

    const toggleCompactMode = () => {
        updateTheme({ compactMode: !theme.compactMode })
    }

    const toggleAnimations = () => {
        updateTheme({ animations: !theme.animations })
    }

    return {
        theme,
        isLoading,
        updateTheme,
        toggleMode,
        setAccentColor,
        toggleCompactMode,
        toggleAnimations
    }
} 