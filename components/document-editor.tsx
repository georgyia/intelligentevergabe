"use client"

import { useState, useRef, useEffect } from "react"
import RichTextEditor from "./rich-text-editor"
import { Button } from "@/components/ui/button"
import { Download, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DocumentEditorProps {
  title: string
  initialContent?: string
  onSave?: (content: string) => void
  autoSaveInterval?: number // in milliseconds
}

export default function DocumentEditor({
  title,
  initialContent,
  onSave,
  autoSaveInterval = 30000, // Default to 30 seconds
}: DocumentEditorProps) {
  const [content, setContent] = useState(initialContent || getDefaultContent())
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const contentRef = useRef(content)
  const { toast } = useToast()

  // Update the ref whenever content changes
  useEffect(() => {
    contentRef.current = content
  }, [content])

  // Set up auto-save
  useEffect(() => {
    if (!onSave || autoSaveInterval <= 0) return

    const interval = setInterval(() => {
      // Only auto-save if content has changed since last save
      if (contentRef.current !== initialContent) {
        handleSave(true)
      }
    }, autoSaveInterval)

    return () => clearInterval(interval)
  }, [onSave, autoSaveInterval, initialContent])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleSave = async (isAutoSave = false) => {
    if (isSaving) return

    setIsSaving(true)

    try {
      // Here you would typically save to a database
      if (onSave) {
        await onSave(content)
      }

      setLastSaved(new Date())

      if (!isAutoSave) {
        toast({
          title: "Dokument gespeichert",
          description: `${title} wurde erfolgreich gespeichert.`,
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error saving document:", error)
      toast({
        title: "Fehler beim Speichern",
        description: "Das Dokument konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadPDF = () => {
    // Create a new window/document for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast({
        title: "Download fehlgeschlagen",
        description: "Bitte erlauben Sie Pop-ups für diese Seite, um den Download zu ermöglichen.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    // Add content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              margin: 30px;
            }
            h1 {
              font-size: 18px;
              margin-bottom: 20px;
            }
            h2 {
              font-size: 16px;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            p {
              margin-bottom: 10px;
            }
            ul, ol {
              margin-bottom: 10px;
              padding-left: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .footer {
              text-align: center;
              margin-top: 50px;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body {
                margin: 0;
                padding: 20px;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>Aktenzeichen: VG-2023-0042</p>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>Erstellt am: ${new Date().toLocaleDateString("de-DE")}</p>
            ${lastSaved ? `<p>Zuletzt gespeichert: ${lastSaved.toLocaleString("de-DE")}</p>` : ""}
          </div>
          <div class="no-print">
            <p style="text-align: center; margin-top: 30px;">
              <button onclick="window.print(); setTimeout(() => window.close(), 500);" style="padding: 10px 20px; background-color: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Als PDF speichern
              </button>
            </p>
          </div>
          <script>
            // Auto-trigger print dialog after a short delay
            setTimeout(() => {
              window.print();
              // Close the window after printing (or canceling)
              setTimeout(() => window.close(), 500);
            }, 1000);
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="font-medium">{title}</h3>
          {lastSaved && (
            <span className="ml-4 text-xs text-gray-500">
              Zuletzt gespeichert: {lastSaved.toLocaleTimeString("de-DE")}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => handleSave()}
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Speichern..." : "Speichern"}
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4" />
            Herunterladen
          </Button>
        </div>
      </div>
      <div className="p-4">
        <RichTextEditor initialContent={content} onChange={handleContentChange} minHeight="500px" />

        {/* Add a note about the editor functionality */}
        <div className="text-xs text-gray-500 mt-2">
          Hinweis: Verwenden Sie die Formatierungsoptionen in der Symbolleiste, um den Text zu formatieren. Markieren
          Sie Text, um Formatierungen anzuwenden. Drücken Sie Strg+B für Fett, Strg+I für Kursiv und Strg+U für
          Unterstrichen.
        </div>
      </div>
    </div>
  )
}

function getDefaultContent() {
  return `<div style="font-size: 16px; line-height: 1.5;">
    <p><strong>Vergabevermerk für das Projekt VG-2023-0042</strong></p>
    <br>
    <p><strong>Auftraggeber:</strong> Landeshauptstadt München</p>
    <p><strong>Aktenzeichen:</strong> VG-2023-0042</p>
    <p><strong>Auftragsgegenstand:</strong> Beschaffung von Büroausstattung</p>
    <p><strong>Vergabeverfahren:</strong> Öffentliche Ausschreibung</p>
    <br>
    <p>Die Landeshauptstadt München hat die Beschaffung von Büroausstattung für die neue Verwaltungsstelle im Stadtbezirk Schwabing-West ausgeschrieben. Die Ausschreibung erfolgte im Rahmen eines offenen Verfahrens nach UVgO.</p>
    <br>
    <p>Die Vergabe erfolgte nach der Unterschwellenvergabeordnung (UVgO) im Wege einer öffentlichen Ausschreibung. Die Bekanntmachung wurde am 15.02.2023 veröffentlicht. Die Angebotsfrist endete am 15.04.2023 um 12:00 Uhr.</p>
    <br>
    <p><strong>Der Leistungsumfang umfasst:</strong></p>
    <ul>
      <li>Lieferung von 120 höhenverstellbaren Schreibtischen</li>
      <li>Lieferung von 120 ergonomischen Bürostühlen</li>
      <li>Lieferung und Montage von 40 Aktenschränken</li>
      <li>Lieferung und Montage von 15 Besprechungstischen</li>
      <li>Lieferung von 60 Besucherstühlen</li>
    </ul>
    <br>
    <p><strong>Die Bewertung der Angebote erfolgte nach folgenden Kriterien:</strong></p>
    <ul>
      <li>Preis: 60%</li>
      <li>Qualität: 30%</li>
      <li>Lieferzeit: 10%</li>
    </ul>
  </div>`
}

