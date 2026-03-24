'use client'

import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function applySession(session: Session | null) {
      if (!session?.user) {
        if (!active) return
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      const sessionUser = session.user
      const fallbackFirstName =
        typeof sessionUser.user_metadata?.first_name === 'string'
          ? sessionUser.user_metadata.first_name
          : typeof sessionUser.user_metadata?.full_name === 'string'
            ? sessionUser.user_metadata.full_name
            : typeof sessionUser.user_metadata?.name === 'string'
              ? sessionUser.user_metadata.name
              : ''
      const fallbackLastName =
        typeof sessionUser.user_metadata?.last_name === 'string' ? sessionUser.user_metadata.last_name : ''

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, created_at')
        .eq('id', sessionUser.id)
        .maybeSingle()

      if (!active) return

      setUser({
        id: sessionUser.id,
        firstName: profile?.first_name || fallbackFirstName,
        lastName: profile?.last_name || fallbackLastName,
        email: sessionUser.email || '',
        createdAt: profile?.created_at || sessionUser.created_at || new Date().toISOString(),
      })
      setIsAuthenticated(true)
      setLoading(false)
    }

    async function checkAuth() {
      setLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()
      await applySession(session)
    }

    void checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const checkAuth = async () => {
    setLoading(true)
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, created_at')
      .eq('id', session.user.id)
      .maybeSingle()

    setUser({
      id: session.user.id,
      firstName:
        profile?.first_name ||
        session.user.user_metadata?.first_name ||
        session.user.user_metadata?.full_name ||
        session.user.user_metadata?.name ||
        '',
      lastName: profile?.last_name || session.user.user_metadata?.last_name || '',
      email: session.user.email || '',
      createdAt: profile?.created_at || session.user.created_at || new Date().toISOString(),
    })
    setIsAuthenticated(true)
    setLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  return { user, isAuthenticated, loading, signOut, checkAuth }
}
