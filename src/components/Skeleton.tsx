// @ts-nocheck
'use client'

import React from 'react'

const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-neutral-200 rounded-xl ${className}`}
      {...props}
    />
  )
}

export default Skeleton
