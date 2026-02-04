// @ts-nocheck
'use client'

import React from 'react'
import Link from 'next/link'
import LogoDisplay from '../../components/LogoDisplay'
import {
  MapPin,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  ArrowUpRight,
  Heart
} from 'lucide-react'

const footerLinks = {
  platform: {
    title: 'Plataforma',
    links: [
      { label: 'Buscar Salas', href: '/app/rooms' },
      { label: 'Anunciar Imóvel', href: '/register' },
      { label: 'Área do Cliente', href: '/login' },
      { label: 'Preços', href: '#pricing' },
      { label: 'Como Funciona', href: '#how-it-works' },
    ]
  },
  company: {
    title: 'Empresa',
    links: [
      { label: 'Sobre Nós', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Carreiras', href: '#careers', badge: 'Contratando' },
      { label: 'Parceiros', href: '#partners' },
      { label: 'Imprensa', href: '#press' },
    ]
  },
  resources: {
    title: 'Recursos',
    links: [
      { label: 'Central de Ajuda', href: '#help' },
      { label: 'Guia do Proprietário', href: '#owner-guide' },
      { label: 'Guia do Locatário', href: '#tenant-guide' },
      { label: 'API', href: '#api' },
      { label: 'Status do Sistema', href: '#status' },
    ]
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Termos de Uso', href: '#terms' },
      { label: 'Privacidade', href: '#privacy' },
      { label: 'Cookies', href: '#cookies' },
      { label: 'LGPD', href: '#lgpd' },
    ]
  }
}

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Facebook, href: '#', label: 'Facebook' },
]

const LandingFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-neutral-900 text-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Fique por dentro das novidades
              </h3>
              <p className="text-neutral-400">
                Receba dicas exclusivas e ofertas especiais diretamente no seu e-mail.
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all w-full sm:w-80"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  Inscrever-se
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <LogoDisplay />
              <span className="text-2xl font-bold tracking-tight">WorkNow</span>
            </div>
            <p className="text-neutral-400 mb-6 max-w-sm leading-relaxed">
              A plataforma líder em locação de espaços comerciais flexíveis.
              Conectamos profissionais a proprietários de forma simples e segura.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <a href="mailto:contato@worknow.com.br" className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-primary-500" />
                contato@worknow.com.br
              </a>
              <a href="tel:+5511999999999" className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-primary-500" />
                +55 (11) 99999-9999
              </a>
              <div className="flex items-center gap-3 text-neutral-400">
                <MapPin className="w-4 h-4 text-primary-500" />
                São Paulo, SP - Brasil
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-neutral-400 hover:text-white transition-colors text-sm inline-flex items-center gap-2"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-sm">
              © {currentYear} WorkNow. Todos os direitos reservados.
            </p>

            <div className="flex items-center gap-2 text-neutral-500 text-sm">
              <span>Feito com</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>no Brasil</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link href="#terms" className="text-neutral-500 hover:text-white transition-colors">
                Termos
              </Link>
              <Link href="#privacy" className="text-neutral-500 hover:text-white transition-colors">
                Privacidade
              </Link>
              <Link href="#cookies" className="text-neutral-500 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter
