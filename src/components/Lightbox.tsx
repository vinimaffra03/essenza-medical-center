// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

const Lightbox = ({ images, initialIndex = 0, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)

  // Reset index when opening with new initialIndex
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setIsZoomed(false)
    }
  }, [isOpen, initialIndex])

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return

    switch (e.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowLeft':
        goToPrevious()
        break
      case 'ArrowRight':
        goToNext()
        break
      default:
        break
    }
  }, [isOpen, onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setIsZoomed(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setIsZoomed(false)
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  if (!isOpen || !images || images.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 group"
        aria-label="Fechar"
      >
        <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Zoom button */}
      <button
        onClick={toggleZoom}
        className="absolute top-4 right-20 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 group"
        aria-label={isZoomed ? 'Diminuir zoom' : 'Aumentar zoom'}
      >
        {isZoomed ? (
          <ZoomOut className="w-6 h-6 group-hover:scale-110 transition-transform" />
        ) : (
          <ZoomIn className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 z-50 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 group"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 group"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Main image */}
      <div
        className={`relative z-10 max-w-[90vw] max-h-[85vh] transition-transform duration-300 ${
          isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'
        }`}
        onClick={toggleZoom}
      >
        <img
          src={images[currentIndex]}
          alt={`Imagem ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          draggable={false}
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-black/50 backdrop-blur-md max-w-[90vw] overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx)
                  setIsZoomed(false)
                }}
                className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all duration-200 ${
                  idx === currentIndex
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50 scale-110'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard hint */}
      <div className="absolute bottom-4 right-4 z-50 hidden md:flex items-center gap-4 text-white/50 text-xs">
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 rounded bg-white/10">←</kbd>
          <kbd className="px-2 py-1 rounded bg-white/10">→</kbd>
          navegar
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 rounded bg-white/10">ESC</kbd>
          fechar
        </span>
      </div>
    </div>
  )
}

export default Lightbox
