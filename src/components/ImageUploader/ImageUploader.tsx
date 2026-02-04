// @ts-nocheck
import React, { useState, useCallback } from 'react'
import { supabase } from '../../services/supabase'
import Button from '../Button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

const ImageUploader = ({ maxImages = 10, onImagesChange }) => {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files)
    
    if (images.length + files.length > maxImages) {
      setError(`Você pode fazer upload de no máximo ${maxImages} imagens`)
      return
    }

    // Validar tipos de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      setError('Apenas imagens JPG, PNG e WEBP são permitidas')
      return
    }

    // Validar tamanho (max 5MB)
    const invalidSize = files.filter(file => file.size > 5 * 1024 * 1024)
    if (invalidSize.length > 0) {
      setError('Imagens devem ter no máximo 5MB')
      return
    }

    // Criar previews
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      url: null,
    }))

    setImages(prev => [...prev, ...newImages])
    setError(null)
    uploadImages(newImages)
  }, [images.length, maxImages])

  const uploadImages = async (imageList) => {
    if (!imageList || imageList.length === 0) return

    const uploadedUrls = []
    
    try {
      setUploading(true)
      
      for (const imageObj of imageList) {
        const fileExt = imageObj.file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `rooms/${fileName}`

        // Marcar como upload em progresso
        setImages(prev => prev.map(img => 
          img.preview === imageObj.preview 
            ? { ...img, uploading: true }
            : img
        ))

        // Fazer upload
        const { data, error } = await supabase.storage
          .from('rooms-images')
          .upload(filePath, imageObj.file)

        if (error) throw error

        const { data: { publicUrl } } = supabase
          .storage
          .from('rooms-images')
          .getPublicUrl(data.path)

        // Atualizar com URL final
        setImages(prev => prev.map(img => 
          img.preview === imageObj.preview 
            ? { ...img, url: publicUrl, uploading: false }
            : img
        ))

        uploadedUrls.push(publicUrl)
      }

      // Notificar componente pai
      if (onImagesChange) {
        const finalUrls = images
          .filter(img => img.url)
          .map(img => img.url)
          .concat(uploadedUrls)
        onImagesChange(finalUrls)
      }

    } catch (err) {
      console.error('Error uploading images:', err)
      let errorMessage = err.message || 'Erro ao fazer upload das imagens'
      
      // Mensagem mais amigável para bucket não encontrado
      if (err.message?.includes('Bucket not found') || err.message?.includes('not found')) {
        errorMessage = 'Bucket de storage não configurado. Execute o script CRIAR-BUCKET-STORAGE.sql no Supabase.'
      }
      
      setError(errorMessage)
      // Remover imagens que falharam
      setImages(prev => prev.filter(img => !imageList.some(io => io.preview === img.preview)))
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    const imageToRemove = images[index]
    
    // Se já foi feito upload, deletar do storage
    if (imageToRemove.url) {
      const fileName = imageToRemove.url.split('/').pop()
      supabase.storage
        .from('rooms-images')
        .remove([`rooms/${fileName}`])
        .catch(console.error)
    }

    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index)
      if (onImagesChange) {
        const urls = newImages
          .filter(img => img.url)
          .map(img => img.url)
        onImagesChange(urls)
      }
      return newImages
    })

    // Revogar preview URL
    if (imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview)
    }
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      const fakeEvent = {
        target: {
          files: files
        }
      }
      handleFileSelect(fakeEvent)
    }
  }, [handleFileSelect])

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-4">
      {/* Upload área */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={uploading || images.length >= maxImages}
        />

        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600 mb-1">
          Arraste imagens aqui ou clique para selecionar
        </p>
        <p className="text-sm text-gray-500">
          PNG, JPG, WEBP até 5MB ({images.length}/{maxImages})
        </p>
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Pré-visualização */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url || image.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              
              {/* Overlay com botão remover */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-opacity flex items-center justify-center"
              >
                {image.uploading ? (
                  <div className="text-white">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <X className="text-white opacity-0 group-hover:opacity-100" />
                )}
              </button>

              {image.uploading && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center">
                  Enviando...
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUploader

