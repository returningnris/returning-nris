'use client'



import { useAuth } from './useAuth'
import Link from 'next/link'

export default function AuthButton() {
  const { user, isAuthenticated, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        padding: '6px 16px', 
        color: 'rgba(255,255,255,0.3)', 
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
            color: '#fff',
            fontFamily: 'DM Sans, sans-serif' 
          }}>
            {user.firstName}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={signOut}
          style={{
            padding: '6px 14px',
            background: 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            transition: 'all .15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
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