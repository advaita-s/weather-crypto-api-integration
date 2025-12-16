import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Layout({ children }) {
  const [token, setToken] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'))
      const onStorage = (e) => {
        if (e.key === 'token') setToken(e.newValue)
      }
      window.addEventListener('storage', onStorage)
      return () => window.removeEventListener('storage', onStorage)
    }
  }, [])

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      setToken(null)
      window.location.href = '/'
    }
  }

  const navLinkStyle = {
    padding: '8px 14px',
    borderRadius: 10,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    color: '#334155',
    background: '#f1f5f9',
    transition: 'all 0.2s ease',
  }

  return (
    <div
      style={{
        fontFamily:
          'Inter, system-ui, -apple-system, Roboto, "Segoe UI", Arial',
        minHeight: '100vh',
        background: '#f7f8fb',
        color: '#0f172a',
      }}
    >
      {/* NAVBAR */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 24px',
          borderBottom: '1px solid #e6e9ee',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: '#4f46e5',
              cursor: 'pointer',
            }}
          >
            Weather & Crypto API
          </span>
        </Link>

        {/* Nav links */}
        <nav
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          {token ? (
            <>
              <Link href="/weather" style={navLinkStyle}>
                Weather
              </Link>

              <Link href="/crypto" style={navLinkStyle}>
                Crypto
              </Link>

              <button
                onClick={logout}
                style={{
                  padding: '8px 14px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={navLinkStyle}>
                Login
              </Link>
              <Link href="/register" style={navLinkStyle}>
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
        {children}
      </main>
    </div>
  )
}
