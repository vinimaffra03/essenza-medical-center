// @ts-nocheck
'use client'

import React from 'react'

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`
  const isTextArea = type === 'textarea'
  
  // Base classes for input/textarea
  const baseClasses = `
    w-full bg-white border-2 rounded-xl transition-all duration-300
    placeholder:text-neutral-400 text-neutral-900
    focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10
    disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10 hover:border-red-400' 
      : 'border-neutral-200 hover:border-neutral-300'
    }
  `

  const paddingClasses = isTextArea 
    ? 'px-4 py-3'
    : Icon
      ? iconPosition === 'left' ? 'pl-11 pr-4 py-3' : 'pl-4 pr-11 py-3'
      : 'px-4 py-3'

  return (
    <div className="mb-5 group">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-neutral-700 mb-2 transition-colors group-focus-within:text-primary-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none transition-colors group-focus-within:text-primary-500">
            <Icon size={20} />
          </div>
        )}

        {isTextArea ? (
          <textarea
            id={inputId}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${baseClasses} ${paddingClasses} ${className}`}
            {...props}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${baseClasses} ${paddingClasses} ${className}`}
            {...props}
          />
        )}

        {Icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none transition-colors group-focus-within:text-primary-500">
            <Icon size={20} />
          </div>
        )}
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

export default Input

