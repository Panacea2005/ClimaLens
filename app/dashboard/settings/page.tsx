"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "next-themes"
import { useSettings } from "@/hooks/use-settings"
import {
  Settings as SettingsIcon,
  Palette,
  Globe,
  Zap,
  Bell,
  Eye,
  Download,
  Trash2,
  Info,
  Check,
  Sun,
  Moon,
  Monitor,
} from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings, resetSettings, mounted } = useSettings()
  const [saved, setSaved] = useState(false)

  const handleSaveSettings = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleResetSettings = () => {
    resetSettings()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleClearHistory = () => {
    sessionStorage.clear()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="container max-w-5xl py-10 space-y-8">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="uppercase tracking-wide">Settings</Badge>
              <Badge variant="outline" className="hidden sm:inline-flex">Preferences</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Customize your ClimaLens experience</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSaveSettings} size="sm">
              {saved ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Saved
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button onClick={handleResetSettings} variant="outline" size="sm">
              Reset
            </Button>
          </div>
        </div>

        {saved && (
          <Alert className="bg-green-500/10 border-green-500/20">
            <Check className="h-4 w-4 text-green-500" />
            <AlertDescription>Settings saved successfully!</AlertDescription>
          </Alert>
        )}

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize how ClimaLens looks and feels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Theme</Label>
              <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem value="light" id="light" className="peer sr-only" />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Sun className="mb-3 h-6 w-6" />
                    Light
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Moon className="mb-3 h-6 w-6" />
                    Dark
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="system" id="system" className="peer sr-only" />
                  <Label
                    htmlFor="system"
                    className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Monitor className="mb-3 h-6 w-6" />
                    System
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* UI Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-mode" className="text-base cursor-pointer">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Reduce spacing and padding throughout the interface</p>
                </div>
                <Switch 
                  id="compact-mode" 
                  checked={settings.compactMode} 
                  onCheckedChange={(checked) => updateSettings({ compactMode: checked })} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations" className="text-base cursor-pointer">Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
                </div>
                <Switch 
                  id="animations" 
                  checked={settings.animationsEnabled} 
                  onCheckedChange={(checked) => updateSettings({ animationsEnabled: checked })} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location & Units */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>Location & Units</CardTitle>
            </div>
            <CardDescription>Set default location and measurement units</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="default-location">Default Location</Label>
                <Select 
                  value={settings.defaultLocation} 
                  onValueChange={(value) => updateSettings({ defaultLocation: value })}
                >
                  <SelectTrigger id="default-location">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ho-chi-minh">Ho Chi Minh City, Vietnam</SelectItem>
                    <SelectItem value="hanoi">Hanoi, Vietnam</SelectItem>
                    <SelectItem value="new-york">New York, USA</SelectItem>
                    <SelectItem value="london">London, UK</SelectItem>
                    <SelectItem value="tokyo">Tokyo, Japan</SelectItem>
                    <SelectItem value="sydney">Sydney, Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature-unit">Temperature Unit</Label>
                <Select 
                  value={settings.temperatureUnit} 
                  onValueChange={(value: any) => updateSettings({ temperatureUnit: value })}
                >
                  <SelectTrigger id="temperature-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">Celsius (°C)</SelectItem>
                    <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                    <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit-system">Unit System</Label>
              <RadioGroup 
                value={settings.unitSystem} 
                onValueChange={(value: any) => updateSettings({ unitSystem: value })} 
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="metric" id="metric" className="peer sr-only" />
                  <Label
                    htmlFor="metric"
                    className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    Metric (m/s, mm)
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="imperial" id="imperial" className="peer sr-only" />
                  <Label
                    htmlFor="imperial"
                    className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    Imperial (mph, in)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Analysis Settings</CardTitle>
            </div>
            <CardDescription>Configure how climate analysis works</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-progress" className="text-base cursor-pointer">Show Progress Bar</Label>
                <p className="text-sm text-muted-foreground">Display analysis progress during computation (20-40s)</p>
              </div>
              <Switch 
                id="show-progress" 
                checked={settings.showProgressBar} 
                onCheckedChange={(checked) => updateSettings({ showProgressBar: checked })} 
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="analysis-window" className="text-base">Day-of-Year Window</Label>
                <Badge variant="outline">{settings.analysisWindow} days</Badge>
              </div>
              <Slider
                id="analysis-window"
                min={1}
                max={15}
                step={1}
                value={[settings.analysisWindow]}
                onValueChange={(value) => updateSettings({ analysisWindow: value[0] })}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Analysis uses ±{settings.analysisWindow} days around your selected date (total: {settings.analysisWindow * 2 + 1} days)
              </p>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Note:</strong> Changing the analysis window affects which historical data is included.
                Default is ±7 days for a 15-day window.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <CardTitle>Data & Privacy</CardTitle>
            </div>
            <CardDescription>Manage your data and privacy preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="save-history" className="text-base cursor-pointer">Save Analysis History</Label>
                <p className="text-sm text-muted-foreground">Store previous analysis results locally</p>
              </div>
              <Switch 
                id="save-history" 
                checked={settings.saveHistory} 
                onCheckedChange={(checked) => updateSettings({ saveHistory: checked })} 
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-export" className="text-base cursor-pointer">Auto-Export Results</Label>
                  <p className="text-sm text-muted-foreground">Automatically download analysis results</p>
                </div>
                <Switch 
                  id="auto-export" 
                  checked={settings.autoExport} 
                  onCheckedChange={(checked) => updateSettings({ autoExport: checked })} 
                />
              </div>

              {settings.autoExport && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select 
                    value={settings.exportFormat} 
                    onValueChange={(value: any) => updateSettings({ exportFormat: value })}
                  >
                    <SelectTrigger id="export-format" className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <Button onClick={handleClearHistory} variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All History
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                This will remove all saved analysis results from your browser
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications (Future Feature) */}
        <Card className="opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="flex items-center gap-2">
                Notifications
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </CardTitle>
            </div>
            <CardDescription>Manage notification preferences (feature in development)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between opacity-50">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-base cursor-not-allowed">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates and alerts</p>
              </div>
              <Switch id="notifications" checked={settings.notifications} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t pt-6">
          <p>
            Settings are stored locally in your browser. They will persist across sessions.
          </p>
          <p className="mt-2">
            <strong>Version:</strong> 1.0.0 · <strong>Last Updated:</strong> October 2025
          </p>
        </div>
      </div>
    </div>
  )
}

