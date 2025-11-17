import React, { useEffect, useState } from 'react'
import Input from './ui/Input'
import Button from './ui/Button'
import { User2 } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Profile({ user, onBack, onUpdate }){
  const [name, setName] = useState(user.name || '')
  const [photoUrl, setPhotoUrl] = useState(user.photo_url || '')
  const [saving, setSaving] = useState(false)

  async function save(){
    setSaving(true)
    const res = await fetch(`${API}/profile/${user.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, photo_url: photoUrl }) })
    setSaving(false)
    if (res.ok) {
      const data = await res.json()
      onUpdate(data)
      onBack()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-md mx-auto p-4">
        <button onClick={onBack} className="text-blue-600">← Back</button>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mt-3">
          <div className="flex items-center gap-3 mb-4">
            <User2 className="w-6 h-6 text-slate-600"/>
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <div className="space-y-3">
            <Input label="Display name" value={name} onChange={(e)=>setName(e.target.value)} />
            <Input label="Avatar URL" value={photoUrl} onChange={(e)=>setPhotoUrl(e.target.value)} />
            <Button className="w-full" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
