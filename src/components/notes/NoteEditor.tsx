"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import type { Note, NoteColor } from "@/types/note"
import { PALETTE, getColorClasses } from "@/styles/themes/palette"
import { X, Trash2 } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"

type Props = {
  note: Note
  onClose: () => void
  onDeleteRequest: () => void
  onChange: (id: string, updates: Partial<Note>) => Promise<void>
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
  autoFocus?: boolean
}

export default function NoteEditor({ 
  note, 
  onClose, 
  onDeleteRequest, 
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
        if (autoFocus) {
          textarea.setSelectionRange(
            textarea.value.length,
            textarea.value.length
          )
        }
      }, 0)
    }
  }, [autoFocus, actualTextareaRef])

  useEffect(() => {
    focusTextarea()
  }, [focusTextarea])

  const handleCloseEditor = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = null
    }

    if (note.id && content.trim() === "") {
      onDeleteRequest()
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
  }, [content, colorTag, note.id, note.content, note.color_tag, onDeleteRequest, onChange, onClose])

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
    setColorTag(color)
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    focusTextarea()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={containerRef}
          className="relative rounded-2xl shadow-2xl w-full max-w-2xl bg-white dark:bg-gray-900 flex flex-col max-h-[90vh] border border-gray-200 dark:border-gray-700"
          onClick={handleContainerClick}
          data-preserve-editor
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-t-2xl">
            <div className="text-sm text-gray-600 dark:text-gray-400">
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
              onClick={(e) => {
                e.stopPropagation()
                handleCloseEditor()
              }}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>

          <textarea
            ref={actualTextareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={t("notes.placeholder")}
            className={`flex-1 p-6 resize-none outline-none border-none ${getColorClasses(colorTag)} min-h-[400px] placeholder-gray-500 text-lg leading-relaxed transition-colors duration-300 cursor-text`}
            autoFocus
          />

          <div className="flex items-center justify-between p-4 border-t dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-2xl">
            <div className="flex items-center gap-2 flex-wrap flex-1 mr-4">
              {PALETTE.map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleColorChange(color.name)
                  }}
                  className={`w-7 h-7 rounded-lg transition-all duration-300 border-2 ${
                    colorTag === color.name 
                      ? 'ring-2 ring-blue-500 ring-offset-1 scale-110 shadow-md' 
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex-shrink-0"
            >
              <Trash2 size={18} className="transition-transform duration-300" />
              <span>{t("common.delete")}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}