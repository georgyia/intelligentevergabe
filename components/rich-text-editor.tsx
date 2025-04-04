"use client"

import { useEffect, useState, useRef, useCallback } from "react"

interface RichTextEditorProps {
  initialContent?: string
  onChange?: (content: string) => void
  className?: string
  minHeight?: string
}

export default function RichTextEditor({
  initialContent = "",
  onChange,
  className = "",
  minHeight = "500px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const selectionStateRef = useRef<{
    startOffset: number
    endOffset: number
    startContainer: Node | null
    endContainer: Node | null
  } | null>(null)

  // Initialize the editor once on client-side
  useEffect(() => {
    setIsClient(true)

    if (isClient && editorRef.current && !isInitialized) {
      // Set initial content only once to avoid cursor reset
      editorRef.current.innerHTML = initialContent
      setIsInitialized(true)
    }
  }, [isClient, initialContent, isInitialized])

  // Save selection state before any command execution
  const saveSelection = useCallback(() => {
    if (window.getSelection) {
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        selectionStateRef.current = {
          startOffset: range.startOffset,
          endOffset: range.endOffset,
          startContainer: range.startContainer,
          endContainer: range.endContainer,
        }
      }
    }
  }, [])

  // Restore selection after command execution
  const restoreSelection = useCallback(() => {
    if (window.getSelection && selectionStateRef.current) {
      const sel = window.getSelection()
      if (sel) {
        sel.removeAllRanges()
        const range = document.createRange()

        // Make sure the containers still exist in the DOM
        if (
          document.contains(selectionStateRef.current.startContainer) &&
          document.contains(selectionStateRef.current.endContainer)
        ) {
          try {
            range.setStart(selectionStateRef.current.startContainer, selectionStateRef.current.startOffset)
            range.setEnd(selectionStateRef.current.endContainer, selectionStateRef.current.endOffset)
            sel.addRange(range)
          } catch (e) {
            console.warn("Could not restore selection", e)
          }
        }
      }
    }
  }, [])

  // Function to handle rich text editor commands with selection preservation
  const executeCommand = useCallback(
    (command: string, value: string | undefined = undefined) => {
      if (typeof document === "undefined" || !editorRef.current) return

      // Focus the editor first to ensure commands apply to it
      editorRef.current.focus()

      // Save the current selection
      saveSelection()

      // Execute the command
      document.execCommand(command, false, value)

      // Restore the selection
      setTimeout(() => {
        restoreSelection()

        // Notify parent component of content change
        if (onChange && editorRef.current) {
          onChange(editorRef.current.innerHTML)
        }
      }, 0)
    },
    [onChange, saveSelection, restoreSelection],
  )

  // Debounced content change handler to reduce re-renders
  const handleContentChange = useCallback(() => {
    if (onChange && editorRef.current) {
      // Use requestAnimationFrame to batch updates and prevent layout thrashing
      requestAnimationFrame(() => {
        onChange(editorRef.current!.innerHTML)
      })
    }
  }, [onChange])

  // Set up mutation observer to track content changes without disrupting cursor
  useEffect(() => {
    if (!editorRef.current || !isClient) return

    const observer = new MutationObserver((mutations) => {
      // Only trigger onChange if the mutations affect the content
      const contentChanged = mutations.some(
        (mutation) => mutation.type === "characterData" || mutation.type === "childList",
      )

      if (contentChanged) {
        handleContentChange()
      }
    })

    observer.observe(editorRef.current, {
      childList: true,
      characterData: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [isClient, handleContentChange])

  // Add event listeners for the color picker
  useEffect(() => {
    if (!isClient) return

    const colorPicker = document.getElementById("text-color-picker")
    if (colorPicker) {
      const handleColorChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        executeCommand("foreColor", target.value)
      }

      colorPicker.addEventListener("change", handleColorChange)
      return () => colorPicker.removeEventListener("change", handleColorChange)
    }
  }, [isClient, executeCommand])

  // Handle font size changes with proper focus management
  useEffect(() => {
    if (!isClient) return

    const fontSizeSelect = document.querySelector(".editor-font-size") as HTMLSelectElement
    if (fontSizeSelect && editorRef.current) {
      // Set initial font size
      fontSizeSelect.value = "3" // Default to normal size

      const handleFontSizeChange = (e: Event) => {
        const target = e.target as HTMLSelectElement
        // Save selection before changing focus
        saveSelection()

        // Execute command after a short delay to ensure proper focus
        setTimeout(() => {
          executeCommand("fontSize", target.value)
        }, 10)
      }

      fontSizeSelect.addEventListener("change", handleFontSizeChange)
      return () => fontSizeSelect.removeEventListener("change", handleFontSizeChange)
    }
  }, [isClient, executeCommand, saveSelection])

  // Prevent default behavior for keyboard shortcuts to avoid browser actions
  useEffect(() => {
    if (!editorRef.current || !isClient) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser's default behavior for common formatting shortcuts
      if ((e.ctrlKey || e.metaKey) && ["b", "i", "u", "z", "y"].includes(e.key.toLowerCase())) {
        e.preventDefault()

        // Handle common keyboard shortcuts
        switch (e.key.toLowerCase()) {
          case "b":
            executeCommand("bold")
            break
          case "i":
            executeCommand("italic")
            break
          case "u":
            executeCommand("underline")
            break
          case "z":
            executeCommand("undo")
            break
          case "y":
            executeCommand("redo")
            break
        }
      }
    }

    editorRef.current.addEventListener("keydown", handleKeyDown)
    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [isClient, executeCommand])

  if (!isClient) {
    return <div className="border border-gray-200 rounded p-4">Loading editor...</div>
  }

  return (
    <div className={`border border-gray-200 rounded ${className}`}>
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {/* Font size dropdown */}
        <select className="h-8 px-2 border border-gray-300 rounded text-sm bg-white editor-font-size">
          <option value="3">Normal (16px)</option>
          <option value="1">Klein (12px)</option>
          <option value="4">Mittel (18px)</option>
          <option value="5">Groß (24px)</option>
          <option value="7">Überschrift (36px)</option>
        </select>

        {/* Text formatting buttons */}
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <button
            className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
            title="Bold"
            onMouseDown={(e) => {
              e.preventDefault()
              executeCommand("bold")
            }}
          >
            <span className="font-bold">B</span>
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 border-l border-gray-300"
            title="Italic"
            onMouseDown={(e) => {
              e.preventDefault()
              executeCommand("italic")
            }}
          >
            <span className="italic">I</span>
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 border-l border-gray-300"
            title="Underline"
            onMouseDown={(e) => {
              e.preventDefault()
              executeCommand("underline")
            }}
          >
            <span className="underline">U</span>
          </button>
        </div>

        {/* Text alignment buttons */}
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <button
            className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
            title="Align Left"
            onMouseDown={(e) => {
              e.preventDefault()
              executeCommand("justifyLeft")
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="15" y1="12" x2="3" y2="12"></line>
              <line x1="17" y1="18" x2="3" y2="18"></line>
            </svg>
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 border-l border-gray-300"
            title="Align Center"
            onMouseDown={(e) => {
              e.preventDefault()
              executeCommand("justifyCenter")
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="18" y1="12" x2="6" y2="12"></line>
              <line x1="21" y1="18" x2="3" y2="18"></line>
            </svg>
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 border-l border-gray-300"
            title="Align Right"
            onMouseDown={(e) => {
              e.preventDefault()
              executeCommand("justifyRight")
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="12" x2="9" y2="12"></line>
              <line x1="21" y1="18" x2="3" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* List buttons */}
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <button
            className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
            title="Bullet List"
            onMouseDown={(e) => {
              e.preventDefault()
              executeCommand("insertUnorderedList")
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="9" y1="6" x2="20" y2="6"></line>
              <line x1="9" y1="12" x2="20" y2="12"></line>
              <line x1="9" y1="18" x2="20" y2="18"></line>
              <circle cx="4" cy="6" r="2"></circle>
              <circle cx="4" cy="12" r="2"></circle>
              <circle cx="4" cy="18" r="2"></circle>
            </svg>
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 border-l border-gray-300"
            title="Numbered List"
            onMouseDown={(e) => {
              e.preventDefault()
              executeCommand("insertOrderedList")
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="10" y1="6" x2="21" y2="6"></line>
              <line x1="10" y1="12" x2="21" y2="12"></line>
              <line x1="10" y1="18" x2="21" y2="18"></line>
              <path d="M4 6h1v4"></path>
              <path d="M4 10h2"></path>
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
            </svg>
          </button>
        </div>

        {/* Indent buttons */}
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <button
            className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
            title="Decrease Indent"
            onMouseDown={(e) => {
              e.preventDefault()
              executeCommand("outdent")
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="21" y1="6" x2="11" y2="6"></line>
              <line x1="21" y1="12" x2="11" y2="12"></line>
              <line x1="21" y1="18" x2="11" y2="18"></line>
              <path d="M7 8l-4 4 4 4"></path>
            </svg>
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 border-l border-gray-300"
            title="Increase Indent"
            onMouseDown={(e) => {
              e.preventDefault()
              executeCommand("indent")
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="21" y1="6" x2="11" y2="6"></line>
              <line x1="21" y1="12" x2="11" y2="12"></line>
              <line x1="21" y1="18" x2="11" y2="18"></line>
              <path d="M3 8l4 4-4 4"></path>
            </svg>
          </button>
        </div>

        {/* Color picker */}
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <div className="relative">
            <button
              className="h-8 px-2 flex items-center justify-center hover:bg-gray-100"
              title="Text Color"
              onMouseDown={(e) => {
                e.preventDefault()
                const colorPicker = document.getElementById("text-color-picker")
                if (colorPicker) {
                  colorPicker.click()
                }
              }}
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 3h6l3 7-6 11H9L3 10z"></path>
                  <path d="M9 3l-6 7 6 11"></path>
                </svg>
                <span className="ml-1">Farbe</span>
              </span>
            </button>
            <input type="color" id="text-color-picker" className="absolute opacity-0 w-0 h-0" />
          </div>
        </div>
      </div>

      {/* Rich text editor content area */}
      <div
        ref={editorRef}
        className="p-4"
        style={{ minHeight }}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onKeyDown={(e) => {
          // Prevent propagation of key events that might interfere with editing
          e.stopPropagation()
        }}
      />
    </div>
  )
}

