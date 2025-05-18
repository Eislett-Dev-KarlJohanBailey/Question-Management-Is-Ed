
import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { DataManagementLayout } from "@/components/layout/DataManagementLayout"
import { DataTable } from "@/components/data/DataTable"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

// Mock data for demonstration
const MOCK_SUBJECTS = [
  { 
    id: "1", 
    name: "Mathematics"
  },
  { 
    id: "2", 
    name: "Physics"
  },
  { 
    id: "3", 
    name: "Literature"
  },
  { 
    id: "4", 
    name: "History"
  },
  { 
    id: "5", 
    name: "Computer Science"
  }
]

const MOCK_COURSES = [
  { 
    id: "1", 
    name: "Calculus I", 
    description: "Introduction to differential calculus",
    subjectId: "1",
    createdAt: "2025-01-15"
  },
  { 
    id: "2", 
    name: "Mechanics", 
    description: "Study of motion and forces",
    subjectId: "2",
    createdAt: "2025-02-10"
  },
  { 
    id: "3", 
    name: "Shakespeare", 
    description: "Analysis of Shakespeare's major works",
    subjectId: "3",
    createdAt: "2025-03-05"
  },
  { 
    id: "4", 
    name: "World War II", 
    description: "Comprehensive study of WWII",
    subjectId: "4",
    createdAt: "2025-01-20"
  },
  { 
    id: "5", 
    name: "Data Structures", 
    description: "Fundamental data structures and algorithms",
    subjectId: "5",
    createdAt: "2025-02-25"
  }
]

// Course form type
interface CourseFormData {
  id?: string
  name: string
  description: string
  subjectId: string
  createdAt?: string
}

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState(MOCK_COURSES)
  const [filteredCourses, setFilteredCourses] = useState(MOCK_COURSES)
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS)
  const [isLoading, setIsLoading] = useState(false)
  
  // URL-synced state
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState<string>("")
  
  // Form drawer state
  const [formDrawerOpen, setFormDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentCourse, setCurrentCourse] = useState<CourseFormData>({
    name: "",
    description: "",
    subjectId: ""
  })
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
  
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
    
    // Get subject filter from URL
    const subjectFilterFromUrl = router.query.subject as string
    if (subjectFilterFromUrl) {
      setSubjectFilter(subjectFilterFromUrl)
    }
    
    // Apply filters based on URL params
    applyFilters()
  }, [router.isReady, router.query])
  
  // Apply all filters, sorting, and pagination
  const applyFilters = () => {
    setIsLoading(true)
    
    // Start with all courses
    let result = [...courses]
    
    // Apply search filter if present
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase()
      result = result.filter(course => 
        course.name.toLowerCase().includes(lowerSearch) || 
        course.description.toLowerCase().includes(lowerSearch)
      )
    }
    
    // Apply subject filter if present
    if (subjectFilter) {
      result = result.filter(course => course.subjectId === subjectFilter)
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      
      if (sortColumn === "id") {
        comparison = a.id.localeCompare(b.id)
      } else if (sortColumn === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortColumn === "subject") {
        const subjectA = subjects.find(s => s.id === a.subjectId)?.name || ""
        const subjectB = subjects.find(s => s.id === b.subjectId)?.name || ""
        comparison = subjectA.localeCompare(subjectB)
      } else if (sortColumn === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      
      return sortDirection === "asc" ? comparison : -comparison
    })
    
    setFilteredCourses(result)
    setIsLoading(false)
  }
  
  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters()
  }, [courses, searchQuery, subjectFilter, sortColumn, sortDirection])
  
  // Handle form input changes
  const handleFormChange = (field: keyof CourseFormData, value: string) => {
    setCurrentCourse(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Open form drawer for creating a new course
  const handleAddNew = () => {
    setCurrentCourse({
      name: "",
      description: "",
      subjectId: ""
    })
    setIsEditMode(false)
    setFormDrawerOpen(true)
  }
  
  // Open form drawer for editing a course
  const handleEdit = (id: string) => {
    const courseToEdit = courses.find(course => course.id === id)
    if (courseToEdit) {
      setCurrentCourse({
        id: courseToEdit.id,
        name: courseToEdit.name,
        description: courseToEdit.description,
        subjectId: courseToEdit.subjectId,
        createdAt: courseToEdit.createdAt
      })
      setIsEditMode(true)
      setFormDrawerOpen(true)
    }
  }
  
  // Handle form submission
  const handleFormSubmit = () => {
    setIsSubmitting(true)
    
    // Validate form
    if (!currentCourse.name || !currentCourse.subjectId) {
      // In a real app, you would show validation errors
      setIsSubmitting(false)
      return
    }
    
    // Simulate API call
    setTimeout(() => {
      if (isEditMode && currentCourse.id) {
        // Update existing course
        setCourses(prev => 
          prev.map(course => 
            course.id === currentCourse.id 
              ? { 
                  ...course, 
                  name: currentCourse.name,
                  description: currentCourse.description,
                  subjectId: currentCourse.subjectId
                } 
              : course
          )
        )
      } else {
        // Create new course
        const newCourse = {
          id: `${courses.length + 1}`,
          name: currentCourse.name,
          description: currentCourse.description,
          subjectId: currentCourse.subjectId,
          createdAt: new Date().toISOString().split("T")[0]
        }
        setCourses(prev => [...prev, newCourse])
      }
      
      setIsSubmitting(false)
      setFormDrawerOpen(false)
    }, 1000)
  }
  
  // Open delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setCourseToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!courseToDelete) return
    
    setIsDeleting(true)
    
    // Simulate API call
    setTimeout(() => {
      setCourses(courses.filter(course => course.id !== courseToDelete))
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setCourseToDelete(null)
    }, 1000)
  }
  
  // Simulate viewing a course
  const handleViewCourse = (id: string) => {
    router.push(`/admin/courses/${id}`)
  }
  
  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }
  
  // Handle subject filter change
  const handleSubjectFilterChange = (value: string) => {
    setSubjectFilter(value)
    setCurrentPage(1)
    
    // Update URL
    const query = { ...router.query, subject: value || null, page: "1" }
    if (!value) delete query.subject
    
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
    
    return filteredCourses.slice(startIndex, endIndex)
  }
  
  // Get subject name by ID
  const getSubjectName = (subjectId: string) => {
    return subjects.find(subject => subject.id === subjectId)?.name || "Unknown"
  }
  
  // Filter options
  const filterOptions = [
    {
      id: "subject",
      label: "Subject",
      type: "select" as const,
      value: subjectFilter,
      onChange: handleSubjectFilterChange,
      placeholder: "Select subject",
      options: [
        { label: "All Subjects", value: "" },
        ...subjects.map(subject => ({
          label: subject.name,
          value: subject.id
        }))
      ]
    }
  ]
  
  // Table columns configuration
  const columns = [
    {
      id: "id",
      header: "ID",
      cell: (course: typeof MOCK_COURSES[0]) => <span className="text-muted-foreground text-sm">{course.id}</span>,
      sortable: true
    },
    {
      id: "name",
      header: "Course Name",
      cell: (course: typeof MOCK_COURSES[0]) => <span className="font-medium">{course.name}</span>,
      sortable: true
    },
    {
      id: "subject",
      header: "Subject",
      cell: (course: typeof MOCK_COURSES[0]) => <span>{getSubjectName(course.subjectId)}</span>,
      sortable: true
    },
    {
      id: "description",
      header: "Description",
      cell: (course: typeof MOCK_COURSES[0]) => (
        <span className="truncate block max-w-[300px]">{course.description}</span>
      ),
      sortable: false
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (course: typeof MOCK_COURSES[0]) => new Date(course.createdAt).toLocaleDateString(),
      sortable: true
    },
    {
      id: "actions",
      header: "",
      cell: (course: typeof MOCK_COURSES[0]) => (
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
              <DropdownMenuItem onClick={() => handleViewCourse(course.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(course.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteClick(course.id)}
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
    { label: "Subject (A-Z)", value: "subject_asc" },
    { label: "Subject (Z-A)", value: "subject_desc" },
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
        title="Courses"
        description="Manage all courses in the system"
        onAddNew={handleAddNew}
        addNewLabel="Add Course"
        searchPlaceholder="Search courses..."
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
        defaultShowFilters={!!subjectFilter}
      >
        <DataTable
          data={getPaginatedData()}
          columns={columns}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => handleViewCourse(item.id)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages: Math.max(1, Math.ceil(filteredCourses.length / 10)),
            onPageChange: handlePageChange
          }}
          emptyState={
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No courses found</p>
              <Button onClick={handleAddNew}>Add your first course</Button>
            </div>
          }
        />
      </DataManagementLayout>
      
      {/* Course Form Drawer */}
      <DataFormDrawer
        title={isEditMode ? "Edit Course" : "Add New Course"}
        description={isEditMode ? "Update course details" : "Create a new course"}
        open={formDrawerOpen}
        onOpenChange={setFormDrawerOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitLabel={isEditMode ? "Save Changes" : "Create Course"}
        size="md"
      >
        <div className="space-y-6">
          {isEditMode && currentCourse.id && (
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                value={currentCourse.id}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              value={currentCourse.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="Enter course name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select 
              value={currentCourse.subjectId} 
              onValueChange={(value) => handleFormChange("subjectId", value)}
            >
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={currentCourse.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              placeholder="Enter course description"
              rows={4}
            />
          </div>
          
          {isEditMode && currentCourse.createdAt && (
            <div className="space-y-2">
              <Label htmlFor="createdAt">Created At</Label>
              <Input
                id="createdAt"
                value={new Date(currentCourse.createdAt).toLocaleDateString()}
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
        title="Delete Course"
        description="Are you sure you want to delete this course? This action cannot be undone and will remove all associated content."
      />
    </AdminLayout>
  )
}
