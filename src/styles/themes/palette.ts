import type { NoteColor } from "@/types/note"

export interface PaletteColor {
  name: NoteColor
  classes: string
}

export const PALETTE: PaletteColor[] = [
  { 
    name: "white", 
    classes: "bg-white text-gray-900 border border-gray-300" 
  },
  { 
    name: "gray", 
    classes: "bg-gray-200 text-gray-900 border border-gray-300" 
  },
  { 
    name: "black", 
    classes: "bg-gray-800 text-white border border-gray-700" 
  },
  { 
    name: "pastel-pink", 
    classes: "bg-pink-200 text-gray-900 border border-pink-300" 
  },
  { 
    name: "pastel-red", 
    classes: "bg-red-200 text-gray-900 border border-red-300" 
  },
  { 
    name: "pastel-orange", 
    classes: "bg-orange-200 text-gray-900 border border-orange-300" 
  },
  { 
    name: "pastel-yellow", 
    classes: "bg-yellow-200 text-gray-900 border border-yellow-300" 
  },
  { 
    name: "pastel-green", 
    classes: "bg-green-200 text-gray-900 border border-green-300" 
  },
  { 
    name: "pastel-blue", 
    classes: "bg-blue-200 text-gray-900 border border-blue-300" 
  },
  { 
    name: "pastel-purple", 
    classes: "bg-purple-200 text-gray-900 border border-purple-300" 
  },
]

export function getColorClasses(tag: NoteColor | string): string {
  const color = PALETTE.find((p) => p.name === tag)
  return color ? color.classes : PALETTE[0].classes
}