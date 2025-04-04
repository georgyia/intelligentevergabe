"use client"

// This is a simplified version of the toast component
// In a real application, you would use a proper toast library or the shadcn/ui toast component

import { createContext, useContext, useState, type ReactNode } from "react"

type ToastVariant = "default" | "destructive" | "success"

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  toast: (props: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (props: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, ...props }
    setToasts((prev) => [...prev, newToast])

    // Auto-dismiss toast after duration
    if (props.duration !== 0) {
      setTimeout(() => {
        dismiss(id)
      }, props.duration || 3000)
    }

    return id
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-4 rounded-md shadow-md bg-white border ${
                toast.variant === "destructive"
                  ? "border-red-500"
                  : toast.variant === "success"
                    ? "border-green-500"
                    : "border-gray-200"
              }`}
            >
              {toast.title && <h4 className="font-medium">{toast.title}</h4>}
              {toast.description && <p className="text-sm text-gray-600">{toast.description}</p>}
              <button
                className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
                onClick={() => dismiss(toast.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

