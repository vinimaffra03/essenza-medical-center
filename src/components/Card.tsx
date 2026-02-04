// @ts-nocheck
'use client'

import React from 'react'

const Card = ({ children, className = '', hover = false, glass = false, ...props }) => {
  const baseStyles = 'rounded-2xl p-6'
  const styleClasses = glass 
    ? 'glass-effect shadow-soft' 
    : 'bg-white shadow-soft'
  const hoverClasses = hover ? 'card-hover' : ''

  return (
    <div
      className={`${baseStyles} ${styleClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

