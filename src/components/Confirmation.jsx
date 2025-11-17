import React from 'react'
import Button from './ui/Button'
import { CheckCircle2 } from 'lucide-react'

export default function Confirmation({ onDone }){
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center max-w-md">
        <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4"/>
        <h1 className="text-2xl font-semibold mb-2">Request sent</h1>
        <p className="text-slate-600 mb-6">We received your submission. You can send another item or go back home.</p>
        <Button className="w-full" onClick={onDone}>Back to Home</Button>
      </div>
    </div>
  )
}
