import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthState } from '@/types'
import { apiClient } from '@/lib/api'

interface AuthActions {
    login: (token: string, user: User) => void
    logout: () => void
    setLoading: (loading: boolean) => void
    updateUser: (user: Partial<User>) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

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
    }))
} 