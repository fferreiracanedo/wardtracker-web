import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthState } from '@/types'
import { apiClient } from '@/lib/api'

interface AuthActions {
    login: (token: string, user: User) => void
    logout: () => void
    setLoading: (loading: boolean) => void
    updateUser: (user: Partial<User>) => void
    checkAuthStatus: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,

            login: (token: string, user: User) => {
                apiClient.setToken(token)
                set({
                    token,
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                })
            },

            logout: () => {
                apiClient.setToken(null)
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading })
            },

            updateUser: (userData: Partial<User>) => {
                const currentUser = get().user
                if (currentUser) {
                    set({
                        user: { ...currentUser, ...userData }
                    })
                }
            },

            checkAuthStatus: async () => {
                try {
                    set({ isLoading: true })
                    const response = await fetch('/api/auth/me')
                    if (response.ok) {
                        const data = await response.json()
                        if (data.isAuthenticated) {
                            set({ isAuthenticated: true, user: data.user, isLoading: false })
                        } else {
                            set({ isAuthenticated: false, user: null, isLoading: false })
                        }
                    } else {
                        set({ isAuthenticated: false, user: null, isLoading: false })
                    }
                } catch (error) {
                    console.error('Falha ao verificar status de autenticação', error)
                    set({ isAuthenticated: false, user: null, isLoading: false })
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)

// Hook personalizado para usar o store de auth
export const useAuth = () => {
    return useAuthStore((state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        login: state.login,
        logout: state.logout,
        setLoading: state.setLoading,
        updateUser: state.updateUser,
        checkAuthStatus: state.checkAuthStatus,
    }))
} 