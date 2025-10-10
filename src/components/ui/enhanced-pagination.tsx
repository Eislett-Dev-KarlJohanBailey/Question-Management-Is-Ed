import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface EnhancedPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showPageInput?: boolean
  showFirstLastButtons?: boolean
  className?: string
}

export function EnhancedPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
  showPageSizeSelector = true,
  showPageInput = true,
  showFirstLastButtons = true,
  className
}: EnhancedPaginationProps) {
  const [pageInput, setPageInput] = React.useState(currentPage.toString())

  // Update input when currentPage changes externally
  React.useEffect(() => {
    setPageInput(currentPage.toString())
  }, [currentPage])

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value)
  }

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const page = parseInt(pageInput, 10)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    } else {
      setPageInput(currentPage.toString())
    }
  }

  const handlePageInputBlur = () => {
    const page = parseInt(pageInput, 10)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    } else {
      setPageInput(currentPage.toString())
    }
  }

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value, 10)
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize)
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 7

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 4) {
        pages.push("...")
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push("...")
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Page info and controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
        
        <div className="flex items-center gap-4">
          {/* Page size selector */}
          {showPageSizeSelector && onPageSizeChange && (
            <div className="flex items-center gap-2">
              <Label htmlFor="page-size" className="text-sm">
                Show:
              </Label>
              <Select value={itemsPerPage.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger id="page-size" className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Page input */}
          {showPageInput && (
            <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
              <Label htmlFor="page-input" className="text-sm">
                Go to:
              </Label>
              <Input
                id="page-input"
                type="number"
                min="1"
                max={totalPages}
                value={pageInput}
                onChange={handlePageInputChange}
                onBlur={handlePageInputBlur}
                className="w-16 h-8 text-center"
              />
              <span className="text-sm text-muted-foreground">of {totalPages}</span>
            </form>
          )}
        </div>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          {/* First page button */}
          {showFirstLastButtons && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Previous page button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <div key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center">
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                )
              }

              const pageNum = page as number
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className="h-8 w-8 p-0"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          {/* Next page button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 px-2"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>

          {/* Last page button */}
          {showFirstLastButtons && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
