// @ts-nocheck
'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, DollarSign, Users, Building2, Star, Clock, Wifi, Car, Coffee } from 'lucide-react'
import Card from '../../components/Card'

// Icon mapping for amenities
const amenityIcons = {
  'Wi-Fi': Wifi,
  'Estacionamento': Car,
  'Café grátis': Coffee,
}

const RoomCard = ({ room, viewMode = 'grid' }) => {
  // Grid View (original card layout)
  if (viewMode === 'grid') {
    return (
      <Link href={`/app/rooms/${room.id}`}>
        <Card hover className="overflow-hidden p-0 h-full flex flex-col animate-fade-in group border-0 shadow-soft hover:shadow-strong transition-all duration-500">
          <div className="h-56 relative overflow-hidden">
            <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
            {room.images && room.images.length > 0 ? (
              <img
                src={room.images[0]}
                alt={room.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 gradient-primary flex items-center justify-center">
                <Building2 className="w-16 h-16 text-white/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-4 right-4">
              <span className="glass-pill px-3 py-1 rounded-full text-xs font-bold text-neutral-800 backdrop-blur-md">
                {room.city || 'Cidade'}
              </span>
            </div>

            {room.rating && (
              <div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-neutral-900">{room.rating}</span>
              </div>
            )}
          </div>

          <div className="p-6 flex-1 flex flex-col bg-white">
            <h3 className="text-xl font-display font-bold text-neutral-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {room.title || 'Sala sem título'}
            </h3>

            {room.description && (
              <p className="text-neutral-500 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
                {room.description}
              </p>
            )}

            <div className="space-y-4 pt-4 border-t border-neutral-100 mt-auto">
              {room.address && (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span className="truncate">{room.address}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-full bg-primary-50">
                    <DollarSign className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-400 font-medium">A partir de</span>
                    <span className="text-lg font-bold text-neutral-900 leading-none">
                      R$ {room.price_per_day?.toFixed(2) || room.price_per_hour?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                {room.capacity && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-100">
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm font-semibold text-neutral-600">{room.capacity}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  // List View (horizontal card layout)
  return (
    <Link href={`/app/rooms/${room.id}`}>
      <Card hover className="overflow-hidden p-0 animate-fade-in group border-0 shadow-soft hover:shadow-strong transition-all duration-500">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="w-full md:w-72 h-48 md:h-auto relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
            {room.images && room.images.length > 0 ? (
              <img
                src={room.images[0]}
                alt={room.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 gradient-primary flex items-center justify-center">
                <Building2 className="w-12 h-12 text-white/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {room.rating && (
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-neutral-900">{room.rating}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 bg-white flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700">
                      {room.city || 'Cidade'}
                    </span>
                    {room.is_new && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        Novo
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-display font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {room.title || 'Sala sem título'}
                  </h3>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-neutral-400 font-medium block">A partir de</span>
                  <span className="text-2xl font-bold text-primary-600">
                    R$ {room.price_per_day?.toFixed(0) || room.price_per_hour?.toFixed(0) || '0'}
                  </span>
                  <span className="text-xs text-neutral-500">/dia</span>
                </div>
              </div>

              {/* Description */}
              {room.description && (
                <p className="text-neutral-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {room.description}
                </p>
              )}

              {/* Location */}
              {room.address && (
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span>{room.address}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              {/* Amenities */}
              <div className="flex items-center gap-3">
                {room.amenities?.slice(0, 3).map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity] || Building2
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 text-xs text-neutral-500"
                      title={amenity}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="hidden sm:inline">{amenity}</span>
                    </div>
                  )
                })}
                {room.amenities?.length > 3 && (
                  <span className="text-xs text-neutral-400">+{room.amenities.length - 3}</span>
                )}
              </div>

              {/* Capacity & Availability */}
              <div className="flex items-center gap-4">
                {room.capacity && (
                  <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span className="font-medium">{room.capacity} pessoas</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Disponível</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default RoomCard
