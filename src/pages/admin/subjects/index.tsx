
import { useState } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { DataManagementLayout } from "@/components/layout/DataManagementLayout"
import { DataTable } from "@/components/data/DataTable"
import { FilterControls } from "@/components/data/FilterControls"
import { DataFormDrawer } from "@/components/data/DataFormDrawer"
import { DeleteConfirmationDialog } from "@/components/data/DeleteConfirmationDialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
    category: "Science",
    status: "active",
    topics: 24,
    createdAt: "2025-01-15"
  },
  { 
    id: "2", 
    name: "Physics", 
    description: "Study of matter, energy, and the interaction between them",
    category: "Science",
    status: "active",
    topics: 18,
    createdAt: "2025-02-10"
  },
  { 
    id: "3", 
    name: "Literature", 
    description: "Study of written works, especially those considered of superior or lasting artistic merit",
    category: "Humanities",
    status: "inactive",
    topics: 12,
    createdAt: "2025-03-05"
  },
  { 
    id: "4", 
    name: "History", 
    description: "Study of past events, particularly in human affairs",
    category: "Humanities",
    status: "active",
    topics: 30,
    createdAt: "2025-01-20"
  },
  { 
    id: "5", 
    name: "Computer Science", 
    description: "Study of computers and computational systems",
    category: "Technology",
    status: "active",
    topics: 22,
    createdAt: "2025-02-25"
  }
]

// Subject form type
interface SubjectFormData {
  id?: string
  name: string
  description: string
  category: string
  status: string
}

export default function SubjectsPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS)
  const [isLoading, setIsLoading] = useState(false)
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    category: "",
    status: [],
    search: ""
  })
  
  // Form drawer state
  const [formDrawerOpen, setFormDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentSubject, setCurrentSubject] = useState<SubjectFormData>({
    name: "",
    description: "",
    category: "",
    status: "active"
  })
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null)
  
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
      description: "",
      category: "",
      status: "active"
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
        category: subjectToEdit.category,
        status: subjectToEdit.status
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
                  description: currentSubject.description,
                  category: currentSubject.category,
                  status: currentSubject.status
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
          category: currentSubject.category,
          status: currentSubject.status,
          topics: 0,
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
  
  // Simulate searching
  const handleSearch = (value: string) => {
    setFilters({...filters, search: value})
    setCurrentPage(1)
  }
  
  // Simulate sorting
  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column)
    setSortDirection(direction)
  }
  
  // Simulate filtering
  const handleFilterChange = (key: string, value: any) => {
    setFilters({...filters, [key]: value})
    setCurrentPage(1)
  }
  
  // Simulate applying filters
  const handleApplyFilters = () => {
    // In a real app, you would fetch filtered data from the API
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }
  
  // Simulate resetting filters
  const handleResetFilters = () => {
    setFilters({
      category: "",
      status: [],
      search: ""
    })
  }
  
  // Simulate refreshing data
  const handleRefresh = () => {
    setIsLoading(true)
    // In a real app, you would fetch fresh data from the API
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }
  
  // Table columns configuration
  const columns = [
    {
      id: "name",
      header: "Subject Name",
      cell: (subject: typeof MOCK_SUBJECTS[0]) => <span className="font-medium">{subject.name}</span>,
      sortable: true
    },
    {
      id: "category",
      header: "Category",
      cell: (subject: typeof MOCK_SUBJECTS[0]) => subject.category,
      sortable: true
    },
    {
      id: "status",
      header: "Status",
      cell: (subject: typeof MOCK_SUBJECTS[0]) => (
        <Badge variant={subject.status === "active" ? "default" : "secondary"}>
          {subject.status === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
      sortable: true
    },
    {
      id: "topics",
      header: "Topics",
      cell: (subject: typeof MOCK_SUBJECTS[0]) => subject.topics,
      sortable: true
    },
    {
      id: "createdAt",
      header: "Created",
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
  
  // Filter options
  const filterOptions = [
    {
      id: "category",
      label: "Category",
      type: "select" as const,
      options: [
        { label: "All Categories", value: "" },
        { label: "Science", value: "Science" },
        { label: "Humanities", value: "Humanities" },
        { label: "Technology", value: "Technology" }
      ],
      value: filters.category,
      onChange: (value: string) => handleFilterChange("category", value)
    },
    {
      id: "status",
      label: "Status",
      type: "checkbox" as const,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ],
      value: filters.status,
      onChange: (value: string[]) => handleFilterChange("status", value)
    }
  ]
  
  // Sort options
  const sortOptions = [
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
    { label: "Category (A-Z)", value: "category_asc" },
    { label: "Category (Z-A)", value: "category_desc" },
    { label: "Newest First", value: "createdAt_desc" },
    { label: "Oldest First", value: "createdAt_asc" }
  ]
  
  // Handle sort dropdown change
  const handleSortChange = (value: string) => {
    const [column, direction] = value.split("_")
    handleSort(column, direction as "asc" | "desc")
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
        filterControls={
          <FilterControls
            filters={filterOptions}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        }
        sortOptions={sortOptions}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        className="px-2 sm:px-4"
      >
        <DataTable
          data={subjects}
          columns={columns}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => handleViewSubject(item.id)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages: Math.ceil(subjects.length / 10),
            onPageChange: setCurrentPage
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
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={currentSubject.category}
              onValueChange={(value) => handleFormChange("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Humanities">Humanities</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={currentSubject.status === "active"}
                onCheckedChange={(checked) => 
                  handleFormChange("status", checked ? "active" : "inactive")
                }
              />
              <Label htmlFor="status" className="text-sm font-normal">
                {currentSubject.status === "active" ? "Active" : "Inactive"}
              </Label>
            </div>
          </div>
        </div>
      </DataFormDrawer>
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Subject"
        description="Are you sure you want to delete this subject? This action cannot be undone and will remove all associated topics and content."
      />
    </AdminLayout>
  )
}
