import Image from "next/image"
import Link from "next/link"
import { Separator } from "./ui/separator"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent opacity-50"></div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Centered logo */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/upscalemedia-transformed.jpg"
            alt="ClimaLens"
            width={320}
            height={85}
            className="h-auto w-48 sm:w-64 md:w-80"
            priority
          />
          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-white/70 max-w-lg mx-auto px-4">
            Advanced climate monitoring and analytics platform providing real-time insights
            for sustainable decision-making and environmental intelligence.
          </p>
        </div>

        {/* Simplified navigation */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-8 text-sm sm:text-base">
            <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/data-methods" className="text-white/70 hover:text-white transition-colors">
              Data & Methods
            </Link>
            <Link href="/dashboard/settings" className="text-white/70 hover:text-white transition-colors">
              Settings
            </Link>
          </div>
        </div>

        <Separator className="my-4 sm:my-6 bg-white/10" />

        {/* Simplified footer bottom */}
        <div className="flex flex-col items-center text-white/50 text-xs sm:text-sm space-y-3 sm:space-y-4">
          <div className="text-center px-4">
            &copy; {currentYear} ClimaLens • Built for NASA Space Apps Challenge 2025
          </div>

          {/* GitHub link */}
          <div className="flex items-center space-x-2">
            <Link 
              href="https://github.com/Panacea2005/ClimaLens" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm">View on GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
