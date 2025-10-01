"use client"

import type { Note } from "@/types/note"
import { useI18n } from "@/providers/I18nProvider"
import { getColorClasses } from "@/styles/themes/palette"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"

type Props = {
  notes: Note[]
  onOpen: (note: Note) => void
  onAdd?: () => void
}

export default function NoteList({ notes, onOpen, onAdd }: Props) {
  const { t, locale } = useI18n()
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 300)
    return () => clearTimeout(timer)
  }, [notes])

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <Plus size={40} className="text-gray-500 dark:text-gray-400" />
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
          {t("notes.empty")}
        </p>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
          {t("notes.emptyDescription")}
        </p>
        
        {onAdd && (
          <button
            onClick={onAdd}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mt-4"
            type="button"
          >
            <Plus size={20} />
            <span>{t("notes.addFirstNote")}</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300 ${
      animate ? 'opacity-50' : 'opacity-100'
    }`}>
      {notes.map((note) => (
        <div
          key={note.id}
          className={`p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition-all duration-300 h-48 flex flex-col border ${getColorClasses(note.color_tag)} group hover:scale-105`}
          onClick={() => onOpen(note)}
        >
          <div className="flex-1 overflow-hidden mb-2">
            <p className="text-sm whitespace-pre-wrap break-words line-clamp-7 leading-relaxed">
              {note.content || t("notes.emptyContent")}
            </p>
          </div>
          
          <div className="text-xs pt-2 border-t border-opacity-50 transition-opacity duration-300 group-hover:opacity-80">
            {new Date(note.updated_at).toLocaleDateString(
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
        </div>
      ))}
    </div>
  )
}