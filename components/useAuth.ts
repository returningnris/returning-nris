'use client'

import { useState, useEffect } from 'react'

export interface User {
  firstName: string
  lastName: string
  email: string
  password: string
  createdAt: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    
    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'back2india_auth' || e.key === 'back2india_user') {
        checkAuth()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const authStatus = localStorage.getItem('back2india_auth')
      const userData = localStorage.getItem('back2india_user')
      
      console.log('[useAuth] Checking auth:', { authStatus, userData: userData ? 'exists' : 'missing' })
      
      if (authStatus === 'true' && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          console.log('[useAuth] User authenticated:', parsedUser.email)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (err) {
          console.error('[useAuth] Error parsing user data:', err)
          setIsAuthenticated(false)
          setUser(null)
        }
      } else {
        console.log('[useAuth] Not authenticated')
        setIsAuthenticated(false)
        setUser(null)
      }
    }
    setLoading(false)
  }

  const signOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('back2india_auth')
      // Keep user data for re-login
      setUser(null)
      setIsAuthenticated(false)
      window.location.href = '/'
    }
  }

  return { user, isAuthenticated, loading, signOut, checkAuth }
}