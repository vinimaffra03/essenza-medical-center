// @ts-nocheck
import React from 'react'
import { Calendar } from 'lucide-react'
import { parseISO } from 'date-fns'

const DateTimePicker = ({ label, value, onChange, required = false, error, className = '' }) => {
  // Helper: ISO string (UTC/Offset) -> datetime-local string (YYYY-MM-DDTHH:mm)
  const toLocalValue = (isoString) => {
    if (!isoString) return ''
    try {
      const date = parseISO(isoString)
      const pad = (num) => String(num).padStart(2, '0')
      const year = date.getFullYear()
      const month = pad(date.getMonth() + 1)
      const day = pad(date.getDate())
      const hours = pad(date.getHours())
      const minutes = pad(date.getMinutes())
      
      return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch {
      return ''
    }
  }

  // Helper: datetime-local string -> ISO string
  const toISOValue = (localValue) => {
    if (!localValue) return ''
    const date = new Date(localValue)
    if (isNaN(date.getTime())) return ''
    return date.toISOString()
  }

  const handleChange = (e) => {
    const newValue = e.target.value
    const isoValue = toISOValue(newValue)
    onChange({ target: { value: isoValue } })
  }

  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
          <Calendar size={20} />
        </div>
        <input
          type="datetime-local"
          value={toLocalValue(value)}
          onChange={handleChange}
          className={`
            w-full pl-11 pr-4 py-3 bg-white border-2 rounded-xl transition-all duration-300 appearance-none
            text-neutral-900 placeholder:text-neutral-400
            focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10
            disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10 hover:border-red-400' 
              : 'border-neutral-200 hover:border-neutral-300'
            }
          `}
          required={required}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium animate-fade-in flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-600" />
          {error}
        </p>
      )}
    </div>
  )
}

export default DateTimePicker