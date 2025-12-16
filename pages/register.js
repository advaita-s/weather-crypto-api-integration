// frontend/pages/register.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null); setSuccess(null)

    if (!username || !password) {
      setError('Please provide username and password.')
      return
    }
    if (password !== password2) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const backend = 'http://127.0.0.1:8000'  // <- backend address
      const res = await fetch(`${backend}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      // handle non-JSON responses gracefully
      const ct = res.headers.get('content-type') || ''
      if (!res.ok) {
        if (ct.includes('application/json')) {
          const json = await res.json()
          throw new Error(json.detail || JSON.stringify(json))
        } else {
          const text = await res.text()
          throw new Error(`Server returned ${res.status}: ${text.slice(0,200)}`)
        }
      }

      // success - backend should return JSON
      const json = ct.includes('application/json') ? await res.json() : {}
      setSuccess('Account created — please login.')
      setTimeout(() => router.push('/login'), 900)
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div style={{ minHeight: '72vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 520, background: 'linear-gradient(180deg, rgba(255,255,255,0.98), #fff)', borderRadius: 14, padding: 28, boxShadow: '0 18px 50px rgba(2,6,23,0.06)', border: '1px solid rgba(15,23,42,0.03)' }}>
          <div style={{ marginBottom: 8, fontSize: 13, color: '#06b6d4', fontWeight: 700 }}>Create account</div>
          <h2 style={{ margin: '4px 0 18px 0', fontSize: 26, color: '#0f172a' }}>Register</h2>

          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
            <label style={{ fontSize: 13, color: '#475569' }}>
              Username
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="choose a username" style={{ width: '100%', marginTop: 8, padding: '10px 12px', borderRadius: 10, border: '1px solid #e6eef8' }} />
            </label>

            <label style={{ fontSize: 13, color: '#475569' }}>
              Password
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="choose a password" style={{ width: '100%', marginTop: 8, padding: '10px 12px', borderRadius: 10, border: '1px solid #e6eef8' }} />
            </label>

            <label style={{ fontSize: 13, color: '#475569' }}>
              Confirm password
              <input value={password2} onChange={e => setPassword2(e.target.value)} type="password" placeholder="confirm password" style={{ width: '100%', marginTop: 8, padding: '10px 12px', borderRadius: 10, border: '1px solid #e6eef8' }} />
            </label>

            {error && <div style={{ color: '#ef4444', fontSize: 13 }}>{error}</div>}
            {success && <div style={{ color: '#16a34a', fontSize: 13 }}>{success}</div>}

            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
              <button type="submit" disabled={loading} style={{ padding: '10px 14px', borderRadius: 10, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700 }}>
                {loading ? 'Creating…' : 'Register'}
              </button>

              <Link href="/login" style={{ textDecoration: 'none' }}>
                <span style={{ display: 'inline-block', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(37,99,235,0.08)', color: '#2563eb', fontWeight: 700 }}>Already have account?</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
