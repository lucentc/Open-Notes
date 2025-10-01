"use client"

import React from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"

type Props = {
  open: boolean
  title?: string
  description?: string
  onCancel: () => void
  onConfirm: () => void
  confirmLabel?: string
  cancelLabel?: string
  type?: "delete" | "deleteAll"
}

export default function ConfirmModal({
  open,
  title = "Konfirmasi",
  description = "",
  onCancel,
  onConfirm,
  confirmLabel = "Ya",
  cancelLabel = "Batal",
  type = "delete"
}: Props) {
  const { t } = useI18n()
  
  if (!open) return null

  const isDeleteAll = type === "deleteAll"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        onClick={onCancel}
        role="presentation"
      />
      
      <div className="relative z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-md w-full transform transition-all duration-300 scale-95 hover:scale-100 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-xl ${
            isDeleteAll 
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}>
            {isDeleteAll ? (
              <AlertTriangle size={24} className="transition-transform duration-300 hover:scale-110" />
            ) : (
              <Trash2 size={24} className="transition-transform duration-300 hover:scale-110" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isDeleteAll ? t("common.confirmDeleteAllTitle") : title}
          </h3>
        </div>
        
        {description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            {description}
          </p>
        )}
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-200"
            type="button"
          >
            {cancelLabel}
          </button>
          
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-white transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 ${
              isDeleteAll 
                ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                : "bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
            }`}
            type="button"
          >
            {isDeleteAll ? <AlertTriangle size={16} /> : <Trash2 size={16} />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}