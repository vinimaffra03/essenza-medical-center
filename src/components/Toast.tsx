// @ts-nocheck
'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react'

const Toast = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false)

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
  }

  const styles = {
    success: 'border-l-4 border-l-green-500',
    error: 'border-l-4 border-l-red-500',
    info: 'border-l-4 border-l-blue-500',
    warning: 'border-l-4 border-l-amber-500',
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onRemove(toast.id)
    }, 300) // Match animation duration
  }

  return (
    <div
      className={`
        flex items-center gap-3 p-4 pr-12 rounded-lg shadow-lg min-w-[320px] max-w-md
        bg-white/90 backdrop-blur-md border border-neutral-100
        transition-all duration-300 ease-out transform
        ${styles[toast.type]}
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0 animate-slide-in-right'}
      `}
      role="alert"
    >
      <div className="flex-shrink-0">
        {icons[toast.type]}
      </div>
      <p className="flex-1 text-sm font-medium text-neutral-700 leading-snug">
        {toast.message}
      </p>
      <button
        onClick={handleClose}
        className="absolute right-3 top-3 p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast

