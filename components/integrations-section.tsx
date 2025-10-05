"use client"

import { Database, Cloud, Activity, Satellite, Waves, TreePine } from "lucide-react"
import { useState } from "react"

export default function IntegrationsSection() {
  // Hover state for items
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const dataSources = [
    {
      icon: Satellite,
      label: "NASA MERRA-2",
      description: "45 years of atmospheric reanalysis"
    },
    {
      icon: Waves,
      label: "HYCOM Ocean",
      description: "32 years of sea surface data"
    },
    {
      icon: Database,
      label: "Google Earth Engine",
      description: "Planetary-scale geospatial analysis"
    },
    {
      icon: Cloud,
      label: "Historical DOY",
      description: "Day-of-year climatology mapping"
    },
  ];

  const analysisTools = [
    {
      icon: Activity,
      label: "Percentile Analysis",
      description: "Dynamic extreme weather thresholds"
    },
    {
      icon: TreePine,
      label: "Coastal Modeling",
      description: "3-tier ocean influence zones"
    },
    {
      icon: Database,
      label: "Temporal Weighting",
      description: "Recent years weighted 1.5x"
    },
    {
      icon: Cloud,
      label: "AI Insights",
      description: "Rule-based weather summaries"
    },
  ];

  const ItemCard = ({
    item,
    index,
    type
  }: {
    item: { icon: any, label: string, description: string },
    index: number,
    type: 'source' | 'tool'
  }) => {
    const isHovered = hoveredItem === (type === 'source' ? index : index + 100);
    const Icon = item.icon;

    return (
      <div
        key={index}
        className={`relative group border border-border bg-card shadow-sm rounded-lg p-5 min-w-[220px] h-[180px] transition-all duration-300 ${isHovered ? 'shadow-md transform scale-[1.02]' : ''}`}
        onMouseEnter={() => setHoveredItem(type === 'source' ? index : index + 100)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <div className="flex flex-col h-full">
          {/* Icon with circle background */}
          <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-foreground/5' : 'bg-transparent'}`}>
            <Icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
          </div>

          {/* Label */}
          <span className="text-sm font-medium mb-2 text-foreground">{item.label}</span>

          {/* Description */}
          <span className="text-xs text-muted-foreground">
            {item.description}
          </span>

          {/* Decorative element */}
          <div className="mt-auto pt-4">
            <div className="h-[2px] w-12 bg-border rounded-full mb-3"></div>
            <span className="text-xs font-medium text-muted-foreground">
              {type === "source" ? "Data Source" : "Analysis Tool"}
            </span>
          </div>
        </div>

        {/* Subtle gradient overlay on hover */}
        <div className={`absolute inset-0 rounded-lg bg-gradient-to-br from-transparent via-transparent to-muted/20 opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}></div>
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-background border-t border-border relative overflow-hidden">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="fixed-pattern-bg" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 sm:mb-16 md:mb-20">
          {/* Two dots header pattern */}
          <div className="flex gap-1 mb-3 sm:mb-4">
            <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
            <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">Powered by the best</h2>
          <p className="text-sm sm:text-base text-muted-foreground">NASA and NOAA datasets</p>
        </div>

        {/* Data Sources */}
        <div className="mb-16 sm:mb-20 md:mb-24">
          <div className="mb-6 sm:mb-8 flex items-start">
            <h3 className="text-base sm:text-lg font-medium text-foreground">Data Sources</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            {dataSources.map((source, i) => (
              <ItemCard key={i} item={source} index={i} type="source" />
            ))}
          </div>
        </div>

        {/* Analysis Tools */}
        <div className="mb-4">
          <div className="mb-6 sm:mb-8 flex items-start">
            <h3 className="text-base sm:text-lg font-medium text-foreground">Analysis Tools</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            {analysisTools.map((tool, i) => (
              <ItemCard key={i} item={tool} index={i} type="tool" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}