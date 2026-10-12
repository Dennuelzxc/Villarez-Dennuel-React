import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from './api'
import AuthShell from './AuthShell'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.username.trim().length < 3) return setError('Username must be at least 3 characters.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setLoading(true)
    try {
      await register({ username: form.username.trim(), email: form.email.trim(), password: form.password })
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="It only takes a few seconds.">
      <form onSubmit={handleSubmit} className="form">
        {error && <div className="alert">{error}</div>}
        <label className="field">
          <span>Username</span>
          <input value={form.username} onChange={set('username')} placeholder="janedoe" autoComplete="username" required autoFocus />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
        </label>
        <div className="row">
          <label className="field">
            <span>Password</span>
            <input type="password" value={form.password} onChange={set('password')} placeholder="Min. 8 characters" required />
          </label>
          <label className="field">
            <span>Confirm</span>
            <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" required />
          </label>
        </div>
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className="switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthShell>
  )
}
