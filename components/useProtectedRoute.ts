'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './useAuth'

const PUBLIC_PATHS = new Set([
  '/planner',
  '/journey',
  '/Tools',
  '/rnor',
  '/city',
  '/schools',
  '/housing',
  '/healthcare',
  '/citylife',
  '/jobs',
])

export function useProtectedRoute() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, loading } = useAuth()
  const isPublicPath = PUBLIC_PATHS.has(pathname)

  useEffect(() => {
    if (!isPublicPath && !loading && !isAuthenticated) {
      router.replace(`/auth?mode=signup&next=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, isPublicPath, loading, pathname, router])

  return {
    isAuthenticated,
    loading,
    shouldBlock: isPublicPath ? false : loading || !isAuthenticated,
  }
}
