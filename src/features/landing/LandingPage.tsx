// @ts-nocheck
'use client'

import React, { useState, useEffect, Suspense, lazy } from 'react'
import Link from 'next/link'
import Button from '../../components/Button'
import LogoDisplay from '../../components/LogoDisplay'
import Loading from '../../components/Loading'
import {
  ArrowRight,
  MapPin,
  Sparkles
} from 'lucide-react'

// Lazy Load Heavy Sections
const FeaturesSection = lazy(() => import('./FeaturesSection'))
const HowItWorksSection = lazy(() => import('./HowItWorksSection'))
const TestimonialsSection = lazy(() => import('./TestimonialsSection'))
const FAQSection = lazy(() => import('./FAQSection'))
const TechStackSection = lazy(() => import('./TechStackSection'))
const CTASection = lazy(() => import('./CTASection'))
const LandingFooter = lazy(() => import('./LandingFooter'))

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  // Memoize to prevent recreating array on every render
  const featuredRooms = React.useMemo(() => [
    {
      id: 1,
      title: "Sala Executiva Paulista",
      price: "R$ 1.200/mês",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      location: "São Paulo, SP"
    },
    {
      id: 2,
      title: "Creative Hub Faria Lima",
      price: "R$ 850/mês",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
      location: "São Paulo, SP"
    },
    {
      id: 3,
      title: "Tech Space Vila Olímpia",
      price: "R$ 2.500/mês",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
      location: "São Paulo, SP"
    }
  ], [])

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featuredRooms.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [paused, featuredRooms.length])

  return (
    <div
      className="relative h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl group border border-white/20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {featuredRooms.map((room, idx) => (
        <div
          key={room.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Image */}
          <div className="absolute inset-0 bg-neutral-900">
            <img
              src={room.image}
              alt={room.title}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchpriority={idx === current ? "high" : "low"}
              className="w-full h-full object-cover transition-transform duration-[8000ms] ease-linear transform scale-100 group-hover:scale-105"
              style={{ willChange: idx === current ? 'transform' : 'auto' }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 inset-x-0 p-8 md:p-12 text-white">
            <div className="animate-slide-up">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase bg-primary-600/90 backdrop-blur-md rounded-full text-white shadow-lg">
                Destaque
              </span>
              <h3 className="text-3xl md:text-4xl font-display font-bold mb-2 leading-tight">
                {room.title}
              </h3>
              <div className="flex items-center gap-4 text-white/90 mb-6">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-primary-400" />
                  {room.location}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span className="text-lg font-bold text-white">
                  {room.price}
                </span>
              </div>

              <Link href="/app/rooms">
                <button className="bg-white text-neutral-900 hover:bg-primary-50 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 group/btn">
                  Ver Detalhes
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        {featuredRooms.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === current
              ? 'bg-white w-8'
              : 'bg-white/40 hover:bg-white/60'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Animated Gradient Background Component
 * Creates a dynamic, visually engaging background with floating orbs and mesh grid
 */
const AnimatedGradientBg = () => {
  return (
    <div className="hero-gradient-bg pointer-events-none" aria-hidden="true">
      {/* Gradient Orbs */}
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />
      <div className="gradient-orb gradient-orb-4" />

      {/* Mesh Grid Overlay */}
      <div className="mesh-grid" />

      {/* Shimmer Lines */}
      <div className="shimmer-line shimmer-line-1" />
      <div className="shimmer-line shimmer-line-2" />
      <div className="shimmer-line shimmer-line-3" />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-30 mix-blend-soft-light" />

      {/* Radial Fade at Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-neutral-50 to-transparent" />
    </div>
  )
}

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-neutral-50 selection:bg-primary-200 selection:text-primary-900 overflow-x-hidden font-sans">

      {/* Navbar - Scroll Aware */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-6'}`}>
        <div className={`absolute inset-0 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-md border-b border-white/20' : 'bg-transparent'}`} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <LogoDisplay />
              <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? 'text-neutral-900' : 'text-neutral-900'}`}>WorkNow</span>
            </div>
            <div className="flex items-center gap-4 hidden sm:flex">
              <Link href="/login">
                <Button variant="ghost" className="text-neutral-600 hover:text-neutral-900 font-medium text-sm">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" className="shadow-lg shadow-primary-500/20 rounded-full px-6 py-2 text-sm font-semibold hover:shadow-primary-500/40 transition-all hover:scale-105 active:scale-95">
                  Começar Grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced with Animated Gradient Background */}
      <section className="relative pt-48 pb-32 lg:pt-56 lg:pb-40 overflow-hidden">
        {/* NEW: Animated Gradient Background */}
        <AnimatedGradientBg />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Content */}
            <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              {/* Status Badge with Glow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pro mb-8 animate-fade-in-up animate-glow-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Disponível em todo Brasil</span>
              </div>

              {/* Main Headline with Enhanced Gradient Text */}
              <h1 className="text-5xl lg:text-7xl font-bold text-neutral-900 mb-8 leading-[1.1] tracking-tight animate-fade-in-up animation-delay-200">
                Conecte-se ao <br />
                espaço ideal para{' '}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-emerald-500 to-teal-500 animate-text-shimmer bg-[length:200%_auto]">
                    o seu negócio
                  </span>
                  {/* Decorative sparkle */}
                  <Sparkles className="absolute -top-2 -right-6 w-6 h-6 text-accent-500 animate-float" />
                </span>
                .
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-neutral-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fade-in-up animation-delay-400 font-medium">
                A plataforma completa que une profissionais em busca de flexibilidade a proprietários que valorizam gestão inteligente.
              </p>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center animate-fade-in-up animation-delay-600">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-1 transition-all bg-gradient-to-r from-primary-600 to-emerald-600 border-none group">
                    Começar Agora
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <div className="flex items-center gap-4 text-sm font-medium text-neutral-500">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-200 to-primary-300 shadow-sm" />
                    ))}
                  </div>
                  <span>+2.000 profissionais</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 pt-8 border-t border-neutral-200/50 animate-fade-in-up animation-delay-600">
                <p className="text-xs uppercase tracking-wider text-neutral-400 mb-4">Confiado por empresas</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 opacity-60">
                  {['Startup SP', 'Tech Hub', 'Cowork BR', 'Office Plus'].map((company, i) => (
                    <span key={i} className="text-sm font-semibold text-neutral-500">{company}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Composition - Pro Level */}
            <div className="relative h-[600px] hidden lg:block perspective-1000">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Lazy Loaded Sections */}
      <Suspense fallback={
        <div className="flex items-center justify-center py-40">
          <Loading />
        </div>
      }>
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <TechStackSection />
        <CTASection />
        <LandingFooter />
      </Suspense>

    </div>
  )
}

export default LandingPage
