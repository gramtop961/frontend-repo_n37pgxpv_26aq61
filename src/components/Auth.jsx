import React, { useState } from 'react'
import Input from './ui/Input'
import Button from './ui/Button'
import Spline from '@splinetool/react-spline'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = mode === 'login' ? `${API}/auth/login` : `${API}/auth/signup`
      const body = mode === 'login' ? { email, password } : { name, email, password }
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error((await res.json()).detail || 'Request failed')
      const data = await res.json()
      onAuthed(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-80">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/60" />

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/10">
          <h1 className="text-2xl font-semibold mb-1">Welcome</h1>
          <p className="text-white/70 mb-6">{mode === 'login' ? 'Sign in to continue' : 'Create an account'}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input label="Full name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Alex Doe" />
            )}
            <Input label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
            <Input label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
            {error && <div className="text-red-300 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Please wait…' : (mode === 'login' ? 'Sign in' : 'Create account')}</Button>
          </form>

          <div className="mt-6 text-center text-white/80">
            {mode === 'login' ? (
              <button className="underline" onClick={()=>setMode('signup')}>No account? Sign up</button>
            ) : (
              <button className="underline" onClick={()=>setMode('login')}>Have an account? Log in</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
