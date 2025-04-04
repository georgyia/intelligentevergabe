"use client"

import { useState } from "react"
import DocumentEditor from "@/components/document-editor"
import { Button } from "@/components/ui/button"
import { ToastProvider } from "@/components/ui/use-toast"

export default function VermerkErstellenPage() {
  const [documentContent, setDocumentContent] = useState("")

  const handleSave = async (content: string) => {
    // Simulate API call with a delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Document saved:", content)
        setDocumentContent(content)
        resolve()
      }, 800)
    })
  }

  return (
    <ToastProvider>
      <div className="container mx-auto p-4 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">Vergabevermerk erstellen</h1>

        <DocumentEditor
          title="Vergabevermerk, Teil I"
          onSave={handleSave}
          autoSaveInterval={60000} // Auto-save every minute
        />

        <div className="mt-6 flex justify-between">
          <Button variant="outline">Zurück</Button>
          <Button>Weiter</Button>
        </div>
      </div>
    </ToastProvider>
  )
}

