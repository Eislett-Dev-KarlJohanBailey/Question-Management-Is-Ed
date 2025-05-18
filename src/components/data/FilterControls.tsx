
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export interface FilterOption {
  id: string
  label: string
  type: "select" | "checkbox" | "text" | "date" | "number" | "custom"
  options?: {
    label: string
    value: string
  }[]
  value?: any
  onChange?: (value: any) => void
  placeholder?: string
  component?: ReactNode
}

export interface FilterControlsProps {
  filters: FilterOption[]
  onApply?: () => void
  onReset?: () => void
  className?: string
}

export function FilterControls({
  filters,
  onApply,
  onReset,
  className
}: FilterControlsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filters.map((filter) => (
          <div key={filter.id} className="space-y-2">
            <Label htmlFor={filter.id} className="text-sm font-medium">
              {filter.label}
            </Label>
            
            {filter.type === "select" && filter.options && (
              <Select 
                value={filter.value?.toString()} 
                onValueChange={filter.onChange}
              >
                <SelectTrigger id={filter.id}>
                  <SelectValue placeholder={filter.placeholder || "Select option"} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {filter.type === "checkbox" && filter.options && (
              <div className="space-y-2">
                {filter.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${filter.id}-${option.value}`}
                      checked={Array.isArray(filter.value) && filter.value.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (!filter.onChange) return
                        
                        if (Array.isArray(filter.value)) {
                          const newValue = checked
                            ? [...filter.value, option.value]
                            : filter.value.filter((v) => v !== option.value)
                          
                          filter.onChange(newValue)
                        } else {
                          filter.onChange(checked ? [option.value] : [])
                        }
                      }}
                    />
                    <Label 
                      htmlFor={`${filter.id}-${option.value}`}
                      className="text-sm font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            
            {filter.type === "text" && (
              <Input
                id={filter.id}
                type="text"
                value={filter.value || ""}
                onChange={(e) => filter.onChange?.(e.target.value)}
                placeholder={filter.placeholder}
              />
            )}
            
            {filter.type === "date" && (
              <Input
                id={filter.id}
                type="date"
                value={filter.value || ""}
                onChange={(e) => filter.onChange?.(e.target.value)}
              />
            )}
            
            {filter.type === "number" && (
              <Input
                id={filter.id}
                type="number"
                value={filter.value || ""}
                onChange={(e) => filter.onChange?.(e.target.value)}
                placeholder={filter.placeholder}
              />
            )}
            
            {filter.type === "custom" && filter.component}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-2">
        {onReset && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onReset}
          >
            Reset
          </Button>
        )}
        
        {onApply && (
          <Button 
            size="sm"
            onClick={onApply}
          >
            Apply Filters
          </Button>
        )}
      </div>
    </div>
  )
}
