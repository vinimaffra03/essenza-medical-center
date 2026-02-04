// @ts-nocheck
'use client'

import React from 'react'
import Link from 'next/link'
import LogoDisplay from './LogoDisplay'
import { Building2 } from 'lucide-react'

/**
 * PublicLayout - Layout for public pages (landing, auth pages)
 * This layout does NOT include the app navigation bar
 */
const PublicLayout = ({ children, showNav = true, minimal = false }) => {
    if (minimal) {
        // Minimal layout for auth pages - no nav at all
        return (
            <div className="min-h-screen bg-gradient-soft">
                {children}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-soft">
            {showNav && (
                <nav className="fixed top-0 inset-x-0 z-50 py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link href="/" className="flex items-center gap-3 group">
                                <LogoDisplay fallback={
                                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                } />
                                <span className="text-xl font-bold tracking-tight text-neutral-900">WorkNow</span>
                            </Link>
                        </div>
                    </div>
                </nav>
            )}

            <main>{children}</main>
        </div>
    )
}

export default PublicLayout
