
import { useState } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { DataManagementLayout } from "@/components/layout/DataManagementLayout"
import { DataTable } from "@/components/data/DataTable"
import { FilterControls } from "@/components/data/FilterControls"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    category: "Science",
    status: "active",
    topics: 24,
    createdAt: "2025-01-15"
  },
  { 
    id: "2", 
    name: "Physics", 
    category: "Science",
    status: "active",
    topics: 18,
    createdAt: "2025-02-10"
  },
  { 
    id: "3", 
    name: "Literature", 
    category: "Humanities",
    status: "inactive",
    topics: 12,
    createdAt: "2025-03-05"
  },
  { 
    id: "4", 
    name: "History", 
    category: "Humanities",
    status: "active",
    topics: 30,
    createdAt: "2025-01-20"
  },
  { 
    id: "5", 
    name: "Computer Science", 
    category: "Technology",
    status: "active",
    topics: 22,
    createdAt: "2025-02-25"
  }
]

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
  
  // Simulate adding a new subject
  const handleAddNew = () => {
    router.push("/admin/subjects/new")
  }
  
  // Simulate viewing a subject
  const handleViewSubject = (id: string) => {
    router.push(`/admin/subjects/${id}`)
  }
  
  // Simulate editing a subject
  const handleEditSubject = (id: string) => {
    router.push(`/admin/subjects/${id}/edit`)
  }
  
  // Simulate deleting a subject
  const handleDeleteSubject = (id: string) => {
    // In a real app, you would call an API to delete the subject
    setSubjects(subjects.filter(subject => subject.id !== id))
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
              <DropdownMenuItem onClick={() => handleEditSubject(subject.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteSubject(subject.id)}
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
    </AdminLayout>
  )
}
