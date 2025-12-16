import { useState } from 'react'
import Layout from '../components/Layout'
import api from '../lib/api'

export default function CryptoLookup() {
  const [ids, setIds] = useState('bitcoin,ethereum')
  const [vs, setVs] = useState('usd')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  async function fetchCoins(e) {
    if (e) e.preventDefault()
    setError(null)
    setResults(null)

    const cleanIds = ids.trim()
    if (!cleanIds) {
      setError('Enter one or more coin ids (comma separated)')
      return
    }

    setLoading(true)
    try {
      const res = await api.get(`/api/external/crypto/`, {
        params: {
          ids: cleanIds,
          vs_currency: vs,
        },
        auth: true,
      })

      const prices = res.data && (res.data.prices || res.data)
      if (!prices || Object.keys(prices).length === 0) {
        setError('No data returned for the requested coins.')
      } else {
        setResults(prices)
      }
    } catch (err) {
      setError(err?.response?.data || err?.message || 'Error fetching crypto data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      {/* Page wrapper – same feel as index */}
      <div
        style={{
          minHeight: '72vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 20px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 1100 }}>
          {/* Header section */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: 32, marginBottom: 8 }}>Crypto Price Lookup</h2>
            <p style={{ color: '#64748b' }}>
              Search real-time cryptocurrency prices and 24h changes.
            </p>
          </div>

          {/* Glass card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.96)',
              borderRadius: 18,
              padding: 28,
              boxShadow: '0 20px 60px rgba(2,6,23,0.08)',
              border: '1px solid rgba(15,23,42,0.06)',
            }}
          >
            {/* Search form */}
            <form
              onSubmit={fetchCoins}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 100px',
                gap: 12,
                marginBottom: 24,
              }}
            >
              <input
                value={ids}
                onChange={e => setIds(e.target.value)}
                placeholder="bitcoin, ethereum, solana"
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                }}
              />

              <select
                value={vs}
                onChange={e => setVs(e.target.value)}
                style={{
                  padding: '10px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                }}
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
                <option value="inr">INR</option>
              </select>

              <button
                type="submit"
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                {loading ? 'Fetching…' : 'Fetch'}
              </button>
            </form>

            {/* Error */}
            {error && (
              <div style={{ color: '#ef4444', marginBottom: 16 }}>
                {typeof error === 'string' ? error : JSON.stringify(error)}
              </div>
            )}

            {/* Results table */}
            {results && (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    background: '#fff',
                    borderRadius: 12,
                    overflow: 'hidden',
                  }}
                >
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th style={th}>Coin</th>
                      <th style={th}>Price ({vs.toUpperCase()})</th>
                      <th style={th}>24h Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(results).map(([id, data]) => {
                      const price = data?.[vs]
                      const change = data?.[`${vs}_24h_change`]

                      return (
                        <tr key={id} style={{ borderTop: '1px solid #f1f5f9' }}>
                          <td style={tdCap}>{id}</td>
                          <td style={td}>
                            {typeof price === 'number'
                              ? price.toLocaleString()
                              : '-'}
                          </td>
                          <td
                            style={{
                              ...td,
                              fontWeight: 600,
                              color:
                                typeof change === 'number'
                                  ? change >= 0
                                    ? '#16a34a'
                                    : '#ef4444'
                                  : '#64748b',
                            }}
                          >
                            {typeof change === 'number'
                              ? `${change.toFixed(2)}%`
                              : '-'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!results && !error && (
              <div style={{ color: '#64748b', textAlign: 'center' }}>
                Enter coin names and click <b>Fetch</b> to view prices.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

/* ---------- small style helpers ---------- */
const th = {
  textAlign: 'left',
  padding: 14,
  fontSize: 14,
  color: '#475569',
}

const td = {
  padding: 14,
  fontSize: 15,
}

const tdCap = {
  ...td,
  textTransform: 'capitalize',
  fontWeight: 500,
}
