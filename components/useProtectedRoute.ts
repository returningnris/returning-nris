'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './useAuth'

export function useProtectedRoute() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/auth?mode=signup&next=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, loading, pathname, router])

  return {
    isAuthenticated,
    loading,
    shouldBlock: loading || !isAuthenticated,
  }
}
