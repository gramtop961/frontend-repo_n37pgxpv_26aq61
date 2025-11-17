import React, { useEffect, useRef, useState } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'
import { Mic, Image as ImageIcon, Send, Contact, LocateFixed, CheckCircle2, LogOut, User } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Home({ user, onLogout, onConfirmed }) {
  const [text, setText] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const [recording, setRecording] = useState(false)

  async function sendText() {
    if (!text.trim()) return
    setLoading(true)
    const res = await fetch(`${API}/request/text?user_id=${user.id}&text=${encodeURIComponent(text)}`, { method:'POST' })
    setLoading(false)
    if (res.ok) onConfirmed()
  }

  async function sendContact() {
    if (!contactName || !contactPhone) return
    setLoading(true)
    const url = `${API}/request/contact?user_id=${user.id}&contact_name=${encodeURIComponent(contactName)}&contact_phone=${encodeURIComponent(contactPhone)}`
    const res = await fetch(url, { method:'POST' })
    setLoading(false)
    if (res.ok) onConfirmed()
  }

  async function sendLocation() {
    setLoading(true)
    navigator.geolocation.getCurrentPosition(async (pos)=>{
      const { latitude, longitude } = pos.coords
      const url = `${API}/request/location?user_id=${user.id}&lat=${latitude}&lng=${longitude}`
      const res = await fetch(url, { method:'POST' })
      setLoading(false)
      if (res.ok) onConfirmed()
    }, ()=>{
      setLoading(false)
      alert('Location permission denied')
    })
  }

  async function sendPhoto() {
    if (!file) return
    const form = new FormData()
    form.append('user_id', user.id)
    form.append('file', file)
    setLoading(true)
    const res = await fetch(`${API}/request/photo`, { method:'POST', body: form })
    setLoading(false)
    if (res.ok) onConfirmed()
  }

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []

    mediaRecorder.ondataavailable = (e)=>{ if (e.data.size > 0) chunksRef.current.push(e.data) }
    mediaRecorder.onstop = async ()=>{
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const form = new FormData()
      form.append('user_id', user.id)
      form.append('file', new File([blob], 'voice.webm', { type: 'audio/webm' }))
      setLoading(true)
      const res = await fetch(`${API}/request/voice`, { method:'POST', body: form })
      setLoading(false)
      if (res.ok) onConfirmed()
      setRecording(false)
    }

    mediaRecorder.start()
    setRecording(true)
  }

  function stopRecording(){
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-slate-600" />
            <span className="font-medium">Hi, {user.name || user.email}</span>
          </div>
          <button onClick={onLogout} className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-2"><LogOut className="w-4 h-4"/> Logout</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-8">
        <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Send a text message</h2>
          <div className="flex gap-2">
            <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type your message" className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
            <Button onClick={sendText}><Send className="w-4 h-4 mr-2"/>Send</Button>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm grid sm:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-3">Share a photo</h2>
            <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
            <Button className="mt-3" onClick={sendPhoto}><ImageIcon className="w-4 h-4 mr-2"/>Upload Photo</Button>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">Send a voice note</h2>
            {!recording ? (
              <Button onClick={startRecording} variant="subtle"><Mic className="w-4 h-4 mr-2"/>Start Recording</Button>
            ) : (
              <Button onClick={stopRecording} variant="primary"><CheckCircle2 className="w-4 h-4 mr-2"/>Stop & Send</Button>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm grid sm:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-3">Share contact info</h2>
            <div className="grid grid-cols-1 gap-2">
              <Input label="Name" value={contactName} onChange={(e)=>setContactName(e.target.value)} />
              <Input label="Phone" value={contactPhone} onChange={(e)=>setContactPhone(e.target.value)} />
            </div>
            <Button className="mt-3" onClick={sendContact}><Contact className="w-4 h-4 mr-2"/>Send Contact</Button>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">Send your location</h2>
            <Button onClick={sendLocation}><LocateFixed className="w-4 h-4 mr-2"/>Send Location</Button>
          </div>
        </section>

        {loading && <div className="text-center text-slate-600">Processing…</div>}
      </main>
    </div>
  )
}
