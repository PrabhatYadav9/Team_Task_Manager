import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import api from '../services/apiClient'

export default function Login(){
  const setSession = useStore(state => state.setSession)
  const navigate = useNavigate()
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      const { data } = await api.post('/auth/login', {
        email: formData.get('email'),
        password: formData.get('password'),
      })

      setSession({ user: data.user, token: data.token })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 glass-card rounded-3xl overflow-hidden relative z-10">
        <div className="p-10 hidden lg:flex flex-col justify-center bg-gradient-to-br from-brand-600 to-cyan-600 text-white gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-white/80 mt-2 leading-relaxed">Manage teams, tasks and projects with a clean, delightful experience.</p>
          </div>
        </div>

        <div className="p-8 sm:p-12 bg-surface/50 backdrop-blur-md">
          <h3 className="text-2xl font-semibold mb-6 text-white">Sign in to your account</h3>
          {error ? <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div> : null}
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input name="email" required type="email" className="mt-2 w-full p-3 rounded-lg border border-white/10 bg-black/50 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Password</label>
              <input name="password" required type="password" className="mt-2 w-full p-3 rounded-lg border border-white/10 bg-black/50 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" />
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" className="rounded border-white/10 bg-black/50 text-brand-500 focus:ring-brand-500"/> Remember me</label>
              <Link to="#" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">Forgot?</Link>
            </div>

            <button disabled={loading} className="w-full py-3 mt-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold disabled:opacity-60 transition-colors shadow-glow">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">Don’t have an account? <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Get started</Link></p>
        </div>
      </div>
    </div>
  )
}
