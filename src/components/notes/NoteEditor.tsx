"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import type { Note, NoteColor } from "@/types/note"
import { PALETTE, getColorClasses } from "@/themes/palette"
import { X, Trash2 } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"

type Props = {
  note: Note
  onClose: () => void
  onDeleteRequest: () => void
  onEmptyClose: (id: string) => Promise<void>
  onChange: (id: string, updates: Partial<Note>) => Promise<void>
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
  autoFocus?: boolean
}

export default function NoteEditor({ 
  note, 
  onClose, 
  onDeleteRequest, 
  onEmptyClose,
  onChange, 
  textareaRef,
  autoFocus = false 
}: Props) {
  const [content, setContent] = useState(note.content || "")
  const [colorTag, setColorTag] = useState<NoteColor>(note.color_tag as NoteColor || "white")
  const { t, locale } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null)
  const actualTextareaRef = textareaRef || internalTextareaRef
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSelectionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 })

  useEffect(() => {
    if (content !== note.content || colorTag !== note.color_tag) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(async () => {
        if (note.id && content.trim() !== "") {
          try {
            await onChange(note.id, { 
              content: content.trim(), 
              color_tag: colorTag 
            })
          } catch (error) {
            console.error("Failed to save note:", error)
          }
        }
      }, 200)
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }
    }
  }, [content, colorTag, note.id, note.content, note.color_tag, onChange])

  const focusTextarea = useCallback(() => {
    const textarea = actualTextareaRef.current
    if (textarea) {
      setTimeout(() => {
        textarea.focus()
        if (lastSelectionRef.current) {
          textarea.setSelectionRange(
            lastSelectionRef.current.start,
            lastSelectionRef.current.end
          )
        } else if (autoFocus) {
          textarea.setSelectionRange(
            textarea.value.length,
            textarea.value.length
          )
        }
      }, 0)
    }
  }, [autoFocus, actualTextareaRef])

  const saveSelection = useCallback(() => {
    const textarea = actualTextareaRef.current
    if (textarea) {
      lastSelectionRef.current = {
        start: textarea.selectionStart,
        end: textarea.selectionEnd
      }
    }
  }, [actualTextareaRef])

  useEffect(() => {
    focusTextarea()
  }, [focusTextarea])

  const handleCloseEditor = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = null
    }

    if (note.id && content.trim() === "") {
      await onEmptyClose(note.id)
    } else if (note.id && (content !== note.content || colorTag !== note.color_tag)) {
      try {
        await onChange(note.id, { 
          content: content.trim(), 
          color_tag: colorTag 
        })
      } catch (error) {
        console.error("Failed to save note before closing:", error)
      }
    }
    
    onClose()
  }, [content, colorTag, note.id, note.content, note.color_tag, onEmptyClose, onChange, onClose])

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement
    
    if (target.closest('[data-preserve-editor]')) {
      return
    }
    
    if (containerRef.current?.contains(target)) {
      return
    }
    
    handleCloseEditor()
  }, [handleCloseEditor])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }
    }
  }, [handleClickOutside])

  const handleColorChange = (color: NoteColor) => {
    saveSelection()
    setColorTag(color)
    setTimeout(focusTextarea, 10)
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    saveSelection()
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    focusTextarea()
  }

  const handleCloseButtonClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    await handleCloseEditor()
  }, [handleCloseEditor])

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div
          ref={containerRef}
          className="relative rounded-xl sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-white dark:bg-gray-900 flex flex-col border border-gray-200 dark:border-gray-700"
          onClick={handleContainerClick}
          data-preserve-editor
        >
          <div className="flex items-center justify-between p-3 sm:p-4 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-t-xl sm:rounded-t-2xl">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {t("notes.lastUpdated")}: {new Date(note.updated_at).toLocaleString(
                locale === "id" ? "id-ID" : "en-US",
                { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit', 
                  minute: '2-digit' 
                }
              )}
            </div>
            
            <button
              onClick={handleCloseButtonClick}
              className="p-1 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-110"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          <textarea
            ref={actualTextareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onSelect={saveSelection}
            placeholder={t("notes.placeholder")}
            className={`flex-1 p-4 sm:p-6 resize-none outline-none border-none ${getColorClasses(colorTag)} min-h-[50vh] sm:min-h-[400px] placeholder-gray-500 text-base sm:text-lg leading-relaxed transition-colors duration-300 cursor-text`}
            autoFocus
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-t dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-xl sm:rounded-b-2xl gap-3 sm:gap-0">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap flex-1 mr-0 sm:mr-4 justify-center sm:justify-start">
              {PALETTE.map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleColorChange(color.name)
                  }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg transition-all duration-300 border ${
                    colorTag === color.name 
                      ? 'ring-1 sm:ring-2 ring-blue-500 ring-offset-1 scale-110 shadow-md' 
                      : 'hover:scale-105 border-transparent hover:shadow-sm'
                  } ${color.classes.split(' ')[0]} ${color.classes.split(' ')[1]}`}
                  title={color.name}
                />
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onDeleteRequest()
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex-shrink-0 text-sm sm:text-base min-w-[120px]"
            >
              <Trash2 size={18} className="sm:w-4 sm:h-4" />
              <span>{t("common.delete")}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}