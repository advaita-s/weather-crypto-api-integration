import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function Home() {
  const [token, setToken] = useState(null)
  const [task, setTask] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'))
    }

    // optional: load static task description (silent fail)
    async function loadTask() {
      try {
        const res = await fetch('/task3.json')
        if (res.ok) {
          const json = await res.json()
          setTask(json)
        }
      } catch (e) {
        // ignore
      }
    }
    loadTask()
  }, [])

  const primaryBtn = { display: 'inline-block', padding: '12px 18px', borderRadius: 12, background: '#2563eb', color: '#fff', fontWeight: 700, textDecoration: 'none' }
  const outlineBtn = { display: 'inline-block', padding: '10px 16px', borderRadius: 12, background: 'transparent', color: '#2563eb', fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(37,99,235,0.12)' }
  const successBtn = { display: 'inline-block', padding: '12px 18px', borderRadius: 12, background: '#2563eb', color: '#fff', fontWeight: 700, textDecoration: 'none' }

  return (
    <Layout>
      <div style={{
        minHeight: '72vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: 1100,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr', // equal columns
          gap: 32,
          alignItems: 'center'
        }}>
          {/* Left side hero (text) */}
          <div style={{ padding: 28 }}>

            <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.05, color: '#0f172a' }}>
              Think, plan, and track — <span style={{ color: '#64748b', fontWeight: 600 }}>all in one place</span>
            </h1>

            <p style={{ marginTop: 18, color: '#6b7280', fontSize: 16 }}>
              Efficiently manage your tasks and test API integrations (weather, crypto and other tasks).
            </p>

            <div style={{ marginTop: 22, display: 'flex', gap: 12, alignItems: 'center' }}>
              {!token ? (
                <>
                  <Link href="/register" style={primaryBtn}>Get free demo</Link>
                  <Link href="/tasks" style={outlineBtn}>View tasks</Link>
                </>
              ) : (
                <>
                  <Link href="/weather" style={successBtn}>Try Weather API</Link>
                  <Link href="/crypto" style={primaryBtn}>Try Crypto</Link>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <div style={{
                background: '#fff',
                padding: 14,
                borderRadius: 12,
                boxShadow: '0 8px 30px rgba(15,23,42,0.04)',
                minWidth: 140
              }}>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Integrations</div>
                <div style={{ marginTop: 8, fontWeight: 700 }}>Weather • Crypto</div>
              </div>

              <div style={{
                background: '#fff',
                padding: 14,
                borderRadius: 12,
                boxShadow: '0 8px 30px rgba(15,23,42,0.04)'
              }}>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Auth</div>
                <div style={{ marginTop: 8, fontWeight: 700 }}>JWT login & roles</div>
              </div>
            </div>
          </div>

          {/* Right side: equal-width glass card (removed Try Weather API inside card) */}
          <div style={{
            alignSelf: 'center',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.98), #fff)',
            borderRadius: 18,
            padding: 28,
            boxShadow: '0 12px 40px rgba(2,6,23,0.06)',
            border: '1px solid rgba(15,23,42,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: '#06b6d4', fontWeight: 700, marginBottom: 6 }}></div>
                <h3 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>{task ? task.title : 'API Integration'}</h3>
              </div>
            </div>

            <div style={{ height: 1, background: 'linear-gradient(90deg,#f1f5f9, #fff)', margin: '14px 0 18px 0' }} />

            <p style={{ color: '#475569', marginTop: 6 }}>
              {task ? task.description : 'A Python script that interacts with an external API to fetch and display data (e.g., weather, cryptocurrency prices). The app fetches data, parses it and displays friendly results to the user.'}
            </p>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700, marginBottom: 8 }}>Objectives</div>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#334155' }}>
                <li>Use the requests library to make GET requests to an API.</li>
                <li>Parse and display the fetched data in a user-friendly format.</li>
                <li>Handle errors, such as failed requests or invalid responses.</li>
              </ul>
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              {/* Keep Try Tasks here; removed Try Weather API inside the card as requested */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
