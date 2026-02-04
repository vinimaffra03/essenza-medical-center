// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday, isPast, isFuture } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar, X, Edit2, Trash2, Sparkles, Wrench, AlertCircle } from 'lucide-react'
import { supabase } from '../services/supabase'
import Button from './Button'
import Card from './Card'
import Loading from './Loading'

const RoomManagementCalendar = ({ roomId }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState([])
  const [maintenancePeriods, setMaintenancePeriods] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false)
  const [showBookingDetails, setShowBookingDetails] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [maintenanceData, setMaintenanceData] = useState({
    start_time: '',
    end_time: '',
    type: 'cleaning',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [roomId, currentDate])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Buscar reservas
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          user:profiles (
            id,
            name,
            email
          )
        `)
        .eq('room_id', roomId)
        .order('start_time', { ascending: true })

      if (bookingsError) throw bookingsError

      // Buscar períodos de faxina
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_periods')
        .select('*')
        .eq('room_id', roomId)
        .order('start_time', { ascending: true })

      if (maintenanceError) throw maintenanceError

      setBookings(bookingsData || [])
      setMaintenancePeriods(maintenanceData || [])
      
      // Debug: verificar se os períodos foram carregados
      console.log('Maintenance periods loaded:', maintenanceData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMaintenance = async (e) => {
    e.preventDefault()
    
    // Validar datas
    if (!maintenanceData.start_time || !maintenanceData.end_time) {
      alert('Por favor, preencha as datas de início e término')
      return
    }

    const start = new Date(maintenanceData.start_time)
    const end = new Date(maintenanceData.end_time)

    if (start >= end) {
      alert('A data de término deve ser posterior à data de início')
      return
    }
    
    try {
      const { error } = await supabase
        .from('maintenance_periods')
        .insert({
          room_id: roomId,
          start_time: maintenanceData.start_time,
          end_time: maintenanceData.end_time,
          type: maintenanceData.type,
          notes: maintenanceData.notes || null
        })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      setShowMaintenanceForm(false)
      setMaintenanceData({
        start_time: '',
        end_time: '',
        type: 'cleaning',
        notes: ''
      })
      await loadData()
    } catch (error) {
      console.error('Error creating maintenance period:', error)
      alert('Erro ao criar período: ' + (error.message || 'Erro desconhecido'))
    }
  }

  const handleDeleteMaintenance = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este período?')) return

    try {
      const { error } = await supabase
        .from('maintenance_periods')
        .delete()
        .eq('id', id)

      if (error) throw error

      await loadData()
    } catch (error) {
      console.error('Error deleting maintenance period:', error)
      alert('Erro ao deletar período: ' + error.message)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error

      await loadData()
      setShowBookingDetails(false)
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Erro ao cancelar reserva: ' + error.message)
    }
  }

  const getEventsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    
    const dayBookings = bookings.filter(booking => {
      if (!booking.start_time || !booking.end_time) return false
      try {
        const start = format(new Date(booking.start_time), 'yyyy-MM-dd')
        const end = format(new Date(booking.end_time), 'yyyy-MM-dd')
        return dateStr >= start && dateStr <= end
      } catch {
        return false
      }
    })
    
    const dayMaintenance = maintenancePeriods.filter(mp => {
      if (!mp.start_time || !mp.end_time) return false
      try {
        const start = format(new Date(mp.start_time), 'yyyy-MM-dd')
        const end = format(new Date(mp.end_time), 'yyyy-MM-dd')
        return dateStr >= start && dateStr <= end
      } catch {
        return false
      }
    })

    return { bookings: dayBookings, maintenance: dayMaintenance }
  }

  const getMaintenanceIcon = (type) => {
    switch (type) {
      case 'cleaning':
        return <Sparkles className="w-3 h-3" />
      case 'maintenance':
        return <Wrench className="w-3 h-3" />
      case 'unavailable':
        return <AlertCircle className="w-3 h-3" />
      default:
        return <Calendar className="w-3 h-3" />
    }
  }

  const getMaintenanceColor = (type) => {
    switch (type) {
      case 'cleaning':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'maintenance':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'unavailable':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loading />
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowMaintenanceForm(true)}
        >
          + Adicionar Período de Faxina
        </Button>
      </div>

      {/* Calendário */}
      <Card className="w-full overflow-x-auto">
        <div className="p-6 min-w-full">
          {/* Dias da Semana */}
          <div className="grid grid-cols-7 gap-2 mb-4 min-w-[700px]">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, idx) => (
              <div key={idx} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Dias do Mês */}
          <div className="grid grid-cols-7 gap-2 min-w-[700px]">
            {days.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isCurrentDay = isToday(day)
              const events = getEventsForDate(day)
              const hasBookings = events.bookings.length > 0
              const hasMaintenance = events.maintenance.length > 0

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedDate(day)
                    if (hasBookings) {
                      setSelectedBooking(events.bookings[0])
                      setShowBookingDetails(true)
                    }
                  }}
                  className={`
                    min-h-[80px] p-2 rounded-lg border-2 cursor-pointer transition-all
                    ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                    ${isCurrentDay ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'}
                    ${hasBookings || hasMaintenance ? 'hover:border-primary-300 hover:shadow-md' : 'hover:border-gray-300'}
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-semibold ${isCurrentDay ? 'text-primary-600' : 'text-gray-700'}`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {hasMaintenance && events.maintenance.map((mp, mpIdx) => (
                      <div
                        key={mpIdx}
                        className={`text-xs px-1.5 py-0.5 rounded border flex items-center gap-1 ${getMaintenanceColor(mp.type)}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteMaintenance(mp.id)
                        }}
                      >
                        {getMaintenanceIcon(mp.type)}
                        <span className="truncate">
                          {mp.type === 'cleaning' ? 'Faxina' : mp.type === 'maintenance' ? 'Manutenção' : 'Indisponível'}
                        </span>
                      </div>
                    ))}
                    
                    {hasBookings && events.bookings.map((booking, bIdx) => (
                      <div
                        key={bIdx}
                        className={`
                          text-xs px-1.5 py-0.5 rounded border truncate
                          ${booking.status === 'paid' ? 'bg-green-100 text-green-700 border-green-300' : 
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-300' :
                            'bg-blue-100 text-blue-700 border-blue-300'}
                        `}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedBooking(booking)
                          setShowBookingDetails(true)
                        }}
                      >
                        {booking.user?.name || 'Cliente'} - {format(new Date(booking.start_time), 'HH:mm')}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span>Reserva Paga</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span>Reserva Pendente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span>Faxina</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
          <span>Manutenção</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span>Indisponível</span>
        </div>
      </div>

      {/* Modal de Detalhes da Reserva */}
      {showBookingDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Detalhes da Reserva</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowBookingDetails(false)
                  setSelectedBooking(null)
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-semibold">{selectedBooking.user?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{selectedBooking.user?.email || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Período</p>
                <p className="font-semibold">
                  {format(new Date(selectedBooking.start_time), "dd/MM/yyyy 'às' HH:mm")} - {format(new Date(selectedBooking.end_time), "dd/MM/yyyy 'às' HH:mm")}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Valor</p>
                <p className="font-semibold text-lg">R$ {parseFloat(selectedBooking.total_price).toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedBooking.status === 'paid' ? 'bg-green-100 text-green-800' :
                  selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedBooking.status === 'paid' ? 'Pago' : 
                   selectedBooking.status === 'pending' ? 'Pendente' : 'Cancelado'}
                </span>
              </div>
              
              {selectedBooking.notes && (
                <div>
                  <p className="text-sm text-gray-600">Observações</p>
                  <p className="text-sm">{selectedBooking.notes}</p>
                </div>
              )}
              
              {selectedBooking.status !== 'cancelled' && (
                <Button
                  variant="danger"
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  className="w-full"
                >
                  Cancelar Reserva
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Adicionar Faxina */}
      {showMaintenanceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Adicionar Período de Faxina</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMaintenanceForm(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <form onSubmit={handleCreateMaintenance} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={maintenanceData.type}
                  onChange={(e) => setMaintenanceData({ ...maintenanceData, type: e.target.value })}
                  className="w-full px-4 py-2 border-2 rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="cleaning">Faxina</option>
                  <option value="maintenance">Manutenção</option>
                  <option value="unavailable">Indisponível</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data/Hora de Início
                </label>
                <input
                  type="datetime-local"
                  value={maintenanceData.start_time}
                  onChange={(e) => setMaintenanceData({ ...maintenanceData, start_time: e.target.value })}
                  className="w-full px-4 py-2 border-2 rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data/Hora de Término
                </label>
                <input
                  type="datetime-local"
                  value={maintenanceData.end_time}
                  onChange={(e) => setMaintenanceData({ ...maintenanceData, end_time: e.target.value })}
                  className="w-full px-4 py-2 border-2 rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={maintenanceData.notes}
                  onChange={(e) => setMaintenanceData({ ...maintenanceData, notes: e.target.value })}
                  className="w-full px-4 py-2 border-2 rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              
              <Button type="submit" variant="primary" className="w-full">
                Adicionar Período
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}

export default RoomManagementCalendar

