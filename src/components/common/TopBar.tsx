"use client"

import React, { useMemo, useState, useCallback } from "react"
import { useI18n } from "@/providers/I18nProvider"
import { useTheme } from "@/styles/themes/theme"
import { useNotes } from "@/hooks/useNotes"
import { Plus, Moon, Sun, Search, AlertTriangle } from "lucide-react"

export default function TopBar() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  const { setSearchQuery } = useNotes()
  const [search, setSearch] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isSearchHovered, setIsSearchHovered] = useState(false)

  const dateStr = useMemo(() => {
    const now = new Date()
    return now.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }, [locale])

  const handleAdd = useCallback(() => {
    window.dispatchEvent(new CustomEvent("addNote:click"))
  }, [])

  const handleDeleteAll = useCallback(() => {
    window.dispatchEvent(new CustomEvent("deleteAll:click"))
  }, [])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value)
      setSearchQuery(value)
    },
    [setSearchQuery]
  )

  return (
    <header className="flex items-center justify-between w-full px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="flex items-center gap-3 group cursor-pointer transition-all duration-500 hover:scale-105">
          <span className="text-2xl font-bold text-black dark:text-white font-sans tracking-tight transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent group-hover:drop-shadow-lg">
            OpenNotes
          </span>
        </div>
        
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
            isSearchFocused ? "text-blue-700 scale-110" : isSearchHovered ? "text-blue-600 scale-105" : "text-gray-700 dark:text-gray-300"
          }`} size={20} strokeWidth={3} />
          <input
            type="text"
            placeholder={t("topbar.searchPlaceholder")}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
            className="w-full pl-12 pr-4 py-2.5 rounded-xl border-2 transition-all duration-300 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:shadow-lg focus:scale-105 border-gray-300/70 dark:border-gray-600/70 backdrop-blur-sm hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:scale-102 hover:shadow-md"
          />
        </div>
      </div>
      
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-all duration-300 hover:text-gray-900 dark:hover:text-white hover:scale-105 cursor-default">
          {dateStr}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={handleAdd}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-105"
          title={t("topbar.add")}
        >
          <Plus size={18} className="transition-transform duration-300 hover:rotate-90" />
        </button>

        <button
          onClick={handleDeleteAll}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-105"
          title={t("topbar.deleteAll")}
        >
          <AlertTriangle size={16} className="transition-transform duration-300 hover:scale-125" />
        </button>

        <button
          onClick={() => setLocale(locale === "en" ? "id" : "en")}
          className="flex items-center justify-center w-9 h-9 rounded-xl border-2 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-105 bg-white/70 dark:bg-gray-800/70 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-gray-300/70 dark:border-gray-600/70 text-gray-700 dark:text-gray-200 text-xs font-medium hover:text-blue-600 dark:hover:text-blue-400"
          title={locale === "en" ? "Switch to Indonesian" : "Ganti ke Inggris"}
        >
          {locale === "en" ? "EN" : "ID"}
        </button>

        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex items-center justify-center w-9 h-9 rounded-xl border-2 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-105 bg-white/70 dark:bg-gray-800/70 hover:bg-orange-50 dark:hover:bg-orange-900/30 border-gray-300/70 dark:border-gray-600/70"
          title={theme === "light" ? t("theme.dark") : t("theme.light")}
        >
          {theme === "light" ? (
            <Moon size={16} className="text-gray-600 transition-transform duration-300 hover:scale-125" />
          ) : (
            <Sun size={16} className="text-yellow-400 transition-transform duration-300 hover:scale-125" />
          )}
        </button>
      </div>
    </header>
  )
}