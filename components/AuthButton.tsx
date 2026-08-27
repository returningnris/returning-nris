'use client'



import { useAuth } from './useAuth'
import Link from 'next/link'

export default function AuthButton({ onNavigate }: { onNavigate?: () => void }) {
  const { user, isAuthenticated, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        padding: '6px 16px', 
        color: 'rgba(26,18,8,0.45)',
        fontSize: '13px',
        fontFamily: 'DM Sans, sans-serif' 
      }}>
        ...
      </div>
    )
  }

  if (isAuthenticated && user && user.firstName) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* User Info */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '6px 12px',
          background: 'rgba(255,153,51,0.12)',
          borderRadius: '8px',
          border: '0.5px solid rgba(255,153,51,0.2)',
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#FF9933',
            color: '#1A1208',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
          }}>
            {user.firstName.charAt(0).toUpperCase()}
          </div>
          <span style={{ 
            fontSize: '13px', 
            fontWeight: 500, 
            color: '#1A1208',
            fontFamily: 'DM Sans, sans-serif' 
          }}>
            {user.firstName}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => {
            onNavigate?.()
            void signOut()
          }}
          style={{
            padding: '6px 14px',
            background: '#ffffff',
            border: '1px solid #d8d0c5',
            borderRadius: '8px',
            color: '#625b51',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            transition: 'all .15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f1eb'
            e.currentTarget.style.color = '#1A1208'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff'
            e.currentTarget.style.color = '#625b51'
          }}
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <Link 
      href="/auth"
      onClick={onNavigate}
      style={{
        padding: '6px 18px',
        background: '#FF9933',
        border: 'none',
        borderRadius: '8px',
        color: '#1A1208',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'DM Sans, sans-serif',
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'all .15s',
        boxShadow: '0 2px 12px rgba(255,153,51,0.25)',
      }}
    >
      Sign In
    </Link>
  )
}
