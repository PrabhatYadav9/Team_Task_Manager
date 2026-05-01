import { create } from 'zustand'

const initialTheme = localStorage.getItem('theme') || 'dark'
if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const initialUser = (() => {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
})()

const useStore = create((set) => ({
  user: initialUser,
  token: localStorage.getItem('token') || null,
  theme: initialTheme,
  setSession: ({ user, token }) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    set(() => ({ user, token }))
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    set(() => ({ user: null, token: null }))
  },
  toggleTheme: () => set((state) => {
    const next = state.theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    return { theme: next }
  }),
}))

export default useStore
