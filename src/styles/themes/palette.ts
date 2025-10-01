import type { NoteColor } from "@/types/note"

export interface PaletteColor {
  name: NoteColor
  classes: string
}

export const PALETTE: PaletteColor[] = [
  { 
    name: "white", 
    classes: "bg-white dark:bg-white text-gray-900 dark:text-gray-900 border border-gray-300 dark:border-gray-400" 
  },
  { 
    name: "gray", 
    classes: "bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-500" 
  },
  { 
    name: "black", 
    classes: "bg-gray-900 dark:bg-black text-white dark:text-white border border-gray-800 dark:border-gray-700" 
  },
  { 
    name: "pastel-pink", 
    classes: "bg-pink-200 dark:bg-pink-800 text-pink-900 dark:text-pink-100 border border-pink-300 dark:border-pink-700" 
  },
  { 
    name: "pastel-red", 
    classes: "bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 border border-red-300 dark:border-red-700" 
  },
  { 
    name: "pastel-orange", 
    classes: "bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100 border border-orange-300 dark:border-orange-700" 
  },
  { 
    name: "pastel-yellow", 
    classes: "bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-700" 
  },
  { 
    name: "pastel-green", 
    classes: "bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 border border-green-300 dark:border-green-700" 
  },
  { 
    name: "pastel-blue", 
    classes: "bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 border border-blue-300 dark:border-blue-700" 
  },
  { 
    name: "pastel-purple", 
    classes: "bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 border border-purple-300 dark:border-purple-700" 
  },
]

export function getColorClasses(tag: NoteColor | string): string {
  const color = PALETTE.find((p) => p.name === tag)
  return color ? color.classes : PALETTE[0].classes
}