// @ts-nocheck
'use client'

import React, { useState } from 'react'
import { Search, Filter, X, MapPin, Users, DollarSign, Check } from 'lucide-react'
import Button from '../../components/Button'

const AMENITIES = [
  'Wi-Fi',
  'Ar condicionado',
  'Projetor',
  'Estacionamento',
  'Café grátis',
  'Escritório',
  'Sala de reunião',
  'Pontos de energia',
]

const FiltersPanel = ({ onFiltersChange, filters }) => {
  const [showFilters, setShowFilters] = useState(false)
  
  // Use local state effectively or derive? 
  // Since parent controls fetching on change, we can just pass changes up directly 
  // OR keep local buffer. The current implementation uses local buffer but triggers on change.
  // We'll stick to direct updates or minimal buffering if needed.
  // Actually, keeping 'localFilters' syncs with parent 'filters' prop is safer.
  
  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    onFiltersChange(newFilters)
  }

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = filters.amenities || []
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity]
    
    handleChange('amenities', newAmenities)
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      price_min: '',
      price_max: '',
      capacity: '',
      amenities: [],
      city: '',
    })
  }

  const hasActiveFilters = 
    filters.price_min ||
    filters.price_max ||
    filters.capacity ||
    filters.amenities?.length > 0 ||
    filters.city

  return (
    <div className="w-full">
      {/* Main Bar */}
      <div className="bg-white rounded-2xl p-2 shadow-soft border border-neutral-100 flex flex-col lg:flex-row gap-2">
        
        {/* Search Input */}
        <div className="flex-1 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nome..." 
            className="w-full pl-12 pr-4 py-3 bg-neutral-50 hover:bg-neutral-100 focus:bg-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all placeholder:text-neutral-400 text-neutral-900 font-medium"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        {/* City Input */}
        <div className="lg:w-48 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
            <MapPin className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Cidade" 
            className="w-full pl-12 pr-4 py-3 bg-neutral-50 hover:bg-neutral-100 focus:bg-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all placeholder:text-neutral-400 text-neutral-900 font-medium"
            value={filters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
          />
        </div>

        {/* Capacity Input */}
        <div className="lg:w-40 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <input 
            type="number" 
            placeholder="Capacidade" 
            className="w-full pl-12 pr-4 py-3 bg-neutral-50 hover:bg-neutral-100 focus:bg-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all placeholder:text-neutral-400 text-neutral-900 font-medium"
            value={filters.capacity || ''}
            onChange={(e) => handleChange('capacity', e.target.value)}
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 lg:w-auto w-full
            ${(showFilters || hasActiveFilters)
              ? 'bg-primary-50 text-primary-700 ring-2 ring-primary-500/20' 
              : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg hover:shadow-xl'
            }
          `}
        >
          <Filter className="w-5 h-5" />
          <span className="hidden lg:inline">Filtros</span>
          {hasActiveFilters && (
            <span className="ml-1 w-5 h-5 bg-primary-500 text-white text-[10px] flex items-center justify-center rounded-full">
              {[filters.city, filters.price_min, filters.price_max, filters.capacity, filters.amenities?.length].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-4 bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 animate-fade-in">
          <div className="space-y-6">
            
            {/* Price Range */}
            <div>
              <label className="text-sm font-bold text-neutral-700 mb-3 block flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary-500" />
                Faixa de Preço (R$)
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  placeholder="Mín"
                  className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  value={filters.price_min || ''}
                  onChange={(e) => handleChange('price_min', e.target.value)}
                />
                <span className="text-neutral-400 font-medium">até</span>
                <input
                  type="number"
                  placeholder="Máx"
                  className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  value={filters.price_max || ''}
                  onChange={(e) => handleChange('price_max', e.target.value)}
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="text-sm font-bold text-neutral-700 mb-3 block">
                Comodidades
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AMENITIES.map((amenity) => {
                  const isSelected = filters.amenities?.includes(amenity)
                  return (
                    <div
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`
                        cursor-pointer px-3 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 select-none text-sm font-medium
                        ${isSelected 
                          ? 'border-primary-500 bg-primary-50 text-primary-700' 
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                        }
                      `}
                    >
                      <div className={`
                        w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                        ${isSelected ? 'bg-primary-500 border-primary-500' : 'border-neutral-300'}
                      `}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      {amenity}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3">
              <Button variant="ghost" onClick={clearFilters} className="text-neutral-500">
                Limpar Filtros
              </Button>
              <Button variant="primary" onClick={() => setShowFilters(false)}>
                Ver Resultados
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FiltersPanel

