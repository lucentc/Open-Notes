"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabaseClient"
import type { Note, NoteColor } from "@/types/note"
import { SUPABASE_TABLES } from "@/config/constants"
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.NOTES)
        .select("*")
        .order("updated_at", { ascending: false })
      
      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const addNote = useCallback(async (content = "", colorTag: NoteColor = "white") => {
    try {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.NOTES)
        .insert([{ 
          content: content.trim(), 
          color_tag: colorTag 
        }])
        .select()
        .single()

      if (error) throw error
      
      setNotes(prev => [data, ...prev])
      return data
    } catch (error) {
      console.error("Failed to add note:", error)
      return null
    }
  }, [])

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    if (!id) return null
    
    try {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.NOTES)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      
      if (data) {
        setNotes(prev => {
          const filtered = prev.filter(note => note.id !== id)
          return [data, ...filtered]
        })
      }
      return data
    } catch (error) {
      console.error("Failed to update note:", error)
      return null
    }
  }, [])

  const deleteNote = useCallback(async (id: string) => {
    if (!id) return false
    
    try {
      const { error } = await supabase
        .from(SUPABASE_TABLES.NOTES)
        .delete()
        .eq("id", id)

      if (error) throw error
      
      setNotes(prev => prev.filter(note => note.id !== id))
      return true
    } catch (error) {
      console.error("Failed to delete note:", error)
      return false
    }
  }, [])

  const deleteAll = useCallback(async () => {
    try {
      const { error } = await supabase
        .from(SUPABASE_TABLES.NOTES)
        .delete()
        .gte('created_at', '1970-01-01')

      if (error) throw error
      
      setNotes([])
      return true
    } catch (error) {
      console.error("Failed to delete all notes:", error)
      return false
    }
  }, [])

  useEffect(() => {
    fetchNotes()

    const subscription = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: SUPABASE_TABLES.NOTES,
        },
        (payload: RealtimePostgresChangesPayload<Note>) => {
          switch (payload.eventType) {
            case 'INSERT':
              setNotes(prev => [payload.new as Note, ...prev])
              break
            case 'UPDATE':
              setNotes(prev => {
                const filtered = prev.filter(note => note.id !== payload.new.id)
                return [payload.new as Note, ...filtered]
              })
              break
            case 'DELETE':
              setNotes(prev => prev.filter(note => note.id !== payload.old.id))
              break
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchNotes])

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    deleteAll,
  }
}