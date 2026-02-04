// @ts-nocheck
import React from 'react'
import mobileAppMockup from '../../assets/mobile_app_mockup.png'

const FeaturesSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 tracking-tight leading-tight">
            A solução completa para <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              locação comercial
            </span>
          </h2>
          <p className="text-xl text-neutral-600 font-medium max-w-2xl mx-auto">
            Simplificamos cada etapa do processo, da busca inteligente à assinatura do contrato digital.
          </p>
        </div>

        {/* Hero Image / Phone Mockup */}
        <div className="relative flex justify-center items-center">
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-100/50 to-teal-100/50 rounded-full blur-3xl -z-10" />
          
          <div className="relative z-10 animate-fade-in-up">
            <img 
              src={mobileAppMockup} 
              alt="WorkNow App Interface" 
              className="w-full max-w-[320px] md:max-w-[380px] drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>

      </div>
    </section>
  )
}

export default FeaturesSection
