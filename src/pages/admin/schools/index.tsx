
import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { DataManagementLayout } from "@/components/layout/DataManagementLayout"
import { DataTable } from "@/components/data/DataTable"
import { DataFormDrawer } from "@/components/data/DataFormDrawer"
import { DeleteConfirmationDialog } from "@/components/data/DeleteConfirmationDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/router"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

// Mock data for demonstration
const MOCK_COUNTRIES = [
  { 
    id: "1", 
    name: "United States"
  },
  { 
    id: "2", 
    name: "Canada"
  },
  { 
    id: "3", 
    name: "United Kingdom"
  },
  { 
    id: "4", 
    name: "Australia"
  },
  { 
    id: "5", 
    name: "Germany"
  }
]

const MOCK_SCHOOLS = [
  { 
    id: "1", 
    name: "Harvard University",
    countryId: "1",
    createdAt: "2025-01-15"
  },
  { 
    id: "2", 
    name: "University of Toronto",
    countryId: "2",
    createdAt: "2025-01-16"
  },
  { 
    id: "3", 
    name: "Oxford University",
    countryId: "3",
    createdAt: "2025-01-17"
  },
  { 
    id: "4", 
    name: "University of Sydney",
    countryId: "4",
    createdAt: "2025-01-18"
  },
  { 
    id: "5", 
    name: "Technical University of Munich",
    countryId: "5",
    createdAt: "2025-01-19"
  }
]

// School form type
interface SchoolFormData {
  id?: string
  name: string
  countryId: string
  createdAt?: string
}

export default function SchoolsPage() {
  const router = useRouter()
  const [schools, setSchools] = useState(MOCK_SCHOOLS)
  const [filteredSchools, setFilteredSchools] = useState(MOCK_SCHOOLS)
  const [countries, setCountries] = useState(MOCK_COUNTRIES)
  const [isLoading, setIsLoading] = useState(false)
  
  // URL-synced state
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [countryFilter, setCountryFilter] = useState<string>("")
  
  // Form drawer state
  const [formDrawerOpen, setFormDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentSchool, setCurrentSchool] = useState<SchoolFormData>({
    name: "",
    countryId: ""
  })
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [schoolToDelete, setSchoolToDelete] = useState<string | null>(null)
  
  // Initialize state from URL on first load
  useEffect(() => {
    if (!router.isReady) return
    
    // Get sort params from URL
    const sortColumnFromUrl = router.query.sortColumn as string
    const sortDirectionFromUrl = router.query.sortDirection as "asc" | "desc"
    
    if (sortColumnFromUrl) {
      setSortColumn(sortColumnFromUrl)
    }
    
    if (sortDirectionFromUrl && (sortDirectionFromUrl === "asc" || sortDirectionFromUrl === "desc")) {
      setSortDirection(sortDirectionFromUrl)
    }
    
    // Get page from URL
    const pageFromUrl = router.query.page ? parseInt(router.query.page as string, 10) : 1
    if (pageFromUrl && !isNaN(pageFromUrl)) {
      setCurrentPage(pageFromUrl)
    }
    
    // Get search from URL
    const searchFromUrl = router.query.search as string
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
    }
    
    // Get country filter from URL
    const countryFilterFromUrl = router.query.country as string
    if (countryFilterFromUrl) {
      setCountryFilter(countryFilterFromUrl)
    }
    
    // Apply filters based on URL params
    applyFilters()
  }, [router.isReady, router.query])
  
  // Apply all filters, sorting, and pagination
  const applyFilters = () => {
    setIsLoading(true)
    
    // Start with all schools
    let result = [...schools]
    
    // Apply search filter if present
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase()
      result = result.filter(school => 
        school.name.toLowerCase().includes(lowerSearch)
      )
    }
    
    // Apply country filter if present
    if (countryFilter) {
      result = result.filter(school => school.countryId === countryFilter)
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      
      if (sortColumn === "id") {
        comparison = a.id.localeCompare(b.id)
      } else if (sortColumn === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortColumn === "country") {
        const countryA = countries.find(c => c.id === a.countryId)?.name || ""
        const countryB = countries.find(c => c.id === b.countryId)?.name || ""
        comparison = countryA.localeCompare(countryB)
      } else if (sortColumn === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      
      return sortDirection === "asc" ? comparison : -comparison
    })
    
    setFilteredSchools(result)
    setIsLoading(false)
  }
  
  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters()
  }, [schools, searchQuery, countryFilter, sortColumn, sortDirection])
  
  // Handle form input changes
  const handleFormChange = (field: keyof SchoolFormData, value: string) => {
    setCurrentSchool(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Open form drawer for creating a new school
  const handleAddNew = () => {
    setCurrentSchool({
      name: "",
      countryId: ""
    })
    setIsEditMode(false)
    setFormDrawerOpen(true)
  }
  
  // Open form drawer for editing a school
  const handleEdit = (id: string) => {
    const schoolToEdit = schools.find(school => school.id === id)
    if (schoolToEdit) {
      setCurrentSchool({
        id: schoolToEdit.id,
        name: schoolToEdit.name,
        countryId: schoolToEdit.countryId,
        createdAt: schoolToEdit.createdAt
      })
      setIsEditMode(true)
      setFormDrawerOpen(true)
    }
  }
  
  // Handle form submission
  const handleFormSubmit = () => {
    setIsSubmitting(true)
    
    // Validate form
    if (!currentSchool.name || !currentSchool.countryId) {
      // In a real app, you would show validation errors
      setIsSubmitting(false)
      return
    }
    
    // Simulate API call
    setTimeout(() => {
      if (isEditMode && currentSchool.id) {
        // Update existing school
        setSchools(prev => 
          prev.map(school => 
            school.id === currentSchool.id 
              ? { 
                  ...school, 
                  name: currentSchool.name,
                  countryId: currentSchool.countryId
                } 
              : school
          )
        )
      } else {
        // Create new school
        const newSchool = {
          id: `${schools.length + 1}`,
          name: currentSchool.name,
          countryId: currentSchool.countryId,
          createdAt: new Date().toISOString().split("T")[0]
        }
        setSchools(prev => [...prev, newSchool])
      }
      
      setIsSubmitting(false)
      setFormDrawerOpen(false)
    }, 1000)
  }
  
  // Open delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setSchoolToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!schoolToDelete) return
    
    setIsDeleting(true)
    
    // Simulate API call
    setTimeout(() => {
      setSchools(schools.filter(school => school.id !== schoolToDelete))
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setSchoolToDelete(null)
    }, 1000)
  }
  
  // Simulate viewing a school
  const handleViewSchool = (id: string) => {
    router.push(`/admin/schools/${id}`)
  }
  
  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
    
    // Update URL
    const query = { ...router.query, search: value || null, page: "1" }
    if (!value) delete query.search
    
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true })
  }
  
  // Handle country filter change
  const handleCountryFilterChange = (value: string) => {
    setCountryFilter(value)
    setCurrentPage(1)
    
    // Update URL
    const query = { ...router.query, country: value || null, page: "1" }
    if (!value) delete query.country
    
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true })
  }
  
  // Handle sorting
  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column)
    setSortDirection(direction)
    
    // Update URL
    const query = { 
      ...router.query, 
      sortColumn: column, 
      sortDirection: direction 
    }
    
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true })
  }
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    
    // Update URL
    const query = { ...router.query, page: page.toString() }
    
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true })
  }
  
  // Simulate refreshing data
  const handleRefresh = () => {
    setIsLoading(true)
    // In a real app, you would fetch fresh data from the API
    setTimeout(() => {
      applyFilters()
      setIsLoading(false)
    }, 500)
  }
  
  // Get paginated data
  const getPaginatedData = () => {
    const itemsPerPage = 10
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    
    return filteredSchools.slice(startIndex, endIndex)
  }
  
  // Get country name by ID
  const getCountryName = (countryId: string) => {
    return countries.find(country => country.id === countryId)?.name || "Unknown"
  }
  
  // Filter options
  const filterOptions = [
    {
      id: "country",
      label: "Country",
      type: "select" as const,
      value: countryFilter,
      onChange: handleCountryFilterChange,
      placeholder: "Select country",
      options: [
        { label: "All Countries", value: "" },
        ...countries.map(country => ({
          label: country.name,
          value: country.id
        }))
      ]
    }
  ]
  
  // Table columns configuration
  const columns = [
    {
      id: "id",
      header: "ID",
      cell: (school: typeof MOCK_SCHOOLS[0]) => <span className="text-muted-foreground text-sm">{school.id}</span>,
      sortable: true
    },
    {
      id: "name",
      header: "School Name",
      cell: (school: typeof MOCK_SCHOOLS[0]) => <span className="font-medium">{school.name}</span>,
      sortable: true
    },
    {
      id: "country",
      header: "Country",
      cell: (school: typeof MOCK_SCHOOLS[0]) => <span>{getCountryName(school.countryId)}</span>,
      sortable: true
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (school: typeof MOCK_SCHOOLS[0]) => new Date(school.createdAt).toLocaleDateString(),
      sortable: true
    },
    {
      id: "actions",
      header: "",
      cell: (school: typeof MOCK_SCHOOLS[0]) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewSchool(school.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(school.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteClick(school.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ]
  
  // Sort options
  const sortOptions = [
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
    { label: "Country (A-Z)", value: "country_asc" },
    { label: "Country (Z-A)", value: "country_desc" },
    { label: "ID (Ascending)", value: "id_asc" },
    { label: "ID (Descending)", value: "id_desc" },
    { label: "Newest First", value: "createdAt_desc" },
    { label: "Oldest First", value: "createdAt_asc" }
  ]
  
  // Handle sort dropdown change
  const handleSortChange = (value: string) => {
    const [column, direction] = value.split("_")
    handleSort(column, direction as "asc" | "desc")
  }
  
  // Get current sort value for dropdown
  const getCurrentSortValue = () => {
    return `${sortColumn}_${sortDirection}`
  }
  
  return (
    <AdminLayout>
      <DataManagementLayout
        title="Schools"
        description="Manage all schools in the system"
        onAddNew={handleAddNew}
        addNewLabel="Add School"
        searchPlaceholder="Search schools..."
        onSearch={handleSearch}
        sortOptions={sortOptions}
        onSortChange={handleSortChange}
        filterControls={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filterOptions.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <Label htmlFor={filter.id} className="text-sm font-medium">
                  {filter.label}
                </Label>
                <Select 
                  value={filter.value} 
                  onValueChange={filter.onChange}
                >
                  <SelectTrigger id={filter.id}>
                    <SelectValue placeholder={filter.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        }
        isLoading={isLoading}
        onRefresh={handleRefresh}
        className="px-2 sm:px-4"
        defaultSort={getCurrentSortValue()}
        defaultShowFilters={!!countryFilter}
      >
        <DataTable
          data={getPaginatedData()}
          columns={columns}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => handleViewSchool(item.id)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages: Math.max(1, Math.ceil(filteredSchools.length / 10)),
            onPageChange: handlePageChange
          }}
          emptyState={
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No schools found</p>
              <Button onClick={handleAddNew}>Add your first school</Button>
            </div>
          }
        />
      </DataManagementLayout>
      
      {/* School Form Drawer */}
      <DataFormDrawer
        title={isEditMode ? "Edit School" : "Add New School"}
        description={isEditMode ? "Update school details" : "Create a new school"}
        open={formDrawerOpen}
        onOpenChange={setFormDrawerOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitLabel={isEditMode ? "Save Changes" : "Create School"}
        size="md"
      >
        <div className="space-y-6">
          {isEditMode && currentSchool.id && (
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                value={currentSchool.id}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input
              id="name"
              value={currentSchool.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="Enter school name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select 
              value={currentSchool.countryId} 
              onValueChange={(value) => handleFormChange("countryId", value)}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {isEditMode && currentSchool.createdAt && (
            <div className="space-y-2">
              <Label htmlFor="createdAt">Created At</Label>
              <Input
                id="createdAt"
                value={new Date(currentSchool.createdAt).toLocaleDateString()}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
          )}
        </div>
      </DataFormDrawer>
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete School"
        description="Are you sure you want to delete this school? This action cannot be undone and will remove all associated data."
      />
    </AdminLayout>
  )
}
