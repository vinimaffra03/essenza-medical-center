# Estrutura da Aplicação (App.jsx e main.jsx)

## `main.jsx` - Ponto de Entrada

Este é o ponto de entrada da aplicação React. Ele renderiza o componente principal `App`.

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## `App.jsx` - Roteamento e Estrutura Principal

Este arquivo define a estrutura de roteamento da aplicação usando `react-router-dom`. Ele também implementa a lógica para rotas públicas e protegidas com base no estado de autenticação do usuário.

```jsx
// src/App.jsx
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import Layout from './components/Layout'
import Loading from './components/Loading'
import { ToastProvider } from './contexts/ToastContext'

// Telas
import LoginScreen from './features/auth/LoginScreen'
import RegisterScreen from './features/auth/RegisterScreen'
import Dashboard from './features/dashboard/Dashboard'
import RoomList from './features/rooms/RoomList'
import RoomDetails from './features/rooms/RoomDetails'
import RoomForm from './features/rooms/RoomForm'
import BookingList from './features/bookings/BookingList'

// Componente para Rotas Protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore()
  // ... (lógica de carregamento e redirecionamento)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Layout>{children}</Layout>
}

// Componente para Rotas Públicas
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuthStore()
  // ... (lógica de carregamento e redirecionamento)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  const { init } = useAuthStore()

  useEffect(() => {
    init() // Inicializa a sessão de autenticação
  }, [])

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterScreen /></PublicRoute>} />

          {/* Rotas Protegidas */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/rooms" element={<ProtectedRoute><RoomList /></ProtectedRoute>} />
          <Route path="/rooms/new" element={<ProtectedRoute><RoomForm /></ProtectedRoute>} />
          <Route path="/rooms/:id" element={<ProtectedRoute><RoomDetails /></ProtectedRoute>} />
          <Route path="/rooms/:id/edit" element={<ProtectedRoute><RoomForm /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><BookingList /></ProtectedRoute>} />

          {/* Redirecionamento Padrão */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
```
