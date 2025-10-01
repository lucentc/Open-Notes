import "@/styles/globals.css"
import TopBar from "@/components/common/TopBar"
import { ThemeProvider } from "@/styles/themes/theme"
import { I18nProvider } from "@/providers/I18nProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className="antialiased"
    >
      <body className="bg-[var(--bg)] text-[var(--fg)] min-h-screen flex flex-col">
        <ThemeProvider>
          <I18nProvider>
            <TopBar />
            
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
              {children}
            </main>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}