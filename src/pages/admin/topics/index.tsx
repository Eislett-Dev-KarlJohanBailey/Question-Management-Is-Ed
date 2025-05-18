
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
const MOCK_COURSES = [
  { 
    id: "1", 
    name: "Calculus I",
    subjectId: "1"
  },
  { 
    id: "2", 
    name: "Mechanics",
    subjectId: "2"
  },
  { 
    id: "3", 
    name: "Shakespeare",
    subjectId: "3"
  },
  { 
    id: "4", 
    name: "World War II",
    subjectId: "4"
  },
  { 
    id: "5", 
    name: "Data Structures",
    subjectId: "5"
  }
]

const MOCK_TOPICS = [
  { 
    id: "1", 
    name: "Limits and Continuity", 
    description: "Introduction to the concept of limits and continuity in calculus",
    courseId: "1",
    createdAt: "2025-01-15"
  },
  { 
    id: "2", 
    name: "Newton's Laws of Motion", 
    description: "Fundamental principles governing the motion of objects",
    courseId: "2",
    createdAt: "2025-02-10"
  },
  { 
    id: "3", 
    name: "Hamlet Analysis", 
    description: "In-depth analysis of Shakespeare's Hamlet",
    courseId: "3",
    createdAt: "2025-03-05"
  },
  { 
    id: "4", 
    name: "D-Day Invasion", 
    description: "Study of the Allied invasion of Normandy",
    courseId: "4",
    createdAt: "2025-01-20"
  },
  { 
    id: "5", 
    name: "Binary Trees", 
    description: "Implementation and applications of binary trees",
    courseId: "5",
    createdAt: "2025-02-25"
  }
]

// Topic form type
interface TopicFormData {
  id?: string
  name: string
  description: string
  courseId: string
  createdAt?: string
}

export default function TopicsPage() {
  const router = useRouter()
  const [topics, setTopics] = useState(MOCK_TOPICS)
  const [filteredTopics, setFilteredTopics] = useState(MOCK_TOPICS)
  const [courses, setCourses] = useState(MOCK_COURSES)
  const [isLoading, setIsLoading] = useState(false)
  
  // URL-synced state
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState<string>("")
  
  // Form drawer state
  const [formDrawerOpen, setFormDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTopic, setCurrentTopic] = useState<TopicFormData>({
    name: "",
    description: "",
    courseId: ""
  })
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null)
  
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
    
    // Get course filter from URL
    const courseFilterFromUrl = router.query.course as string
    if (courseFilterFromUrl) {
      setCourseFilter(courseFilterFromUrl)
    }
    
    // Apply filters based on URL params
    applyFilters()
  }, [router.isReady, router.query])
  
  // Apply all filters, sorting, and pagination
  const applyFilters = () => {
    setIsLoading(true)
    
    // Start with all topics
    let result = [...topics]
    
    // Apply search filter if present
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase()
      result = result.filter(topic => 
        topic.name.toLowerCase().includes(lowerSearch) || 
        topic.description.toLowerCase().includes(lowerSearch)
      )
    }
    
    // Apply course filter if present
    if (courseFilter) {
      result = result.filter(topic => topic.courseId === courseFilter)
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      
      if (sortColumn === "id") {
        comparison = a.id.localeCompare(b.id)
      } else if (sortColumn === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortColumn === "course") {
        const courseA = courses.find(c => c.id === a.courseId)?.name || ""
        const courseB = courses.find(c => c.id === b.courseId)?.name || ""
        comparison = courseA.localeCompare(courseB)
      } else if (sortColumn === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      
      return sortDirection === "asc" ? comparison : -comparison
    })
    
    setFilteredTopics(result)
    setIsLoading(false)
  }
  
  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters()
  }, [topics, searchQuery, courseFilter, sortColumn, sortDirection])
  
  // Handle form input changes
  const handleFormChange = (field: keyof TopicFormData, value: string) => {
    setCurrentTopic(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Open form drawer for creating a new topic
  const handleAddNew = () => {
    setCurrentTopic({
      name: "",
      description: "",
      courseId: ""
    })
    setIsEditMode(false)
    setFormDrawerOpen(true)
  }
  
  // Open form drawer for editing a topic
  const handleEdit = (id: string) => {
    const topicToEdit = topics.find(topic => topic.id === id)
    if (topicToEdit) {
      setCurrentTopic({
        id: topicToEdit.id,
        name: topicToEdit.name,
        description: topicToEdit.description,
        courseId: topicToEdit.courseId,
        createdAt: topicToEdit.createdAt
      })
      setIsEditMode(true)
      setFormDrawerOpen(true)
    }
  }
  
  // Handle form submission
  const handleFormSubmit = () => {
    setIsSubmitting(true)
    
    // Validate form
    if (!currentTopic.name || !currentTopic.courseId) {
      // In a real app, you would show validation errors
      setIsSubmitting(false)
      return
    }
    
    // Simulate API call
    setTimeout(() => {
      if (isEditMode && currentTopic.id) {
        // Update existing topic
        setTopics(prev => 
          prev.map(topic => 
            topic.id === currentTopic.id 
              ? { 
                  ...topic, 
                  name: currentTopic.name,
                  description: currentTopic.description,
                  courseId: currentTopic.courseId
                } 
              : topic
          )
        )
      } else {
        // Create new topic
        const newTopic = {
          id: `${topics.length + 1}`,
          name: currentTopic.name,
          description: currentTopic.description,
          courseId: currentTopic.courseId,
          createdAt: new Date().toISOString().split("T")[0]
        }
        setTopics(prev => [...prev, newTopic])
      }
      
      setIsSubmitting(false)
      setFormDrawerOpen(false)
    }, 1000)
  }
  
  // Open delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setTopicToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!topicToDelete) return
    
    setIsDeleting(true)
    
    // Simulate API call
    setTimeout(() => {
      setTopics(topics.filter(topic => topic.id !== topicToDelete))
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setTopicToDelete(null)
    }, 1000)
  }
  
  // Simulate viewing a topic
  const handleViewTopic = (id: string) => {
    router.push(`/admin/topics/${id}`)
  }
  
  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }
  
  // Handle course filter change
  const handleCourseFilterChange = (value: string) => {
    setCourseFilter(value)
    setCurrentPage(1)
    
    // Update URL
    const query = { ...router.query, course: value || null, page: "1" }
    if (!value) delete query.course
    
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
    
    return filteredTopics.slice(startIndex, endIndex)
  }
  
  // Get course name by ID
  const getCourseName = (courseId: string) => {
    return courses.find(course => course.id === courseId)?.name || "Unknown"
  }
  
  // Filter options
  const filterOptions = [
    {
      id: "course",
      label: "Course",
      type: "select" as const,
      value: courseFilter,
      onChange: handleCourseFilterChange,
      placeholder: "Select course",
      options: [
        { label: "All Courses", value: "" },
        ...courses.map(course => ({
          label: course.name,
          value: course.id
        }))
      ]
    }
  ]
  
  // Table columns configuration
  const columns = [
    {
      id: "id",
      header: "ID",
      cell: (topic: typeof MOCK_TOPICS[0]) => <span className="text-muted-foreground text-sm">{topic.id}</span>,
      sortable: true
    },
    {
      id: "name",
      header: "Topic Name",
      cell: (topic: typeof MOCK_TOPICS[0]) => <span className="font-medium">{topic.name}</span>,
      sortable: true
    },
    {
      id: "course",
      header: "Course",
      cell: (topic: typeof MOCK_TOPICS[0]) => <span>{getCourseName(topic.courseId)}</span>,
      sortable: true
    },
    {
      id: "description",
      header: "Description",
      cell: (topic: typeof MOCK_TOPICS[0]) => (
        <span className="truncate block max-w-[300px]">{topic.description}</span>
      ),
      sortable: false
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (topic: typeof MOCK_TOPICS[0]) => new Date(topic.createdAt).toLocaleDateString(),
      sortable: true
    },
    {
      id: "actions",
      header: "",
      cell: (topic: typeof MOCK_TOPICS[0]) => (
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
              <DropdownMenuItem onClick={() => handleViewTopic(topic.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(topic.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteClick(topic.id)}
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
    { label: "Course (A-Z)", value: "course_asc" },
    { label: "Course (Z-A)", value: "course_desc" },
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
        title="Topics"
        description="Manage all topics in the system"
        onAddNew={handleAddNew}
        addNewLabel="Add Topic"
        searchPlaceholder="Search topics..."
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
        defaultShowFilters={!!courseFilter}
      >
        <DataTable
          data={getPaginatedData()}
          columns={columns}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => handleViewTopic(item.id)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages: Math.max(1, Math.ceil(filteredTopics.length / 10)),
            onPageChange: handlePageChange
          }}
          emptyState={
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No topics found</p>
              <Button onClick={handleAddNew}>Add your first topic</Button>
            </div>
          }
        />
      </DataManagementLayout>
      
      {/* Topic Form Drawer */}
      <DataFormDrawer
        title={isEditMode ? "Edit Topic" : "Add New Topic"}
        description={isEditMode ? "Update topic details" : "Create a new topic"}
        open={formDrawerOpen}
        onOpenChange={setFormDrawerOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitLabel={isEditMode ? "Save Changes" : "Create Topic"}
        size="md"
      >
        <div className="space-y-6">
          {isEditMode && currentTopic.id && (
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                value={currentTopic.id}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Topic Name</Label>
            <Input
              id="name"
              value={currentTopic.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="Enter topic name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select 
              value={currentTopic.courseId} 
              onValueChange={(value) => handleFormChange("courseId", value)}
            >
              <SelectTrigger id="course">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={currentTopic.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              placeholder="Enter topic description"
              rows={4}
            />
          </div>
          
          {isEditMode && currentTopic.createdAt && (
            <div className="space-y-2">
              <Label htmlFor="createdAt">Created At</Label>
              <Input
                id="createdAt"
                value={new Date(currentTopic.createdAt).toLocaleDateString()}
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
        title="Delete Topic"
        description="Are you sure you want to delete this topic? This action cannot be undone and will remove all associated content."
      />
    </AdminLayout>
  )
}
