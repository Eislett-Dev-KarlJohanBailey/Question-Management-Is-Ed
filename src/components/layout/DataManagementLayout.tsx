
import { ReactNode, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { 
  ChevronDown, 
  Download, 
  Filter, 
  Plus, 
  RefreshCw, 
  Search, 
  SlidersHorizontal, 
  Upload 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/router"

export interface DataManagementLayoutProps {
  title: string
  description?: string
  children: ReactNode
  onAddNew?: () => void
  addNewLabel?: string
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  filterControls?: ReactNode
  sortOptions?: {
    label: string
    value: string
  }[]
  onSortChange?: (value: string) => void
  actionButtons?: ReactNode
  isLoading?: boolean
  onRefresh?: () => void
  className?: string
  defaultSort?: string
  defaultShowFilters?: boolean
}

export function DataManagementLayout({
  title,
  description,
  children,
  onAddNew,
  addNewLabel = "Add New",
  searchPlaceholder = "Search...",
  onSearch,
  filterControls,
  sortOptions,
  onSortChange,
  actionButtons,
  isLoading = false,
  onRefresh,
  className,
  defaultSort,
  defaultShowFilters = false
}: DataManagementLayoutProps) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")
  const [showFilters, setShowFilters] = useState(defaultShowFilters)
  const [currentSort, setCurrentSort] = useState(defaultSort || "")
  
  // Initialize from URL query params
  useEffect(() => {
    if (!router.isReady) return
    
    // Get search from URL
    const searchFromUrl = router.query.search as string
    if (searchFromUrl) {
      setSearchValue(searchFromUrl)
      onSearch?.(searchFromUrl)
    }
    
    // Get sort from URL
    const sortFromUrl = router.query.sort as string
    if (sortFromUrl && sortOptions?.some(option => option.value === sortFromUrl)) {
      setCurrentSort(sortFromUrl)
      onSortChange?.(sortFromUrl)
    }
    
    // Get filter visibility from URL
    const showFiltersFromUrl = router.query.showFilters === "true"
    setShowFilters(showFiltersFromUrl)
  }, [router.isReady, router.query, onSearch, onSortChange, sortOptions])
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    
    // Update URL
    const query = { ...router.query, search: value || null }
    if (!value) delete query.search
    
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true })
    
    onSearch?.(value)
  }
  
  const handleSortChange = (value: string) => {
    setCurrentSort(value)
    
    // Update URL
    const query = { ...router.query, sort: value }
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true })
    
    onSortChange?.(value)
  }
  
  const handleToggleFilters = () => {
    const newShowFilters = !showFilters
    setShowFilters(newShowFilters)
    
    // Update URL
    const query = { ...router.query, showFilters: newShowFilters ? "true" : null }
    if (!newShowFilters) delete query.showFilters
    
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true })
  }
  
  const handleRefresh = () => {
    onRefresh?.()
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        
        {onAddNew && (
          <Button 
            onClick={onAddNew} 
            className="self-start sm:self-auto flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>{addNewLabel}</span>
          </Button>
        )}
      </div>
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="pl-8 w-full"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Sort Dropdown */}
          {sortOptions && sortOptions.length > 0 && (
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {/* Filter Button */}
          {filterControls && (
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={handleToggleFilters}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={cn(
                "ml-1 h-4 w-4 transition-transform", 
                showFilters ? "rotate-180" : ""
              )} />
            </Button>
          )}
          
          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {onRefresh && (
                  <DropdownMenuItem onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {actionButtons && (
                <>
                  <DropdownMenuSeparator />
                  {actionButtons}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Filter Panel */}
      {filterControls && showFilters && (
        <Card className="p-4">
          <div className="space-y-4">
            {filterControls}
          </div>
        </Card>
      )}
      
      {/* Content Area */}
      <div className={cn("relative", isLoading && "opacity-60 pointer-events-none")}>
        {children}
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}
