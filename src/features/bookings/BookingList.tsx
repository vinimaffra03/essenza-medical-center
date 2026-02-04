// @ts-nocheck
'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAuthStore } from '../../store/useAuthStore'
import { useBookingStore } from '../../store/useBookingStore'
import Card from '../../components/Card'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import Skeleton from '../../components/Skeleton'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, MapPin, DollarSign, Clock, CheckCircle2, XCircle, AlertCircle, Building2, List, CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'

const BookingList = () => {
  const { profile } = useAuthStore()
  const { bookings, loading, fetchBookings, cancelBooking } = useBookingStore()
  const [cancellingId, setCancellingId] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showDayModal, setShowDayModal] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (profile?.id) {
      fetchBookings(profile.id)
    }
  }, [profile?.id])

  useEffect(() => {
    if (searchParams.get('status') === 'success') {
      fetchBookings(profile?.id)
      window.history.replaceState({}, document.title, '/bookings')
    }
  }, [searchParams, profile?.id])

  const handleCancel = async (bookingId) => {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return

    setCancellingId(bookingId)
    const result = await cancelBooking(bookingId)
    if (result.success) {
      await fetchBookings(profile.id)
    }
    setCancellingId(null)
  }

  const getStatusBadge = (status, size = 'normal') => {
    const config = {
      pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle, label: 'Pendente' },
      confirmed: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2, label: 'Confirmado' },
      paid: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Pago' },
      cancelled: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Cancelado' },
      completed: { color: 'bg-neutral-100 text-neutral-700 border-neutral-200', icon: CheckCircle2, label: 'Concluído' },
    }

    const style = config[status] || config.pending
    const Icon = style.icon

    if (size === 'small') {
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${style.color}`}>
          {style.label}
        </span>
      )
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {style.label}
      </span>
    )
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-400',
      confirmed: 'bg-green-400',
      paid: 'bg-emerald-500',
      cancelled: 'bg-red-400',
      completed: 'bg-neutral-400',
    }
    return colors[status] || colors.pending
  }

  // Calendar helpers
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })

    // Add padding days from previous month
    const startDay = start.getDay()
    const paddingStart = []
    for (let i = startDay - 1; i >= 0; i--) {
      paddingStart.push(new Date(start.getTime() - (i + 1) * 24 * 60 * 60 * 1000))
    }

    // Add padding days for next month
    const endDay = end.getDay()
    const paddingEnd = []
    for (let i = 1; i < 7 - endDay; i++) {
      paddingEnd.push(new Date(end.getTime() + i * 24 * 60 * 60 * 1000))
    }

    return [...paddingStart, ...days, ...paddingEnd]
  }, [currentMonth])

  const bookingsByDate = useMemo(() => {
    const map = new Map()
    bookings.forEach((booking) => {
      const dateKey = format(parseISO(booking.start_time), 'yyyy-MM-dd')
      if (!map.has(dateKey)) {
        map.set(dateKey, [])
      }
      map.get(dateKey).push(booking)
    })
    return map
  }, [bookings])

  const getBookingsForDate = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return bookingsByDate.get(dateKey) || []
  }

  const handleDayClick = (date) => {
    const dayBookings = getBookingsForDate(date)
    if (dayBookings.length > 0) {
      setSelectedDate(date)
      setShowDayModal(true)
    }
  }

  const BookingSkeleton = () => (
    <Card className="border-0 shadow-soft">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="w-48 h-6 rounded-lg" />
              <Skeleton className="w-64 h-4 rounded-lg" />
            </div>
            <Skeleton className="w-24 h-8 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
            <Skeleton className="w-full h-5 rounded-lg" />
            <Skeleton className="w-full h-5 rounded-lg" />
            <Skeleton className="w-full h-5 rounded-lg" />
          </div>
        </div>
      </div>
    </Card>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="border-0 shadow-soft hover:shadow-medium transition-shadow duration-300">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  <div className="hidden sm:flex w-12 h-12 rounded-xl bg-primary-50 items-center justify-center text-primary-600 flex-shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 leading-tight">
                      {booking.room?.title || 'Sala indisponível'}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-500 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {booking.room?.address || 'Endereço não disponível'}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-t border-neutral-100 mt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Início</span>
                  <div className="flex items-center gap-2 text-neutral-700 font-medium">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span>
                      {format(new Date(booking.start_time), "dd/MM/yy 'às' HH:mm")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Término</span>
                  <div className="flex items-center gap-2 text-neutral-700 font-medium">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span>
                      {format(new Date(booking.end_time), "dd/MM/yy 'às' HH:mm")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Valor Total</span>
                  <div className="flex items-center gap-2 text-neutral-900 font-bold">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span>
                      R$ {booking.total_price?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-3 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  <p className="text-xs text-neutral-500 font-semibold uppercase mb-1">Observações</p>
                  <p className="text-sm text-neutral-700">{booking.notes}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-neutral-100 pt-4 md:pt-0 md:pl-6 gap-3">
              {booking.status === 'pending' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleCancel(booking.id)}
                  disabled={cancellingId === booking.id}
                  className="w-full md:w-auto whitespace-nowrap"
                >
                  {cancellingId === booking.id ? 'Cancelando...' : 'Cancelar Reserva'}
                </Button>
              )}
              <Button variant="ghost" size="sm" className="w-full md:w-auto text-neutral-500">
                Ver Detalhes
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  const renderCalendarView = () => {
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

    return (
      <Card className="border-0 shadow-soft overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-neutral-50">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <h3 className="text-lg font-bold text-neutral-800 capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 border-b border-neutral-100">
          {weekDays.map((day) => (
            <div key={day} className="p-3 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider bg-neutral-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayBookings = getBookingsForDate(day)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isCurrentDay = isToday(day)
            const hasBookings = dayBookings.length > 0

            return (
              <div
                key={index}
                onClick={() => hasBookings && handleDayClick(day)}
                className={`
                  min-h-[100px] p-2 border-b border-r border-neutral-100 transition-colors
                  ${!isCurrentMonth ? 'bg-neutral-50/50' : 'bg-white'}
                  ${hasBookings ? 'cursor-pointer hover:bg-primary-50/30' : ''}
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`
                    w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium
                    ${isCurrentDay
                      ? 'bg-primary-500 text-white'
                      : isCurrentMonth
                        ? 'text-neutral-700'
                        : 'text-neutral-300'
                    }
                  `}>
                    {format(day, 'd')}
                  </span>
                  {hasBookings && (
                    <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
                      {dayBookings.length}
                    </span>
                  )}
                </div>

                {/* Booking Indicators */}
                <div className="space-y-1 mt-1">
                  {dayBookings.slice(0, 3).map((booking, i) => (
                    <div
                      key={booking.id}
                      className={`
                        text-[10px] px-1.5 py-0.5 rounded truncate
                        ${getStatusColor(booking.status)} text-white font-medium
                      `}
                      title={booking.room?.title}
                    >
                      {booking.room?.title?.substring(0, 12)}...
                    </div>
                  ))}
                  {dayBookings.length > 3 && (
                    <div className="text-[10px] text-neutral-500 font-medium px-1">
                      +{dayBookings.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="font-semibold text-neutral-600">Legenda:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400"></span>
              <span className="text-neutral-600">Pendente</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-green-400"></span>
              <span className="text-neutral-600">Confirmado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span className="text-neutral-600">Pago</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-400"></span>
              <span className="text-neutral-600">Cancelado</span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Day Modal for calendar
  const renderDayModal = () => {
    if (!showDayModal || !selectedDate) return null

    const dayBookings = getBookingsForDate(selectedDate)

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDayModal(false)} />
        <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-fade-in">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-100">
            <div>
              <h3 className="text-lg font-bold text-neutral-800">
                {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h3>
              <p className="text-sm text-neutral-500">
                {dayBookings.length} {dayBookings.length === 1 ? 'reserva' : 'reservas'}
              </p>
            </div>
            <button
              onClick={() => setShowDayModal(false)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
            {dayBookings.map((booking) => (
              <div key={booking.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-neutral-800">
                      {booking.room?.title || 'Sala indisponível'}
                    </h4>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {booking.room?.address}
                    </p>
                  </div>
                  {getStatusBadge(booking.status, 'small')}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-neutral-200">
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase font-semibold">Horário</p>
                    <p className="text-sm text-neutral-700 font-medium">
                      {format(new Date(booking.start_time), 'HH:mm')} - {format(new Date(booking.end_time), 'HH:mm')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase font-semibold">Valor</p>
                    <p className="text-sm text-neutral-900 font-bold">
                      R$ {booking.total_price?.toFixed(2)}
                    </p>
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <div className="mt-3 pt-3 border-t border-neutral-200">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="w-full"
                    >
                      {cancellingId === booking.id ? 'Cancelando...' : 'Cancelar'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loading && bookings.length === 0) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="space-y-2 mb-8">
          <Skeleton className="w-48 h-8 rounded-xl" />
          <Skeleton className="w-64 h-4 rounded-lg" />
        </div>
        {[1, 2, 3].map((i) => <BookingSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent-50 text-accent-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-neutral-900">
                Minhas Reservas
              </h1>
              <p className="text-neutral-500">
                Gerencie seus agendamentos e histórico.
              </p>
            </div>
          </div>

          {/* View Toggle */}
          {bookings.length > 0 && (
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl">
              <button
                onClick={() => setViewMode('list')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${viewMode === 'list'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                  }
                `}
              >
                <List className="w-4 h-4" />
                Lista
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${viewMode === 'calendar'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                  }
                `}
              >
                <CalendarDays className="w-4 h-4" />
                Calendário
              </button>
            </div>
          )}
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            title="Nenhuma reserva encontrada"
            description="Você ainda não fez nenhuma reserva. Explore nossas salas e agende seu horário."
            action={
              <Button onClick={() => window.location.href = '/rooms'} variant="primary">
                Explorar Salas
              </Button>
            }
          />
        ) : (
          <>
            {viewMode === 'list' ? renderListView() : renderCalendarView()}
          </>
        )}
      </div>

      {/* Day Modal */}
      {renderDayModal()}
    </div>
  )
}

export default BookingList
