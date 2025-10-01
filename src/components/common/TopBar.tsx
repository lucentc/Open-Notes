"use client"

import React, { useMemo, useState, useCallback, useEffect, useRef } from "react"
import { useI18n } from "@/providers/I18nProvider"
import { useTheme } from "@/styles/themes/theme"
import { useNotes } from "@/hooks/useNotes"
import { Plus, Moon, Sun, Search, AlertTriangle, Menu, X } from "lucide-react"

export default function TopBar() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  const { setSearchQuery } = useNotes()
  const [search, setSearch] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isSearchHovered, setIsSearchHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false) // 🔹 Tambahan: untuk efek scroll
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const dateStr = useMemo(() => {
    const now = new Date()
    return now.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }, [locale])

  // 🔹 Tambahan: Deteksi scroll agar header dapat berubah opacity dan shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Tutup menu saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const handleAdd = useCallback(() => {
    window.dispatchEvent(new CustomEvent("addNote:click"))
    setIsMobileMenuOpen(false)
  }, [])

  const handleDeleteAll = useCallback(() => {
    window.dispatchEvent(new CustomEvent("deleteAll:click"))
    setIsMobileMenuOpen(false)
  }, [])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value)
      setSearchQuery(value)
    },
    [setSearchQuery]
  )

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }, [isMobileMenuOpen])

  return (
    <>
      {/* 🔹 Header dengan efek opacity & shadow dinamis */}
      <header
        className={`sticky top-0 z-40 flex items-center justify-between w-full px-4 py-3 backdrop-blur-md border-b transition-all duration-500 ${
          isScrolled
            ? "bg-white/25 dark:bg-gray-900/75 border-gray-200/100 dark:border-gray-700/100 shadow-lg"
            : "bg-white/100 dark:bg-gray-900/100 border-gray-200/50 dark:border-gray-700/50"
        }`}
      >
        {/* Kiri: Logo + Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="flex items-center gap-3 group cursor-pointer transition-all duration-500 hover:scale-105">
            <span className="text-2xl font-bold text-black dark:text-white font-sans tracking-tight transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent group-hover:drop-shadow-lg">
              OpenNotes
            </span>
          </div>
          
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                isSearchFocused
                  ? "text-blue-700 scale-110"
                  : isSearchHovered
                  ? "text-blue-600 scale-105"
                  : "text-gray-800 dark:text-gray-200"
              }`}
              size={20}
              strokeWidth={3}
            />
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

        {/* Tengah: Tanggal */}
        <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-all duration-300 hover:text-gray-900 dark:hover:text-white hover:scale-105 cursor-default">
            {dateStr}
          </span>
        </div>

        {/* Kanan: Tombol Aksi */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2">
            {/* Tambah */}
            <button
              onClick={handleAdd}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-105"
              title={t("topbar.add")}
            >
              <Plus size={18} className="transition-transform duration-300 hover:rotate-90" />
            </button>

            {/* Hapus Semua */}
            <button
              onClick={handleDeleteAll}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-105"
              title={t("topbar.deleteAll")}
            >
              <AlertTriangle size={16} className="transition-transform duration-300 hover:scale-125" />
            </button>

            {/* Bahasa */}
            <button
              onClick={() => setLocale(locale === "en" ? "id" : "en")}
              className="flex items-center justify-center w-9 h-9 rounded-xl border-2 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-105 bg-white/70 dark:bg-gray-800/70 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-gray-300/70 dark:border-gray-600/70 text-gray-700 dark:text-gray-200 text-xs font-medium hover:text-blue-600 dark:hover:text-blue-400"
              title={locale === "en" ? "Switch to Indonesian" : "Ganti ke Inggris"}
            >
              {locale === "en" ? "EN" : "ID"}
            </button>

            {/* Tema */}
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

          {/* Menu Mobile */}
          <button
            ref={hamburgerRef}
            onClick={toggleMobileMenu}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-300 bg-white/70 dark:bg-gray-800/70 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300/70 dark:border-gray-600/70"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden fixed top-16 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="px-4 py-3 space-y-3">
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
            >
              <Plus size={18} />
              <span>{t("topbar.add")}</span>
            </button>

            <button
              onClick={handleDeleteAll}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
            >
              <AlertTriangle size={16} />
              <span>{t("topbar.deleteAll")}</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setLocale(locale === "en" ? "id" : "en")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="text-sm font-medium">{locale === "en" ? "EN" : "ID"}</span>
              </button>

              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {theme === "light" ? (
                  <Moon size={16} className="text-gray-600" />
                ) : (
                  <Sun size={16} className="text-yellow-400" />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {theme === "light" ? t("theme.dark") : t("theme.light")}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
