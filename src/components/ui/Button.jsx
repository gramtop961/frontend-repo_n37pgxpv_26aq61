import React from 'react'

export default function Button({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    ghost: 'bg-white/60 hover:bg-white text-gray-800 border border-gray-200',
    subtle: 'bg-slate-900/80 text-white hover:bg-slate-900',
  }
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
