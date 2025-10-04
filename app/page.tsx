import ArcGalleryHero from "@/components/arc-gallery-hero"
import SocialProofSection from "@/components/social-proof-section"
import FeaturesGridSection from "@/components/features-grid-section"
import IntegrationsSection from "@/components/integrations-section"
import LargeCardsSection from "@/components/large-cards-section"
import AwarenessSection from "@/components/awareness-section"

export default function Home() {
  // Climate-related images
  const images = [
    "/usgs-eFbxYl9M_lc-unsplash.jpg",
    "/nasa-CzigtQ8gPi4-unsplash.jpg",
    "/nasa-fDSqEWLRNFE-unsplash.jpg",
    "/nasa-E7q00J_8N7A-unsplash.jpg",
    "/usgs-siKUDDi4o64-unsplash.jpg",
    "/nasa-whDrFMucHkc-unsplash.jpg",
    "/nasa-co0HNkVQmzE-unsplash.jpg",
    "/nasa-5477L9Z5eqI-unsplash.jpg",
    "/francesco-ungaro-DbhckIBPnuU-unsplash.jpg",
    "/brian-mcgowan-kKyxIwvljBg-unsplash.jpg",
    "/wolfgang-hasselmann-OQOFHETBIRY-unsplash.jpg",
  ]

  return (
    <main className="relative min-h-screen bg-background">
      <ArcGalleryHero
        images={images}
        startAngle={20}
        endAngle={160}
        radiusLg={480}
        radiusMd={360}
        radiusSm={260}
        cardSizeLg={120}
        cardSizeMd={100}
        cardSizeSm={80}
        className="pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24"
      />
      <SocialProofSection />
      <FeaturesGridSection />
      <IntegrationsSection />
      <LargeCardsSection />
      <AwarenessSection />
    </main>
  )
}