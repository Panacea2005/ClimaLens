import ArcGalleryHero from "@/components/arc-gallery-hero"
import SocialProofSection from "@/components/social-proof-section"
import IntroSection from "@/components/intro-section"
import FeaturesGridSection from "@/components/features-grid-section"
import IntegrationsSection from "@/components/integrations-section"
import TwoColumnSection from "@/components/two-column-section"
import LargeCardsSection from "@/components/large-cards-section"
import AwarenessSection from "@/components/awareness-section"

export default function Home() {
  // Climate-related images
  const images = [
    "/freepik__enhance__98192.png",
    "/LS.png",
    "/freepik__a-closeup-shot-features-a-glossy-purple-crossshape__48873.png",
    "/freepik__the-style-is-3d-model-with-octane-render-volumetri__57555.png",
    "/eqirGoRIJPaIMgEUeliWpNxeFmI.jpg",
    "/ultra-detailed_close-up_side_profile_of_a_dark-skinned_model_wearing_futuristic_chrome_wraparound_s_ps17q5ms2ptu5t6bdru6_2.png",
    "/slide.png",
    "/freepik__abstract-digital-art-featuring-a-series-of-horizon__489.png",
    "/abstract-blue-gradient.webp",
    "/VkvvhXlWo3hEBzcqwTpjd_aa4bf9ee998f4ec0b17a8bf16fe3e9e2.jpg",
    "/hyperrealistic_commercial_product_photography_of_luxury_chrome_sunglasses_on_male_model_extreme_chi_fanguv2w9zx489lcivwa_2.png",
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
      <IntroSection />
      <FeaturesGridSection />
      <IntegrationsSection />
      <TwoColumnSection />
      <LargeCardsSection />
      <AwarenessSection />
    </main>
  )
}
