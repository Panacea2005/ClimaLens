import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

import { Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'
import { Inter, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ClimaLens - Climate Intelligence Platform",
  description: "Transform complex climate data into actionable insights",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
            <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
              <div className="text-2xl font-bold tracking-tight">ClimaLens</div>
              <a
                href="/dashboard"
                className="px-6 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 font-medium"
              >
                Dashboard
              </a>
            </nav>
          </header>
          {children}
          <footer className="relative bg-black text-white overflow-hidden">
            {/* ASCII art pattern at bottom */}
            <div className="absolute bottom-0 left-0 right-0 text-white/10 text-[8px] leading-none font-mono overflow-hidden h-32">
              <pre className="whitespace-pre">
                {`###############################################################################################################################################################################
#####++--###+++++--##----++--##+++--#####--..--++#####################++#####################++##########++--+++--##########
++###--++---#+-##---++#----++##---..+--##++--#--..--++####################++#####################++##########++--+++--##########
+###--++---#+-##---++#----++##---..+--##++--#--..--++####################++#####################++##########++--+++--##########
###--++---#+-##---++#----++##---..+--##++--#--..--++####################++#####################++##########++--+++--##########
##--++---#+-##---++#----++##---..+--##++--#--..--++####################++#####################++##########++--+++--##########
#--++---#+-##---++#----++##---..+--##++--#--..--++####################++#####################++##########++--+++--##########`}
              </pre>
            </div>

            {/* Main content */}
            <div className="relative z-10 container mx-auto px-6 py-32">
              {/* Small logo */}
              <div className="mb-32">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-black rounded" />
                </div>
              </div>

              {/* Massive typography */}
              <div className="mb-32">
                <h2 className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold tracking-tighter leading-[0.9] uppercase">
                  CLIMALENS
                </h2>
              </div>

              {/* Footer navigation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl ml-auto text-sm">
                <div>
                  <h3 className="text-white/60 mb-4 text-xs uppercase tracking-wider">Platform</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="hover:text-white/80 transition-colors">
                        Climate Analytics
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white/80 transition-colors">
                        Data Insights
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white/80 transition-colors">
                        Predictions
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white/60 mb-4 text-xs uppercase tracking-wider">Company</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="hover:text-white/80 transition-colors">
                        About us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white/80 transition-colors">
                        Careers
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white/80 transition-colors">
                        Resources
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white/60 mb-4 text-xs uppercase tracking-wider">Legal</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="hover:text-white/80 transition-colors">
                        Terms of service
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white/80 transition-colors">
                        Privacy policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
