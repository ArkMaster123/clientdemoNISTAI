import { useState, useCallback } from 'react'

interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastOptions | null>(null)

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options)
    setTimeout(() => {
      setToast(null)
    }, options.duration || 3000)
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  return { toast, showToast, hideToast }
}