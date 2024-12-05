import React from 'react'
import { LiteFlowProvider } from '@liteflow/core'
import { AuthProvider } from '@liteflow/auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './globals.css'

const queryClient = new QueryClient()

export const metadata = {
  title: 'LiteFlow App',
  description: 'Built with LiteFlow - The Modern Web Framework'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <LiteFlowProvider>
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                <header className="border-b">
                  <nav className="container mx-auto p-4">
                    <div className="flex items-center justify-between">
                      <a href="/" className="text-xl font-bold">
                        LiteFlow
                      </a>
                      <div className="flex items-center gap-4">
                        <a href="/dashboard" className="hover:text-gray-600">
                          Dashboard
                        </a>
                        <a href="/profile" className="hover:text-gray-600">
                          Profile
                        </a>
                      </div>
                    </div>
                  </nav>
                </header>
                <main className="flex-1 container mx-auto p-4">
                  {children}
                </main>
                <footer className="border-t">
                  <div className="container mx-auto p-4 text-center text-sm text-gray-600">
                    Built with LiteFlow
                  </div>
                </footer>
              </div>
            </AuthProvider>
          </LiteFlowProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
} 