import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  setUser: (user: User) => void
  setTokens: (token: string, refreshToken: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (user: User, token: string, refreshToken: string) => void
  logout: () => void
  clearError: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user }),
      
      setTokens: (token, refreshToken) => {
        // Store tokens in localStorage for API service
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
        
        set({ 
          token, 
          refreshToken,
          isAuthenticated: true 
        })
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      login: (user, token, refreshToken) => {
        // Store tokens in localStorage for API service
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
        
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          error: null
        })
      },
      
      logout: () => {
        // Clear tokens from localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null
        })
      },
      
      clearError: () => set({ error: null }),
      
      initializeAuth: () => {
        // Sync localStorage tokens with store on app startup
        const token = localStorage.getItem('token')
        const refreshToken = localStorage.getItem('refreshToken')
        
        if (token && refreshToken) {
          set({ 
            token, 
            refreshToken, 
            isAuthenticated: true 
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
