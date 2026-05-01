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
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-[#071028] rounded-3xl overflow-hidden shadow-card">
        <div className="p-10 hidden lg:flex flex-col justify-center brand-gradient text-white gap-4">
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-sm opacity-90">Manage teams, tasks and projects with a clean, delightful experience.</p>
        </div>

        <div className="p-8 sm:p-12">
          <h3 className="text-2xl font-semibold mb-4">Sign in to your account</h3>
          {error ? <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm">Email</label>
              <input name="email" required type="email" className="mt-2 w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-indigo-400 outline-none" />
            </div>
            <div>
              <label className="text-sm">Password</label>
              <input name="password" required type="password" className="mt-2 w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-indigo-400 outline-none" />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox"/> Remember me</label>
              <Link to="#" className="text-sm text-indigo-500">Forgot?</Link>
            </div>

            <button disabled={loading} className="w-full py-3 rounded-xl brand-gradient text-white font-semibold disabled:opacity-60">{loading ? 'Signing in...' : 'Sign in'}</button>
          </form>

          <p className="mt-6 text-center text-sm">Don’t have an account? <Link to="/signup" className="text-indigo-500">Get started</Link></p>
        </div>
      </div>
    </div>
  )
}
