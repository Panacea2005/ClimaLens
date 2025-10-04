import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Large logo */}
        <div className="mb-12">
          <Image
            src="/ClimaLens.png"
            alt="ClimaLens"
            width={600}
            height={160}
            className="w-full max-w-xl h-auto"
            priority
          />
        </div>

        {/* Footer navigation */}
        <div className="flex justify-end">
          <div>
            <h3 className="text-white/60 mb-4 text-xs uppercase tracking-wider">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="hover:text-white/80 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

