import { useState } from 'react'
import Layout from '../components/Layout'
import api from '../lib/api'

export default function WeatherPage() {
  const [city, setCity] = useState('London')
  const [units, setUnits] = useState('metric')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)

  async function fetchWeather(e) {
    e?.preventDefault()
    setErr(null)
    setLoading(true)
    setResult(null)

    try {
      const res = await api.get(
        `/api/external/weather/?city=${encodeURIComponent(city)}&units=${units}`,
        { auth: true }
      )
      setResult(res.data)
    } catch (e) {
      setErr(e.response?.data || 'Error fetching weather')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      {/* Page wrapper – same as crypto */}
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
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: 32, marginBottom: 8 }}>
              Weather Lookup
            </h2>
            <p style={{ color: '#64748b' }}>
              Get real-time weather details for any city.
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
            {/* Form */}
            <form
              onSubmit={fetchWeather}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 160px 100px',
                gap: 12,
                marginBottom: 24,
              }}
            >
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Enter city (e.g. London)"
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                }}
              />

              <select
                value={units}
                onChange={e => setUnits(e.target.value)}
                style={{
                  padding: '10px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                }}
              >
                <option value="metric">Metric (°C)</option>
                <option value="imperial">Imperial (°F)</option>
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
                {loading ? 'Fetching…' : 'Get'}
              </button>
            </form>

            {/* Loading */}
            {loading && (
              <div style={{ color: '#64748b', marginBottom: 12 }}>
                Loading weather data…
              </div>
            )}

            {/* Error */}
            {err && (
              <div style={{ color: '#ef4444', marginBottom: 16 }}>
                {typeof err === 'string' ? err : JSON.stringify(err)}
              </div>
            )}

            {/* Result card */}
            {result && (
              <div
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: 20,
                  boxShadow: '0 10px 30px rgba(2,6,23,0.06)',
                  border: '1px solid rgba(15,23,42,0.05)',
                }}
              >
                <h3 style={{ marginBottom: 12 }}>
                  {result.city}
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 16,
                  }}
                >
                  <Info label="Weather" value={result.weather} />
                  <Info
                    label="Temperature"
                    value={`${result.temperature} ${
                      units === 'metric' ? '°C' : '°F'
                    }`}
                  />
                  <Info
                    label="Feels Like"
                    value={`${result.feels_like}`}
                  />
                  <Info
                    label="Humidity"
                    value={`${result.humidity}%`}
                  />
                  <Info
                    label="Wind Speed"
                    value={`${result.wind_speed}`}
                  />
                </div>
              </div>
            )}

            {!result && !loading && !err && (
              <div style={{ color: '#64748b', textAlign: 'center' }}>
                Enter a city and click <b>Get</b> to see weather details.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

/* ---------- small helper component ---------- */
function Info({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600 }}>{value}</div>
    </div>
  )
}
