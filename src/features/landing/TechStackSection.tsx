// @ts-nocheck
import React from 'react'
import { 
  CheckCircle2, 
  Smartphone, 
  Zap, 
  Shield, 
  Briefcase 
} from 'lucide-react'

const TechStackSection = () => {
  return (
    <section className="py-24 border-y border-neutral-200/50 bg-white/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
               <h2 className="text-4xl font-bold text-neutral-900 mb-6">Por que escolher a WorkNow?</h2>
               <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                  Mais do que tecnologia, oferecemos segurança e praticidade para o seu dia a dia. Nossa plataforma elimina burocracias e conecta você diretamente às melhores oportunidades do mercado.
               </p>
               <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full border border-neutral-200 bg-white/50 text-sm font-medium text-neutral-700 flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-green-500" /> Sem fiador
                  </span>
                  <span className="px-4 py-2 rounded-full border border-neutral-200 bg-white/50 text-sm font-medium text-neutral-700 flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-green-500" /> 100% Digital
                  </span>
                  <span className="px-4 py-2 rounded-full border border-neutral-200 bg-white/50 text-sm font-medium text-neutral-700 flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-green-500" /> Suporte 24/7
                  </span>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
               <div className="glass-pro p-6 rounded-2xl w-40 h-40 flex flex-col justify-center items-center text-center hover:-translate-y-2 transition-transform duration-300 shadow-soft group">
                  <Zap className="w-8 h-8 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-neutral-800 leading-tight">Agilidade na Locação</span>
               </div>
               <div className="glass-pro p-6 rounded-2xl w-40 h-40 flex flex-col justify-center items-center text-center hover:-translate-y-2 transition-transform duration-300 mt-8 shadow-soft group">
                  <Shield className="w-8 h-8 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-neutral-800 leading-tight">Segurança Total</span>
               </div>
               <div className="glass-pro p-6 rounded-2xl w-40 h-40 flex flex-col justify-center items-center text-center hover:-translate-y-2 transition-transform duration-300 -mt-8 shadow-soft group">
                  <Smartphone className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-neutral-800 leading-tight">Gestão Mobile</span>
               </div>
               <div className="glass-pro p-6 rounded-2xl w-40 h-40 flex flex-col justify-center items-center text-center hover:-translate-y-2 transition-transform duration-300 shadow-soft group">
                  <Briefcase className="w-8 h-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-neutral-800 leading-tight">Para Empresas</span>
               </div>
            </div>
         </div>
      </div>
    </section>
  )
}

export default TechStackSection
