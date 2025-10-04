"use client"

import { Database, Cloud, Activity, Satellite, Waves, TreePine } from "lucide-react"
import { useState } from "react"

export default function IntegrationsSection() {
  // Hover state for items
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const dataSources = [
    {
      icon: Satellite,
      label: "Satellite Data",
      description: "Collect and analyze Earth observation data"
    },
    {
      icon: Database,
      label: "Weather Stations",
      description: "Access real-time ground-level measurements"
    },
    {
      icon: Cloud,
      label: "Cloud Sensors",
      description: "Monitor atmospheric conditions globally"
    },
    {
      icon: Waves,
      label: "Ocean Buoys",
      description: "Track maritime climate patterns"
    },
  ];

  const analysisTools = [
    {
      icon: Activity,
      label: "Time Series",
      description: "Analyze temporal data patterns"
    },
    {
      icon: TreePine,
      label: "Ecosystem",
      description: "Map environmental interconnections"
    },
    {
      icon: Database,
      label: "Data Lakes",
      description: "Store and process massive datasets"
    },
    {
      icon: Cloud,
      label: "Cloud Analytics",
      description: "Deploy distributed computing power"
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
        className={`relative group border border-gray-100 bg-white shadow-sm rounded-lg p-5 min-w-[220px] h-[180px] transition-all duration-300 ${isHovered ? 'shadow-md transform scale-[1.02]' : ''}`}
        onMouseEnter={() => setHoveredItem(type === 'source' ? index : index + 100)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <div className="flex flex-col h-full">
          {/* Icon with circle background */}
          <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-black/5' : 'bg-transparent'}`}>
            <Icon className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
          </div>

          {/* Label */}
          <span className="text-sm font-medium mb-2">{item.label}</span>

          {/* Description */}
          <span className="text-xs text-gray-500">
            {item.description}
          </span>

          {/* Decorative element */}
          <div className="mt-auto pt-4">
            <div className="h-[2px] w-12 bg-gray-100 rounded-full mb-3"></div>
            <span className="text-xs font-medium text-gray-400">
              {type === "source" ? "Data Source" : "Analysis Tool"}
            </span>
          </div>
        </div>

        {/* Subtle gradient overlay on hover */}
        <div className={`absolute inset-0 rounded-lg bg-gradient-to-br from-transparent via-transparent to-gray-50 opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}></div>
      </div>
    );
  };

  return (
    <section className="py-24 bg-background border-t border-gray-50 relative overflow-hidden">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="fixed-pattern-bg" />
      </div>

      <div className="container mx-auto px-6">
        <div className="mb-20">
          {/* Two dots header pattern */}
          <div className="flex gap-1 mb-4">
            <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
            <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Learn from everything</h2>
          <p className="text-gray-500">but start with data</p>
        </div>

        {/* Data Sources */}
        <div className="mb-24">
          <div className="mb-8 flex items-start">
            <h3 className="text-lg font-medium">Data Sources</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
            {dataSources.map((source, i) => (
              <ItemCard key={i} item={source} index={i} type="source" />
            ))}
          </div>
        </div>

        {/* Analysis Tools */}
        <div className="mb-4">
          <div className="mb-8 flex items-start">
            <h3 className="text-lg font-medium">Analysis Tools</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
            {analysisTools.map((tool, i) => (
              <ItemCard key={i} item={tool} index={i} type="tool" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}