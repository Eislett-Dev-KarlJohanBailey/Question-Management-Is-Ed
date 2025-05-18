
import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { DataManagementLayout } from "@/components/layout/DataManagementLayout"
import { DataTable } from "@/components/data/DataTable"
import { FilterControls, FilterOption } from "@/components/data/FilterControls"
import { DataFormDrawer } from "@/components/data/DataFormDrawer"
import { DeleteConfirmationDialog } from "@/components/data/DeleteConfirmationDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

// Mock data for demonstration
const MOCK_SUBJECTS = [
  { 
    id: "1", 
    name: "Mathematics", 
    description: "Study of numbers, quantities, and shapes",
    createdAt: "2025-01-15"
  },
  { 
    id: "2", 
    name: "Physics", 
    description: "Study of matter, energy, and the interaction between them",
    createdAt: "2025-02-10"
  },
  { 
    id: "3", 
    name: "Literature", 
    description: "Study of written works, especially those considered of superior or lasting artistic merit",
    createdAt: "2025-03-05"
  },
  { 
    id: "4", 
    name: "History", 
    description: "Study of past events, particularly in human affairs",
    createdAt: "2025-01-20"
  },
  { 
    id: "5", 
    name: "Computer Science", 
    description: "Study of computers and computational systems",
    createdAt: "2025-02-25"
  }
]

// Subject form type
interface SubjectFormData {
  id?: string
  name: string
  description: string
  createdAt?: string
}

export default function SubjectsPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS)
  const [filteredSubjects, setFilteredSubjects] = useState(MOCK_SUBJECTS)
  const [isLoading, setIsLoading] = useState(false)
  
  // URL-synced state
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Form drawer state
  const [formDrawerOpen, setFormDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentSubject, setCurrentSubject] = useState<SubjectFormData>({
    name: "",
    description: ""
  })
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null)
  
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
    
    // Apply filters based on URL params
    applyFilters()
  }, [router.isReady, router.query])
  
  // Apply all filters, sorting, and pagination
  const applyFilters = () => {
    setIsLoading(true)
    
    // Start with all subjects
    let result = [...subjects]
    
    // Apply search filter if present
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase()
      result = result.filter(subject => 
        subject.name.toLowerCase().includes(lowerSearch) || 
        subject.description.toLowerCase().includes(lowerSearch)
      )
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      
      if (sortColumn === "id") {
        comparison = a.id.localeCompare(b.id)
      } else if (sortColumn === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortColumn === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      
      return sortDirection === "asc" ? comparison : -comparison
    })
    
    setFilteredSubjects(result)
    setIsLoading(false)
  }
  
  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters()
  }, [subjects, searchQuery, sortColumn, sortDirection])
  
  // Handle form input changes
  const handleFormChange = (field: keyof SubjectFormData, value: string) => {
    setCurrentSubject(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Open form drawer for creating a new subject
  const handleAddNew = () => {
    setCurrentSubject({
      name: "",
      description: ""
    })
    setIsEditMode(false)
    setFormDrawerOpen(true)
  }
  
  // Open form drawer for editing a subject
  const handleEdit = (id: string) => {
    const subjectToEdit = subjects.find(subject => subject.id === id)
    if (subjectToEdit) {
      setCurrentSubject({
        id: subjectToEdit.id,
        name: subjectToEdit.name,
        description: subjectToEdit.description,
        createdAt: subjectToEdit.createdAt
      })
      setIsEditMode(true)
      setFormDrawerOpen(true)
    }
  }
  
  // Handle form submission
  const handleFormSubmit = () => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      if (isEditMode && currentSubject.id) {
        // Update existing subject
        setSubjects(prev => 
          prev.map(subject => 
            subject.id === currentSubject.id 
              ? { 
                  ...subject, 
                  name: currentSubject.name,
                  description: currentSubject.description
                } 
              : subject
          )
        )
      } else {
        // Create new subject
        const newSubject = {
          id: `${subjects.length + 1}`,
          name: currentSubject.name,
          description: currentSubject.description,
          createdAt: new Date().toISOString().split("T")[0]
        }
        setSubjects(prev => [...prev, newSubject])
      }
      
      setIsSubmitting(false)
      setFormDrawerOpen(false)
    }, 1000)
  }
  
  // Open delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setSubjectToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!subjectToDelete) return
    
    setIsDeleting(true)
    
    // Simulate API call
    setTimeout(() => {
      setSubjects(subjects.filter(subject => subject.id !== subjectToDelete))
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setSubjectToDelete(null)
    }, 1000)
  }
  
  // Simulate viewing a subject
  const handleViewSubject = (id: string) => {
    router.push(`/admin/subjects/${id}`)
  }
  
  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }
  
  // Handle sorting
  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column)
    setSortDirection(direction)
  }
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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
    
    return filteredSubjects.slice(startIndex, endIndex)
  }
  
  // Table columns configuration
  const columns = [
    {
      id: "id",
      header: "ID",
      cell: (subject: typeof MOCK_SUBJECTS[0]) => <span className="text-muted-foreground text-sm">{subject.id}</span>,
      sortable: true
    },
    {
      id: "name",
      header: "Subject Name",
      cell: (subject: typeof MOCK_SUBJECTS[0]) => <span className="font-medium">{subject.name}</span>,
      sortable: true
    },
    {
      id: "description",
      header: "Description",
      cell: (subject: typeof MOCK_SUBJECTS[0]) => (
        <span className="truncate block max-w-[300px]">{subject.description}</span>
      ),
      sortable: false
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (subject: typeof MOCK_SUBJECTS[0]) => new Date(subject.createdAt).toLocaleDateString(),
      sortable: true
    },
    {
      id: "actions",
      header: "",
      cell: (subject: typeof MOCK_SUBJECTS[0]) => (
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
              <DropdownMenuItem onClick={() => handleViewSubject(subject.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(subject.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteClick(subject.id)}
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
        title="Subjects"
        description="Manage all subjects in the system"
        onAddNew={handleAddNew}
        addNewLabel="Add Subject"
        searchPlaceholder="Search subjects..."
        onSearch={handleSearch}
        sortOptions={sortOptions}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        className="px-2 sm:px-4"
        defaultSort={getCurrentSortValue()}
      >
        <DataTable
          data={getPaginatedData()}
          columns={columns}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => handleViewSubject(item.id)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages: Math.max(1, Math.ceil(filteredSubjects.length / 10)),
            onPageChange: handlePageChange
          }}
          emptyState={
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No subjects found</p>
              <Button onClick={handleAddNew}>Add your first subject</Button>
            </div>
          }
        />
      </DataManagementLayout>
      
      {/* Subject Form Drawer */}
      <DataFormDrawer
        title={isEditMode ? "Edit Subject" : "Add New Subject"}
        description={isEditMode ? "Update subject details" : "Create a new subject"}
        open={formDrawerOpen}
        onOpenChange={setFormDrawerOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitLabel={isEditMode ? "Save Changes" : "Create Subject"}
        size="md"
      >
        <div className="space-y-6">
          {isEditMode && currentSubject.id && (
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                value={currentSubject.id}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              value={currentSubject.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="Enter subject name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={currentSubject.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              placeholder="Enter subject description"
              rows={4}
            />
          </div>
          
          {isEditMode && currentSubject.createdAt && (
            <div className="space-y-2">
              <Label htmlFor="createdAt">Created At</Label>
              <Input
                id="createdAt"
                value={new Date(currentSubject.createdAt).toLocaleDateString()}
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
        title="Delete Subject"
        description="Are you sure you want to delete this subject? This action cannot be undone and will remove all associated content."
      />
    </AdminLayout>
  )
}
