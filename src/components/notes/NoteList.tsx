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
  onDeleteRequest?: (note: Note) => void
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
        <div 
          className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 cursor-pointer"
          onClick={onAdd}
        >
          <Plus size={28} className="text-blue-500 dark:text-blue-400 transition-transform duration-300 hover:rotate-90" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-xl font-light text-gray-600 dark:text-gray-300">
            {t("notes.empty")}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md leading-relaxed">
            {t("notes.emptyDescription")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300 ${
      animate ? 'opacity-50' : 'opacity-100'
    }`}>
      {notes.map((note) => (
        <div
          key={note.id}
          className={`p-3 sm:p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition-all duration-300 h-32 sm:h-48 flex flex-col border ${getColorClasses(note.color_tag)} group hover:scale-105`}
          onClick={() => onOpen(note)}
        >
          <div className="flex-1 overflow-hidden mb-1 sm:mb-2">
            <p className="text-xs sm:text-sm whitespace-pre-wrap break-words line-clamp-4 sm:line-clamp-6 leading-relaxed">
              {note.content || t("notes.emptyContent")}
            </p>
          </div>
          
          <div className="text-xs pt-2 border-t border-current transition-opacity duration-300 group-hover:opacity-80 opacity-60">
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