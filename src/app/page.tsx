"use client"

import { useNotes } from "@/hooks/useNotes"
import NoteList from "@/components/notes/NoteList"
import NoteEditor from "@/components/notes/NoteEditor"
import { useI18n } from "@/providers/I18nProvider"
import { useEffect, useState, useCallback, useRef } from "react"
import type { Note } from "@/types/note"
import ConfirmModal from "@/components/common/ConfirmModal"

export default function HomePage() {
  const { t } = useI18n()
  const { notes, loading, deleteNote, updateNote, addNote, deleteAll } = useNotes()
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false)
  const [newNoteAdded, setNewNoteAdded] = useState(false)
  const [operationStatus, setOperationStatus] = useState<{
    type: 'success' | 'error',
    message: string
  } | null>(null)
  const editorTextareaRef = useRef<HTMLTextAreaElement>(null)

  const showOperationStatus = useCallback((type: 'success' | 'error', message: string) => {
    setOperationStatus({ type, message })
    setTimeout(() => setOperationStatus(null), 3000)
  }, [])

  const handleNoteClick = useCallback((note: Note) => {
    setActiveNote(note)
    setNewNoteAdded(false)
  }, [])

  const handleAddNote = useCallback(async () => {
    try {
      const newNote = await addNote("", "white")
      if (newNote) {
        setActiveNote(newNote)
        setNewNoteAdded(true)
      }
    } catch (error) {
      console.error("Failed to add note:", error)
    }
  }, [addNote])

  useEffect(() => {
    if (newNoteAdded && activeNote && editorTextareaRef.current) {
      editorTextareaRef.current.focus()
      editorTextareaRef.current.setSelectionRange(
        editorTextareaRef.current.value.length,
        editorTextareaRef.current.value.length
      )
      setNewNoteAdded(false)
    }
  }, [newNoteAdded, activeNote])

  const handleUpdateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    try {
      await updateNote(id, updates)
    } catch (error) {
      console.error("Failed to update note:", error)
    }
  }, [updateNote])

  const handleDeleteNote = useCallback(async (id: string) => {
    try {
      const success = await deleteNote(id)
      if (success) {
        setActiveNote(null)
      }
    } catch (error) {
      console.error("Failed to delete note:", error)
    }
  }, [deleteNote])

  const confirmDeleteAll = useCallback(async () => {
    try {
      setOperationStatus(null)
      const success = await deleteAll()
      
      if (success) {
        setActiveNote(null)
        setShowConfirmDeleteAll(false)
        showOperationStatus('success', t("topbar.deleteAllSuccess"))
      }
    } catch (error) {
      console.error("Failed to delete all notes:", error)
    }
  }, [deleteAll, t, showOperationStatus])

  useEffect(() => {
    const handleOpenNote = (event: Event) => {
      const customEvent = event as CustomEvent<Note>
      if (customEvent.detail) {
        setActiveNote(customEvent.detail)
        setNewNoteAdded(false)
      }
    }

    const handleNotesCleared = () => {
      setActiveNote(null)
    }

    const handleDeleteAllClick = () => {
      setShowConfirmDeleteAll(true)
    }

    const handleAddNoteClick = () => {
      handleAddNote()
    }

    window.addEventListener("note:open", handleOpenNote)
    window.addEventListener("notes:cleared", handleNotesCleared)
    window.addEventListener("deleteAll:click", handleDeleteAllClick)
    window.addEventListener("addNote:click", handleAddNoteClick)

    return () => {
      window.removeEventListener("note:open", handleOpenNote)
      window.removeEventListener("notes:cleared", handleNotesCleared)
      window.removeEventListener("deleteAll:click", handleDeleteAllClick)
      window.removeEventListener("addNote:click", handleAddNoteClick)
    }
  }, [handleAddNote])

  return (
    <div className="w-full max-w-7xl mx-auto">
      {operationStatus && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg ${
          operationStatus.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex items-center justify-between min-w-[200px]">
            <span className="text-sm font-medium">{operationStatus.message}</span>
            <button 
              onClick={() => setOperationStatus(null)}
              className="ml-4 hover:opacity-70 text-lg"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500 dark:text-gray-400">
            {t("common.loading")}
          </span>
        </div>
      ) : (
        <NoteList 
          notes={notes} 
          onOpen={handleNoteClick}
          onAdd={handleAddNote}
        />
      )}

      {activeNote && (
        <NoteEditor
          note={activeNote}
          onClose={() => setActiveNote(null)}
          onDelete={handleDeleteNote}
          onChange={handleUpdateNote}
          textareaRef={editorTextareaRef}
          autoFocus={newNoteAdded}
        />
      )}

      <ConfirmModal
        open={showConfirmDeleteAll}
        title={t("common.confirmDeleteAllTitle")}
        description={t("common.confirmDeleteAllDesc")}
        onCancel={() => setShowConfirmDeleteAll(false)}
        onConfirm={confirmDeleteAll}
        confirmLabel={t("common.confirmYes")}
        cancelLabel={t("common.confirmNo")}
        type="deleteAll"
      />
    </div>
  )
}