/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
    "./src/context/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {},
      borderRadius: {
        'lg-2': '14px'
      }
    },
  },
  plugins: [],
  safelist: [
    "bg-white",
    "dark:bg-neutral-100",
    "bg-gray-200",
    "dark:bg-gray-600",
    "bg-black",
    "dark:bg-neutral-800",
    "text-white",
    "bg-pink-200",
    "dark:bg-pink-600",
    "bg-red-200",
    "dark:bg-red-600",
    "bg-orange-200",
    "dark:bg-orange-600",
    "bg-yellow-200",
    "dark:bg-yellow-600",
    "bg-green-200",
    "dark:bg-green-600",
    "bg-emerald-200",
    "dark:bg-emerald-600",
    "bg-teal-200",
    "dark:bg-teal-600",
    "bg-sky-200",
    "dark:bg-sky-600",
    "bg-blue-200",
    "dark:bg-blue-600",
    "bg-indigo-200",
    "dark:bg-indigo-600",
    "bg-purple-200",
    "dark:bg-purple-600",
    "bg-violet-200",
    "dark:bg-violet-600",
    "bg-rose-200",
    "dark:bg-rose-600",
    "border-gray-200",
    "dark:border-gray-700",
    "ring-black/60",
    "dark:ring-white/60"
  ],
}
