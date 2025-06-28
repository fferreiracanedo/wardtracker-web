import { ApiResponse, ApiError } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiClient {
    private baseURL: string
    private token: string | null = null

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    setToken(token: string | null) {
        this.token = token
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        }

        if (this.token) {
            (headers as Record<string, string>).Authorization = `Bearer ${this.token}`
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
                throw new Error(errorData.message || `HTTP ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('API Error:', error)
            throw error
        }
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' })
    }

    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        })
    }

    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        })
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' })
    }

    async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<any>> {
        return new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append('replay', file)

            const xhr = new XMLHttpRequest()

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    const progress = (e.loaded / e.total) * 100
                    onProgress(progress)
                }
            })

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText)
                        resolve(response)
                    } catch (error) {
                        reject(new Error('Erro ao processar resposta'))
                    }
                } else {
                    reject(new Error(`Erro no upload: ${xhr.status}`))
                }
            })

            xhr.addEventListener('error', () => {
                reject(new Error('Erro de conexão'))
            })

            xhr.open('POST', `${this.baseURL}/upload`)

            if (this.token) {
                xhr.setRequestHeader('Authorization', `Bearer ${this.token}`)
            }

            xhr.send(formData)
        })
    }
}

export const apiClient = new ApiClient(API_BASE_URL)

// Funções específicas da API - Upload Real
export async function uploadReplay(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<any>> {
    return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('replay', file)

        const xhr = new XMLHttpRequest()

        // Progress tracking real
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                const progress = (e.loaded / e.total) * 100
                onProgress(progress)
            }
        })

        // Success handler
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText)
                    console.log('✅ Upload bem-sucedido:', response)
                    resolve(response)
                } catch (error) {
                    console.error('❌ Erro ao processar resposta:', error)
                    reject(new Error('Erro ao processar resposta do servidor'))
                }
            } else {
                try {
                    const errorResponse = JSON.parse(xhr.responseText)
                    reject(new Error(errorResponse.message || `Erro HTTP ${xhr.status}`))
                } catch {
                    reject(new Error(`Erro no upload: HTTP ${xhr.status}`))
                }
            }
        })

        // Error handler
        xhr.addEventListener('error', () => {
            console.error('❌ Erro de conexão no upload')
            reject(new Error('Erro de conexão. Verifique sua internet e tente novamente.'))
        })

        // Timeout handler
        xhr.addEventListener('timeout', () => {
            console.error('❌ Timeout no upload')
            reject(new Error('Upload demorou muito. Tente novamente.'))
        })

        // Configure request
        xhr.open('POST', '/api/upload')
        xhr.timeout = 60000 // 60 segundos timeout

        // Send request
        console.log('📤 Iniciando upload:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`)
        xhr.send(formData)
    })
}

export async function getReplayAnalysis(matchId: string) {
    // Simulação de análise para demonstração
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        success: true,
        data: {
            matchId,
            wardScore: 78.5,
            analysis: "Análise mockada para demonstração"
        }
    };
}

export async function getRanking(page = 1, limit = 50) {
    // Simulação de ranking para demonstração
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        success: true,
        data: [
            // Dados mockados já estão sendo usados nas páginas
        ]
    };
}

export async function updatePrivacySettings(settings: any) {
    // Simulação de atualização para demonstração
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        success: true,
        data: settings
    };
}

export async function createStripeSession(planId: string) {
    // Simulação de criação de sessão Stripe para demonstração
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        success: true,
        data: {
            url: `https://checkout.stripe.com/pay/demo-session-${planId}`,
            sessionId: `sess_demo_${planId}_${Date.now()}`
        }
    };
} 