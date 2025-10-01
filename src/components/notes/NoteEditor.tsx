"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import type { Note, NoteColor } from "@/types/note"
import { PALETTE, getColorClasses } from "@/styles/themes/palette"
import { X, Trash2 } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"
import ConfirmModal from "@/components/common/ConfirmModal"

type Props = {
  note: Note
  onClose: () => void
  onDelete: (id: string) => Promise<void>
  onChange: (id: string, updates: Partial<Note>) => Promise<void>
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
  autoFocus?: boolean
}

export default function NoteEditor({ 
  note, 
  onClose, 
  onDelete, 
  onChange, 
  textareaRef,
  autoFocus = false 
}: Props) {
  const [content, setContent] = useState(note.content || "")
  const [colorTag, setColorTag] = useState<NoteColor>(note.color_tag as NoteColor || "white")
  const [showConfirm, setShowConfirm] = useState(false)
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
      textarea.focus()
      if (autoFocus) {
        setTimeout(() => {
          if (textarea) {
            textarea.setSelectionRange(
              textarea.value.length,
              textarea.value.length
            )
          }
        }, 10)
      }
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
      await onDelete(note.id)
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
  }, [content, colorTag, note.id, note.content, note.color_tag, onDelete, onChange, onClose])

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

  const handleDelete = async () => {
    if (note.id) {
      try {
        await onDelete(note.id)
        setShowConfirm(false)
        onClose()
      } catch (error) {
        console.error("Failed to delete note:", error)
      }
    }
  }

  const handleColorChange = (color: NoteColor) => {
    setColorTag(color)
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={containerRef}
          className="relative rounded-2xl shadow-2xl w-full max-w-2xl bg-white dark:bg-gray-900 flex flex-col max-h-[90vh] border border-gray-200 dark:border-gray-700"
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
              onClick={handleCloseEditor}
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
          />

          <div className="flex items-center justify-between p-4 border-t dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-2xl">
            <div className="flex items-center gap-1 flex-wrap">
              {PALETTE.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color.name)}
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
              onClick={() => setShowConfirm(true)}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 active:from-gray-700 active:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-105"
            >
              <Trash2 size={16} className="transition-transform duration-300 hover:scale-125" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        title={t("common.confirmDeleteTitle")}
        description={t("common.confirmDeleteDesc")}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        confirmLabel={t("common.confirmYes")}
        cancelLabel={t("common.confirmNo")}
        type="delete"
      />
    </>
  )
}