export interface Note {
  id: string
  content: string
  created_at: string
  updated_at: string
  color_tag: NoteColor
}

export interface NoteUpdate {
  content?: string
  color_tag?: NoteColor
}

export type NoteColor =
  | 'white' | 'gray' | 'black'
  | 'pastel-pink' | 'pastel-red' | 'pastel-orange' | 'pastel-yellow'
  | 'pastel-green' | 'pastel-blue' | 'pastel-purple'