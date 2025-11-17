import React, { useEffect, useState } from 'react'
import Auth from './components/Auth'
import Home from './components/Home'
import Confirmation from './components/Confirmation'
import Profile from './components/Profile'

function App(){
  const [user, setUser] = useState(null)
  const [screen, setScreen] = useState('auth') // auth | home | confirm | profile

  useEffect(()=>{
    const cached = localStorage.getItem('user')
    if (cached){
      setUser(JSON.parse(cached))
      setScreen('home')
    }
  }, [])

  function handleAuthed(u){
    setUser(u)
    localStorage.setItem('user', JSON.stringify(u))
    setScreen('home')
  }

  function handleLogout(){
    setUser(null)
    localStorage.removeItem('user')
    setScreen('auth')
  }

  if (screen === 'auth') return <Auth onAuthed={handleAuthed} />
  if (screen === 'confirm') return <Confirmation onDone={()=>setScreen('home')} />
  if (screen === 'profile') return <Profile user={user} onBack={()=>setScreen('home')} onUpdate={(u)=>{ setUser(u); localStorage.setItem('user', JSON.stringify(u)) }} />

  return (
    <Home user={user} onLogout={handleLogout} onConfirmed={()=>setScreen('confirm')} />
  )
}

export default App
