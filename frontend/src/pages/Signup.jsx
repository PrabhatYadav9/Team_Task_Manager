import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiAlertCircle, FiUser, FiBriefcase } from 'react-icons/fi'
import { motion } from 'framer-motion'
import useStore from '../stores/useStore'
import api from '../services/apiClient'
import Input from '../components/ui/Input'

export default function Signup() {
  const setSession = useStore(state => state.setSession)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('Member')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      const { data } = await api.post('/auth/signup', {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: role,
      })

      setSession({ user: data.user, token: data.token })
      navigate('/dashboard')
    } catch (err) {
      if (!err.response) {
        setError('Network Error: The backend server is not reachable. Please ensure it is running.')
      } else {
        setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative z-10"
      >
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-glow">
              <span className="text-xl font-bold tracking-tighter">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight">TeamTask</span>
          </div>

          <div className="relative z-10 mt-20">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
            >
              Start organizing <br /> your team's work.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 mt-6 text-lg leading-relaxed max-w-sm font-medium"
            >
              Join thousands of teams who are already building better products, faster.
            </motion.p>
          </div>
          
          <div className="relative z-10 mt-12 flex items-center gap-4 text-sm font-medium text-white/60">
            <span>© 2026 TeamTask Inc.</span>
          </div>
        </div>

        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center relative bg-[#071028]/40">
          <div className="max-w-sm w-full mx-auto">
            <h3 className="text-3xl font-bold mb-2 text-white tracking-tight">Create account</h3>
            <p className="text-slate-400 text-sm mb-8 font-medium">Join us and start managing your tasks.</p>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                <FiAlertCircle className="shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <Input 
                label="Full Name" 
                name="name" 
                icon={FiUser} 
                required 
                placeholder="Jane Doe" 
              />

              <Input 
                label="Email" 
                name="email" 
                type="email" 
                icon={FiMail} 
                required 
                placeholder="jane@company.com" 
              />
              
              <Input 
                label="Password" 
                name="password" 
                type="password" 
                icon={FiLock} 
                required 
                placeholder="••••••••" 
              />

              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-[0.2em] mb-2 text-slate-400">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Admin', 'Member'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        role === r 
                          ? 'bg-brand-500/10 border-brand-500 text-brand-400' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-sm font-semibold mb-1">{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                disabled={loading} 
                className="group relative w-full overflow-hidden rounded-xl bg-white text-[#071028] py-3.5 mt-6 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-[#071028]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Creating account...
                  </span>
                ) : 'Create account'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:text-brand-400 transition-colors font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
