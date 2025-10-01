"use client"

import React, { useState } from "react"
import type { Note, NoteColor } from "@/types/note"
import { useI18n } from "@/providers/I18nProvider"
import { getColorClasses } from "@/themes/palette"
import { Edit3, Trash2 } from "lucide-react"

interface NoteCardProps {
  note: Note
  onUpdate?: (id: string, updates: Partial<Note>) => void
  onDeleteRequest?: (note: Note) => void
  onClick?: () => void
  editable?: boolean
}

const BASIC_COLORS: NoteColor[] = [
  'white', 'gray', 'black', 'pastel-pink', 'pastel-red', 'pastel-orange', 
  'pastel-yellow', 'pastel-green', 'pastel-blue', 'pastel-purple'
]

export default function NoteCard({ 
  note, 
  onUpdate, 
  onDeleteRequest, 
  onClick,
  editable = false
}: NoteCardProps) {
  const { t, locale } = useI18n()
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(note.content)

  const handleBlur = () => {
    if (content !== note.content && onUpdate) {
      onUpdate(note.id, { content })
    }
    setIsEditing(false)
  }

  const handleColorChange = (color: NoteColor) => {
    onUpdate?.(note.id, { color_tag: color })
  }

  const handleCardClick = () => {
    if (editable && isEditing) return
    onClick?.()
  }

  const preview = note.content 
    ? note.content.split('\n')[0].slice(0, 100) 
    : t("notes.empty")
  
  const snippet = note.content 
    ? note.content.slice(0, 200) 
    : ""

  return ( 
    <div
      onClick={handleCardClick}
      className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 h-32 sm:h-48 flex flex-col border ${getColorClasses(note.color_tag)} group hover:scale-105 shadow-sm hover:shadow-lg`}
    >
      {(editable && (onUpdate || onDeleteRequest)) && (
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          {onUpdate && (
            <div className="flex gap-1 flex-wrap">
              {BASIC_COLORS.map(color => (
                <button
                  key={color}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                    note.color_tag === color 
                      ? 'ring-1 ring-gray-400 scale-110 border-2 border-gray-600' 
                      : 'border border-gray-400/50 hover:border-gray-500 hover:scale-110'
                  } ${color === 'gray' ? 'bg-gray-200' : color === 'white' ? 'bg-white' : color === 'black' ? 'bg-gray-800' : color === 'pastel-pink' ? 'bg-pink-200' : color === 'pastel-red' ? 'bg-red-200' : color === 'pastel-orange' ? 'bg-orange-200' : color === 'pastel-yellow' ? 'bg-yellow-200' : color === 'pastel-green' ? 'bg-green-200' : color === 'pastel-blue' ? 'bg-blue-200' : 'bg-purple-200'}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleColorChange(color)
                  }}
                  title={color}
                />
              ))}
            </div>
          )}
          
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {onUpdate && (
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(!isEditing)
                }}
                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <Edit3 size={10} className="sm:w-3 sm:h-3" />
              </button>
            )}
            {onDeleteRequest && (
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteRequest(note)
                }}
                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <Trash2 size={10} className="sm:w-3 sm:h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          className="w-full flex-1 p-2 border rounded-lg resize-none text-sm bg-transparent transition-all duration-300"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <>
          <h3 className="font-medium text-xs sm:text-base mb-1 sm:mb-2 line-clamp-2 leading-tight">
            {preview}
          </h3>
          <p className="text-xs sm:text-sm flex-1 overflow-hidden line-clamp-3 sm:line-clamp-4 leading-relaxed opacity-90">
            {snippet}
          </p>
        </>
      )}
      
      <div className="text-xs pt-2 border-t border-current transition-opacity duration-300 group-hover:opacity-80 opacity-60">
        {new Date(note.updated_at).toLocaleDateString(locale, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  )
}