import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from './api'
import AuthShell from './AuthShell'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form.username, form.password)
      const token = res.data.access_token ?? res.data.tokens?.access_token
      if (!token) {
        setError('Login succeeded but no token was returned')
        return
      }
      localStorage.setItem('access_token', token)
      const refresh = res.data.refresh_token ?? res.data.tokens?.refresh_token
      if (refresh) localStorage.setItem('refresh_token', refresh)
      navigate('/products', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your products.">
      <form onSubmit={handleSubmit} className="form">
        {error && <div className="alert">{error}</div>}
        <label className="field">
          <span>Username</span>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="username"
            autoComplete="username"
            required
            autoFocus
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </label>
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="switch">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </AuthShell>
  )
}
