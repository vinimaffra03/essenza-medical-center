// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "../../store/useAuthStore";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Skeleton from "../../components/Skeleton";
import {
  Building2,
  Calendar,
  TrendingUp,
  Users,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  ChevronRight,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Mock data for recent bookings
const mockRecentBookings = [
  {
    id: 1,
    roomName: "Sala Executiva Paulista",
    clientName: "Marina Santos",
    clientAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&q=80",
    date: "2025-01-22",
    time: "09:00 - 12:00",
    status: "confirmed",
    amount: 450.0,
  },
  {
    id: 2,
    roomName: "Creative Hub Faria Lima",
    clientName: "Ricardo Oliveira",
    clientAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&q=80",
    date: "2025-01-22",
    time: "14:00 - 18:00",
    status: "pending",
    amount: 320.0,
  },
  {
    id: 3,
    roomName: "Tech Space Vila Olímpia",
    clientName: "Ana Paula Ferreira",
    clientAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=50&q=80",
    date: "2025-01-23",
    time: "10:00 - 16:00",
    status: "confirmed",
    amount: 890.0,
  },
  {
    id: 4,
    roomName: "Sala Reunião Premium",
    clientName: "Carlos Mendes",
    clientAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=50&q=80",
    date: "2025-01-24",
    time: "08:00 - 10:00",
    status: "cancelled",
    amount: 180.0,
  },
  {
    id: 5,
    roomName: "Coworking Aberto",
    clientName: "Juliana Costa",
    clientAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&q=80",
    date: "2025-01-25",
    time: "09:00 - 18:00",
    status: "confirmed",
    amount: 250.0,
  },
];

// Mock data for revenue chart (last 7 days)
const mockRevenueData = [
  { day: "Seg", revenue: 1200, bookings: 4 },
  { day: "Ter", revenue: 890, bookings: 3 },
  { day: "Qua", revenue: 1450, bookings: 5 },
  { day: "Qui", revenue: 980, bookings: 3 },
  { day: "Sex", revenue: 2100, bookings: 7 },
  { day: "Sáb", revenue: 1680, bookings: 5 },
  { day: "Dom", revenue: 420, bookings: 2 },
];

const Dashboard = () => {
  const { profile, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBookings: 0,
    revenue: 0,
    activeBookings: 0,
  });

  // Determine Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setStats({
        totalRooms: 12,
        totalBookings: 156,
        revenue: 8720,
        activeBookings: 8,
      });
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const isOwner = profile?.role === "owner";
  const isLoading = authLoading || loading;

  // Calculate chart max for scaling
  const maxRevenue = Math.max(...mockRevenueData.map((d) => d.revenue));
  const totalWeekRevenue = mockRevenueData.reduce(
    (sum, d) => sum + d.revenue,
    0,
  );
  const totalWeekBookings = mockRevenueData.reduce(
    (sum, d) => sum + d.bookings,
    0,
  );

  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed":
        return {
          icon: CheckCircle2,
          label: "Confirmada",
          className: "bg-emerald-100 text-emerald-700",
        };
      case "pending":
        return {
          icon: Clock,
          label: "Pendente",
          className: "bg-amber-100 text-amber-700",
        };
      case "cancelled":
        return {
          icon: XCircle,
          label: "Cancelada",
          className: "bg-red-100 text-red-700",
        };
      default:
        return {
          icon: Clock,
          label: status,
          className: "bg-neutral-100 text-neutral-700",
        };
    }
  };

  const StatCard = ({ icon: Icon, label, value, subtext, trend, gradient }) => (
    <Card
      className={`relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 ${gradient} text-white border-0`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-24 h-24 transform rotate-12 translate-x-4 -translate-y-4" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
            <Icon className="w-6 h-6 text-white" />
          </div>
          {subtext && (
            <span
              className={`text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 ${
                trend === "up"
                  ? "bg-emerald-400/30 text-white"
                  : trend === "down"
                    ? "bg-red-400/30 text-white"
                    : "bg-white/20 text-white"
              }`}
            >
              {trend === "up" && <ArrowUpRight className="w-3 h-3" />}
              {trend === "down" && <ArrowDownRight className="w-3 h-3" />}
              {subtext}
            </span>
          )}
        </div>

        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
          <h3 className="text-3xl font-display font-bold tracking-tight">
            {value}
          </h3>
        </div>
      </div>
    </Card>
  );

  const SkeletonCard = () => (
    <div className="h-40 rounded-2xl bg-white p-6 shadow-soft border border-neutral-100">
      <div className="flex justify-between mb-6">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-16 h-6 rounded-lg" />
      </div>
      <Skeleton className="w-24 h-4 mb-2" />
      <Skeleton className="w-16 h-8" />
    </div>
  );

  // Simple Bar Chart Component
  const RevenueChart = () => (
    <div className="h-48 flex items-end justify-between gap-2 px-2">
      {mockRevenueData.map((data, index) => {
        const height = (data.revenue / maxRevenue) * 100;
        return (
          <div
            key={data.day}
            className="flex-1 flex flex-col items-center gap-2 group"
          >
            <div className="w-full relative">
              <div
                className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all duration-500 hover:from-primary-500 hover:to-primary-300 cursor-pointer group-hover:shadow-lg"
                style={{ height: `${height * 1.8}px`, minHeight: "20px" }}
              >
                {/* Tooltip */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                    <div className="font-semibold">
                      R$ {data.revenue.toLocaleString("pt-BR")}
                    </div>
                    <div className="text-neutral-400">
                      {data.bookings} reservas
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-neutral-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                </div>
              </div>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              {data.day}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 flex items-center gap-3">
            {getGreeting()},{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              {profile?.name?.split(" ")[0] || "Usuário"}
            </span>
            <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
          </h1>
          <p className="text-neutral-500 mt-2 font-medium">
            Aqui está o resumo das suas atividades hoje.
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/app/rooms/new">
            <Button variant="outline" size="sm">
              <Building2 className="w-4 h-4 mr-2" />
              Nova Sala
            </Button>
          </Link>
          <Link href="/app/bookings">
            <Button variant="primary" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Ver Agenda
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      {isOwner && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard
                icon={Building2}
                label="Total de Salas"
                value={stats.totalRooms}
                gradient="gradient-primary"
              />
              <StatCard
                icon={Calendar}
                label="Reservas Totais"
                value={stats.totalBookings}
                subtext="+12%"
                trend="up"
                gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
              />
              <StatCard
                icon={TrendingUp}
                label="Receita Total"
                value={`R$ ${stats.revenue.toLocaleString("pt-BR")}`}
                subtext="+8%"
                trend="up"
                gradient="bg-gradient-to-br from-violet-500 to-purple-600"
              />
              <StatCard
                icon={Users}
                label="Reservas Ativas"
                value={stats.activeBookings}
                subtext="Agora"
                gradient="gradient-accent"
              />
            </>
          )}
        </div>
      )}

      {/* Revenue Chart & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  Receita Semanal
                </h2>
                <p className="text-sm text-neutral-500">Últimos 7 dias</p>
              </div>
              <div className="p-2 bg-primary-100 rounded-xl">
                <DollarSign className="w-5 h-5 text-primary-600" />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="w-full h-48" />
                <div className="flex justify-between">
                  <Skeleton className="w-24 h-6" />
                  <Skeleton className="w-24 h-6" />
                </div>
              </div>
            ) : (
              <>
                <RevenueChart />

                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-neutral-500">
                        Total da Semana
                      </p>
                      <p className="text-2xl font-bold text-neutral-900">
                        R$ {totalWeekRevenue.toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-500">Reservas</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {totalWeekBookings}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Recent Bookings Table */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  Reservas Recentes
                </h2>
                <p className="text-sm text-neutral-500">Últimas 5 reservas</p>
              </div>
              <Link
                href="/app/bookings"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
              >
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="w-32 h-4 mb-2" />
                      <Skeleton className="w-24 h-3" />
                    </div>
                    <Skeleton className="w-20 h-6 rounded-full" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Sala
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Data/Hora
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-right py-3 px-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="py-3 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRecentBookings.map((booking) => {
                      const statusConfig = getStatusConfig(booking.status);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <tr
                          key={booking.id}
                          className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors"
                        >
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={booking.clientAvatar}
                                alt={booking.clientName}
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                              />
                              <span className="font-medium text-neutral-900 text-sm">
                                {booking.clientName}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <span className="text-sm text-neutral-600 max-w-[150px] truncate block">
                              {booking.roomName}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="text-sm">
                              <div className="font-medium text-neutral-900">
                                {new Date(booking.date).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                  },
                                )}
                              </div>
                              <div className="text-neutral-500 text-xs">
                                {booking.time}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <span className="font-semibold text-neutral-900 text-sm">
                              R$ {booking.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Link href="/app/rooms" className="group">
          <div className="relative overflow-hidden rounded-2xl h-full min-h-[200px] shadow-medium hover:shadow-strong transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  {isOwner ? "Gerenciar Salas" : "Encontrar Salas"}
                </h3>
                <p className="text-white/80 text-sm mb-4 line-clamp-2">
                  {isOwner
                    ? "Adicione novas salas, edite informações e gerencie a disponibilidade."
                    : "Busque pelo espaço ideal com filtros avançados de localização e preço."}
                </p>
                <span className="inline-flex items-center text-white font-semibold text-sm group-hover:underline">
                  Acessar Agora{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/app/bookings" className="group">
          <div className="relative overflow-hidden rounded-2xl h-full min-h-[200px] shadow-medium hover:shadow-strong transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-700" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  Minhas Reservas
                </h3>
                <p className="text-white/80 text-sm mb-4 line-clamp-2">
                  Visualize seu histórico completo de reservas e próximos
                  agendamentos confirmados.
                </p>
                <span className="inline-flex items-center text-white font-semibold text-sm group-hover:underline">
                  Ver Calendário{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
