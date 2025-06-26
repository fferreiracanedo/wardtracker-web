import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
    return score.toFixed(1)
}

export function getScoreColor(score: number): string {
    if (score >= 80) return "text-green-500"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
}

export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

export function validateRoflFile(file: File): boolean {
    return file.name.toLowerCase().endsWith('.rofl')
}

export function generateShareText(wardScore: number, analysisUrl: string): {
    twitter: string;
    discord: string;
} {
    const baseText = `Eu tirei ${wardScore} no meu WardScore! 🎮⚡`

    return {
        twitter: `${baseText} Analise sua partida também: ${analysisUrl}`,
        discord: `${baseText}\nAnalise sua partida também: ${analysisUrl}`
    }
}

export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
} 