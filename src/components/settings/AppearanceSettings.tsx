
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, Check } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { useColorScheme } from "@/hooks/useColorScheme"
import { toast } from "@/hooks/use-toast"

export function AppearanceSettings() {
  const { settings, updateSettings } = useTheme()
  const [localSettings, setLocalSettings] = useState(settings)
  
  // Apply color scheme
  useColorScheme(localSettings.colorScheme)
  
  // Update local settings when context settings change
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])
  
  const handleSave = () => {
    updateSettings(localSettings)
    toast({
      title: "Settings saved",
      description: "Your appearance settings have been saved.",
    })
  }
  
  const handleChange = <K extends keyof typeof localSettings>(
    key: K,
    value: typeof localSettings[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose your preferred theme and appearance settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Mode</Label>
            <RadioGroup 
              value={localSettings.theme} 
              onValueChange={(value) => handleChange("theme", value as "light" | "dark" | "system")}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem 
                  value="light" 
                  id="light" 
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor="light" 
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Sun className="mb-3 h-6 w-6" />
                  Light
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="dark" 
                  id="dark" 
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor="dark" 
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Moon className="mb-3 h-6 w-6" />
                  Dark
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="system" 
                  id="system" 
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor="system" 
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Monitor className="mb-3 h-6 w-6" />
                  System
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Color Scheme</Label>
            <Select 
              value={localSettings.colorScheme} 
              onValueChange={(value) => handleChange("colorScheme", value as "blue" | "green" | "violet" | "rose" | "orange")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a color scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="violet">Violet</SelectItem>
                <SelectItem value="rose">Rose</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>
            Customize your viewing experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="font-size">Font Size ({localSettings.fontSize}px)</Label>
              <span className="text-sm text-muted-foreground">{localSettings.fontSize}px</span>
            </div>
            <Slider 
              id="font-size"
              min={12} 
              max={24} 
              step={1} 
              value={[localSettings.fontSize]} 
              onValueChange={(value) => handleChange("fontSize", value[0])} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="contrast">Contrast ({localSettings.contrast}%)</Label>
              <span className="text-sm text-muted-foreground">{localSettings.contrast}%</span>
            </div>
            <Slider 
              id="contrast"
              min={75} 
              max={125} 
              step={5} 
              value={[localSettings.contrast]} 
              onValueChange={(value) => handleChange("contrast", value[0])} 
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="reduced-motion">Reduced Motion</Label>
            <Switch 
              id="reduced-motion" 
              checked={localSettings.reducedMotion} 
              onCheckedChange={(checked) => handleChange("reducedMotion", checked)} 
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
