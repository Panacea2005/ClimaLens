import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import LayoutWrapper from "@/components/layout-wrapper"
import { Toaster } from "@/components/ui/toaster"

import { Inter, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "ClimaLens - Climate Intelligence Platform",
    template: "%s | ClimaLens"
  },
  description: "Advanced climate analysis platform powered by NASA MERRA-2 satellite data. Analyze 45 years of historical climate patterns to understand probabilistic weather conditions for any location worldwide.",
  keywords: [
    "climate analysis",
    "weather probability",
    "NASA MERRA-2",
    "satellite data",
    "climate intelligence",
    "historical weather",
    "Google Earth Engine",
    "climate science",
    "weather forecasting",
    "environmental data"
  ],
  authors: [
    {
      name: "ClimaLens Team",
      url: "https://github.com/climalens"
    }
  ],
  creator: "ClimaLens Team",
  publisher: "ClimaLens",
  metadataBase: new URL("https://climalens.vercel.app"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://climalens.vercel.app",
    title: "ClimaLens - Climate Intelligence Platform",
    description: "Analyze 45 years of NASA satellite data to understand climate patterns and probabilistic weather conditions for any location worldwide.",
    siteName: "ClimaLens",
    images: [
      {
        url: "/ClimaLens.png",
        width: 1200,
        height: 630,
        alt: "ClimaLens - Climate Intelligence Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ClimaLens - Climate Intelligence Platform",
    description: "Analyze 45 years of NASA satellite data to understand climate patterns worldwide.",
    images: ["/ClimaLens.png"],
    creator: "@climalens"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: [
      { url: "/ClimaLens.png" }
    ],
    apple: [
      { url: "/ClimaLens.png" }
    ]
  },
  manifest: "/site.webmanifest",
  category: "technology",
  generator: "Next.js 15"
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
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
