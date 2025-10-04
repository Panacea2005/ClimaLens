"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, Share2, Image, Link2, Loader2 } from "lucide-react"
import { useExport } from "@/hooks/use-export"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface ExportButtonProps {
  chartElementId: string
  shareData: {
    lat: number
    lon: number
    date: string
    locationName?: string
  }
}

export function ExportButton({ chartElementId, shareData }: ExportButtonProps) {
  const { exportAsImage, copyShareLink } = useExport()
  const { toast } = useToast()
  const [exporting, setExporting] = useState(false)

  const handleExportImage = async () => {
    setExporting(true)
    try {
      await exportAsImage(chartElementId, `climalens-${shareData.locationName?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'analysis'}-${shareData.date}`)
      toast({
        title: "Chart exported",
        description: "Your chart has been downloaded as PNG",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export chart. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setExporting(false)
    }
  }

  const handleCopyLink = () => {
    try {
      const url = copyShareLink(shareData)
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy link. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={exporting}>
          {exporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4" />
              Export & Share
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportImage} className="cursor-pointer">
          <Image className="mr-2 h-4 w-4" />
          Export Charts as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <Link2 className="mr-2 h-4 w-4" />
          Copy Share Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

