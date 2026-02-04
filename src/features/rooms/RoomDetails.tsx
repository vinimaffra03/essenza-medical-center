// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRooms } from "./useRooms";
import { supabase } from "../../services/supabase";
import { useAuthStore } from "../../store/useAuthStore";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Input from "../../components/Input";
import DateTimePicker from "../../components/DateTimePicker";
import RoomManagementCalendar from "../../components/RoomManagementCalendar";
import Lightbox from "../../components/Lightbox";
import {
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Check,
  Edit2,
  Building2,
  ArrowRight,
  Shield,
  Images,
} from "lucide-react";
import { format } from "date-fns";
import {
  calculatePriceWithDiscounts,
  getDiscountDescription,
} from "../../lib/price";

const RoomDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { profile } = useAuthStore();
  const { fetchRoom, updateRoom, deleteRoom } = useRooms();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // 'details' ou 'calendar'
  const [bookingData, setBookingData] = useState({
    start_time: "",
    end_time: "",
    notes: "",
  });

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isOwner = profile?.role === "owner";

  useEffect(() => {
    loadRoom();
  }, [id]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      const result = await fetchRoom(id);
      if (result.success) {
        setRoom(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError(null); // Limpar erros anteriores

    if (!bookingData.start_time || !bookingData.end_time) {
      setError("Por favor, preencha as datas de início e término");
      return;
    }

    const start = new Date(bookingData.start_time);
    const end = new Date(bookingData.end_time);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError("Datas inválidas. Por favor, selecione novamente");
      return;
    }

    if (start >= end) {
      setError("A data de término deve ser posterior à data de início");
      return;
    }

    // Validar que há pelo menos algumas horas de diferença
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (diffHours < 1) {
      setError("A reserva deve ter pelo menos 1 hora de duração");
      return;
    }

    try {
      setProcessingCheckout(true);
      setError(null);

      // Verificar se está autenticado (Clerk já verifica no middleware, mas validamos o profile)
      if (!profile?.id) {
        setError("Você precisa estar logado para fazer uma reserva");
        return;
      }

      const { data, error } = await supabase.functions.invoke("checkout", {
        body: {
          room_id: room.id,
          start_time: bookingData.start_time,
          end_time: bookingData.end_time,
        },
      });

      if (error) {
        console.error("Edge Function error:", error);
        // Melhorar mensagens de erro
        if (
          error.message?.includes("Unauthorized") ||
          error.message?.includes("401")
        ) {
          setError("Sessão expirada. Por favor, faça login novamente.");
        } else if (
          error.message?.includes("Room not found") ||
          error.message?.includes("404")
        ) {
          setError("Sala não encontrada. Por favor, recarregue a página.");
        } else if (
          error.message?.includes("overlap") ||
          error.message?.includes("409") ||
          error.message?.includes("available")
        ) {
          setError(
            "Já existe uma reserva neste horário. Escolha outro horário.",
          );
        } else {
          setError(
            error.message || "Erro ao processar checkout. Tente novamente.",
          );
        }
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError("Falha ao iniciar pagamento. Tente novamente.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      // Verificar se é erro de rede/CORS
      if (
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("NetworkError")
      ) {
        setError("Erro de conexão. Verifique sua internet e tente novamente.");
      } else if (err.message?.includes("CORS")) {
        setError("Erro de configuração. Entre em contato com o suporte.");
      } else {
        setError(
          err.message ||
            "Erro ao processar checkout. Verifique sua conexão e tente novamente.",
        );
      }
    } finally {
      setProcessingCheckout(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar esta sala?")) return;

    const result = await deleteRoom(id);
    if (result.success) {
      router.push("/app/rooms");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sala não encontrada
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push("/app/rooms")}>Voltar</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className={`${activeTab === "calendar" && isOwner ? "max-w-full" : "max-w-7xl"} mx-auto px-6 py-8`}
      >
        {/* Botão Voltar */}
        <Button
          variant="ghost"
          onClick={() => router.push("/rooms")}
          className="mb-8 text-gray-500 hover:text-gray-900"
        >
          ← Voltar para salas
        </Button>

        {/* Tabs para Proprietário */}
        {isOwner && (
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-4 px-4 font-semibold transition-colors ${
                  activeTab === "details"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Detalhes da Sala
              </button>
              <button
                onClick={() => setActiveTab("calendar")}
                className={`pb-4 px-4 font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === "calendar"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Calendar className="w-5 h-5" />
                Calendário e Reservas
              </button>
            </div>
          </div>
        )}

        {activeTab === "calendar" && isOwner ? (
          <RoomManagementCalendar roomId={id} />
        ) : (
          <div
            className={`grid grid-cols-1 ${!isOwner ? "lg:grid-cols-3" : "lg:grid-cols-1"} gap-8 items-start`}
          >
            {/* Conteúdo Principal */}
            <div
              className={`${!isOwner ? "lg:col-span-2" : "lg:col-span-1"} space-y-8`}
            >
              {/* Image Gallery - Grid Layout with Lightbox */}
              <div className="rounded-3xl overflow-hidden shadow-soft border border-neutral-200 bg-neutral-100 relative group h-[400px] md:h-[500px]">
                {room.images && room.images.length > 0 ? (
                  <>
                    {/* If 1 image: Full Cover */}
                    {room.images.length === 1 && (
                      <button
                        onClick={() => openLightbox(0)}
                        className="w-full h-full cursor-pointer"
                      >
                        <img
                          src={room.images[0]}
                          alt={room.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </button>
                    )}

                    {/* If 2 images: Split */}
                    {room.images.length === 2 && (
                      <div className="grid grid-cols-2 h-full gap-1">
                        {room.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => openLightbox(idx)}
                            className="relative overflow-hidden cursor-pointer group/item"
                          >
                            <img
                              src={img}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                              alt=""
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* If 3+ images: Grid */}
                    {room.images.length >= 3 && (
                      <div className="grid grid-cols-4 grid-rows-2 h-full gap-2">
                        <button
                          onClick={() => openLightbox(0)}
                          className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer group/item"
                        >
                          <img
                            src={room.images[0]}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                            alt=""
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors" />
                        </button>
                        <button
                          onClick={() => openLightbox(1)}
                          className="col-span-1 row-span-1 relative overflow-hidden cursor-pointer group/item"
                        >
                          <img
                            src={room.images[1]}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                            alt=""
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors" />
                        </button>
                        <button
                          onClick={() => openLightbox(2)}
                          className="col-span-1 row-span-1 relative overflow-hidden cursor-pointer group/item"
                        >
                          <img
                            src={room.images[2]}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                            alt=""
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors" />
                        </button>
                        {/* Optional 4th/5th slots if available, otherwise fill or hide */}
                        {room.images.length >= 4 ? (
                          <button
                            onClick={() => openLightbox(3)}
                            className="col-span-1 row-span-1 relative overflow-hidden cursor-pointer group/item"
                          >
                            <img
                              src={room.images[3]}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                              alt=""
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors" />
                          </button>
                        ) : (
                          <div className="col-span-1 row-span-1 bg-neutral-200" />
                        )}

                        {room.images.length >= 5 ? (
                          <button
                            onClick={() => openLightbox(4)}
                            className="col-span-1 row-span-1 relative overflow-hidden cursor-pointer group/item"
                          >
                            <img
                              src={room.images[4]}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                              alt=""
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover/item:bg-black/30 transition-colors flex items-center justify-center">
                              {room.images.length > 5 && (
                                <span className="text-white font-bold text-lg">
                                  +{room.images.length - 5}
                                </span>
                              )}
                            </div>
                          </button>
                        ) : (
                          <div className="col-span-1 row-span-1 bg-neutral-200" />
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => openLightbox(0)}
                      className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md hover:bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-semibold transition-all flex items-center gap-2 hover:scale-105"
                    >
                      <Images className="w-4 h-4" />
                      Ver todas as fotos ({room.images.length})
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 gap-4">
                    <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center">
                      <Building2 className="w-10 h-10" />
                    </div>
                    <span className="font-medium">Sem imagens disponíveis</span>
                  </div>
                )}
              </div>

              {/* Lightbox Component */}
              <Lightbox
                images={room.images || []}
                initialIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
              />

              {/* Título & Header Info */}
              <div className="bg-white rounded-3xl p-8 shadow-soft border border-neutral-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 leading-tight">
                      {room.title}
                    </h1>
                    {/* Share/Like buttons placeholder */}
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${room.address}, ${room.city || ""}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-lg text-neutral-600 hover:text-primary-600 transition-colors group p-2 -ml-2 rounded-xl hover:bg-primary-50/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-medium underline decoration-neutral-300 underline-offset-4 group-hover:decoration-primary-300">
                      {room.address}
                      {room.city ? `, ${room.city}` : ""}
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </a>
                </div>
              </div>

              {/* Informações Principais - Cards Clean */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col items-center text-center justify-center gap-3 hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-neutral-900">
                      {room.capacity}
                    </span>
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                      Pessoas
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col items-center text-center justify-center gap-3 hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-neutral-900">
                      {room.price_per_day || room.price_per_hour}
                    </span>
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                      / Dia
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col items-center text-center justify-center gap-3 hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-neutral-900">
                      Sim
                    </span>
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                      Verificado
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col items-center text-center justify-center gap-3 hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-neutral-900">
                      Hoje
                    </span>
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                      Disponível
                    </span>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="bg-white rounded-3xl p-8 shadow-soft border border-neutral-100">
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-neutral-600" />
                  </span>
                  Sobre este espaço
                </h3>
                <div className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed text-lg">
                  {room.description ? (
                    room.description.split("\n").map((paragraph, idx) => (
                      <p key={idx} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="italic text-neutral-400">
                      Nenhuma descrição fornecida para este espaço.
                    </p>
                  )}
                </div>
              </div>

              {/* Comodidades - Grid Layout */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-200">
                  <h3 className="text-2xl font-display font-bold text-neutral-900 mb-8">
                    O que este lugar oferece
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    {room.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-neutral-100 hover:border-primary-200 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                          <Check className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-neutral-700">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Owner Actions */}
              {isOwner && (
                <div className="flex gap-4 pt-6 border-t border-neutral-200">
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/app/rooms")}
                  >
                    ← Voltar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/app/rooms/${id}/edit`)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    Deletar
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar - Card Clean com Reserva */}
            {!isOwner && (
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <Card className="p-6 border border-neutral-200 shadow-soft">
                    {showBookingForm ? (
                      <form onSubmit={handleBooking} className="space-y-5">
                        <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-4">
                          <h3 className="text-lg font-bold text-neutral-900">
                            Fazer Reserva
                          </h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowBookingForm(false)}
                            className="text-neutral-400 hover:text-neutral-600 p-1"
                          >
                            ✕
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <DateTimePicker
                            label="Data/Hora de Início"
                            value={bookingData.start_time}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                start_time: e.target.value,
                              })
                            }
                            required
                          />

                          <DateTimePicker
                            label="Data/Hora de Término"
                            value={bookingData.end_time}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                end_time: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        {bookingData.start_time &&
                          bookingData.end_time &&
                          (() => {
                            const pricePerDay =
                              room.price_per_day || room.price_per_hour;
                            const priceCalc = calculatePriceWithDiscounts(
                              pricePerDay,
                              bookingData.start_time,
                              bookingData.end_time,
                            );
                            const discountDesc = getDiscountDescription(
                              priceCalc.days,
                            );

                            // Validar datas
                            const start = new Date(bookingData.start_time);
                            const end = new Date(bookingData.end_time);

                            if (
                              priceCalc.days <= 0 ||
                              priceCalc.total <= 0 ||
                              end <= start
                            ) {
                              return (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex gap-2">
                                  <div className="text-amber-500 mt-0.5">
                                    <MapPin className="w-4 h-4 rotate-180" />
                                  </div>
                                  <p className="text-xs text-amber-800 font-medium">
                                    A data de término deve ser posterior à data
                                    de início.
                                  </p>
                                </div>
                              );
                            }

                            return (
                              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-4">
                                <p className="text-xs text-neutral-500 font-bold mb-2 uppercase tracking-wider">
                                  Resumo do valor
                                </p>
                                {priceCalc.discount > 0 && (
                                  <div className="mb-2">
                                    <p className="text-xs text-neutral-400 line-through">
                                      R$ {priceCalc.basePrice.toFixed(2)}
                                    </p>
                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold mt-1">
                                      <Check className="w-3 h-3" />
                                      {discountDesc}
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-baseline gap-1">
                                  <span className="text-2xl font-bold text-neutral-900">
                                    R$ {priceCalc.total.toFixed(2)}
                                  </span>
                                </div>
                                <p className="text-xs text-neutral-500 mt-1 font-medium">
                                  Total para {priceCalc.days}{" "}
                                  {priceCalc.days === 1 ? "dia" : "dias"}
                                </p>
                              </div>
                            );
                          })()}

                        <Input
                          label="Observações (opcional)"
                          type="textarea"
                          value={bookingData.notes}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              notes: e.target.value,
                            })
                          }
                          rows={2}
                        />

                        {error && (
                          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            {error}
                          </div>
                        )}

                        <Button
                          type="submit"
                          variant="primary"
                          className="w-full mt-2"
                          size="lg"
                          disabled={processingCheckout}
                        >
                          {processingCheckout
                            ? "Processando..."
                            : "Ir para Pagamento"}
                        </Button>
                      </form>
                    ) : (
                      <div className="flex flex-col h-full">
                        {/* Título e Status */}
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-neutral-900 mb-2 leading-tight">
                            {room.title}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                            Sala disponível
                          </span>
                        </div>

                        {/* Sobre a Sala (Breve) */}
                        {room.description && (
                          <div className="mb-6">
                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                              Sobre esta sala
                            </p>
                            <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                              {room.description}
                            </p>
                          </div>
                        )}

                        <div className="border-t border-neutral-100 mb-6" />

                        {/* Preço e Ação */}
                        <div className="mb-6">
                          <span className="text-sm text-neutral-500 font-medium">
                            Valor da diária
                          </span>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-3xl font-bold text-neutral-900">
                              R$ {room.price_per_day || room.price_per_hour}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="primary"
                          onClick={() => setShowBookingForm(true)}
                          className="w-full mb-4"
                          size="lg"
                        >
                          Reservar Agora
                        </Button>

                        <div className="mt-auto text-center">
                          <p className="text-xs text-neutral-400 flex items-center justify-center gap-1.5">
                            <Shield className="w-3 h-3" />
                            Pagamento seguro via Stripe
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
