// frontend/pages/login.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!username || !password) {
      setError('Please enter username and password')
      return
    }

    setLoading(true)
    try {
      const backend = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const res = await fetch(`${backend.replace(/\/$/, '')}/api/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      // Read content-type so we can parse safely
      const ct = res.headers.get('content-type') || ''

      // If not ok, attempt to show the server message (json or text)
      if (!res.ok) {
        if (ct.includes('application/json')) {
          const json = await res.json()
          throw new Error(json.detail || JSON.stringify(json))
        } else {
          const text = await res.text()
          // sometimes Django error pages are long HTML; show first 300 chars
          throw new Error(`Server error ${res.status}: ${text.slice(0, 300)}`)
        }
      }

      // success: parse JSON if possible
      let data = {}
      if (ct.includes('application/json')) {
        data = await res.json()
      } else {
        // backend returned something else unexpectedly
        const text = await res.text()
        throw new Error(`Expected JSON but server returned: ${text.slice(0, 300)}`)
      }

      // store token(s) - common shapes: { access, refresh } or { token } or { access_token }
      if (data.access) localStorage.setItem('token', data.access)
      else if (data.token) localStorage.setItem('token', data.token)
      else if (data.access_token) localStorage.setItem('token', data.access_token)
      else localStorage.setItem('token', JSON.stringify(data))

      if (data.refresh) localStorage.setItem('refresh', data.refresh)

      // redirect home
      router.push('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div style={{ minHeight: '72vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 520, background:'linear-gradient(180deg, rgba(255,255,255,0.98), #fff)', borderRadius:14, padding:28, boxShadow:'0 18px 50px rgba(2,6,23,0.06)', border:'1px solid rgba(15,23,42,0.03)' }}>
          <div style={{ marginBottom:8, fontSize:13, color:'#06b6d4', fontWeight:700 }}>Welcome back</div>
          <h2 style={{ margin:'4px 0 18px 0', fontSize:26, color:'#0f172a' }}>Sign in</h2>

          <form onSubmit={onSubmit} style={{ display:'grid', gap:12 }}>
            <label style={{ fontSize:13, color:'#475569' }}>
              Username
              <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="your username" style={{ width:'100%', marginTop:8, padding:'10px 12px', borderRadius:10, border:'1px solid #e6eef8' }} />
            </label>

            <label style={{ fontSize:13, color:'#475569' }}>
              Password
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" style={{ width:'100%', marginTop:8, padding:'10px 12px', borderRadius:10, border:'1px solid #e6eef8' }} />
            </label>

            {error && <div style={{ color:'#ef4444', fontSize:13 }}>{error}</div>}

            <div style={{ display:'flex', gap:12, marginTop:6 }}>
              <button type="submit" disabled={loading} style={{ padding:'10px 14px', borderRadius:10, background:'#2563eb', color:'#fff', border:'none', fontWeight:700 }}>
                {loading ? 'Signing in…' : 'Login'}
              </button>
            </div>

            <div style={{ marginTop:12, fontSize:14 }}>
              Don't have an account?{' '}
              <Link href="/register" style={{ color:'#2563eb', fontWeight:700, textDecoration:'none' }}>Register</Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
