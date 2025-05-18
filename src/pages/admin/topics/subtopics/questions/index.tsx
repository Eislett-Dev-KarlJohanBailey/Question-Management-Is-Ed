
import { useEffect, useState, useCallback } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { DataManagementLayout } from "@/components/layout/DataManagementLayout"
import { DataTable } from "@/components/data/DataTable"
import { DeleteConfirmationDialog } from "@/components/data/DeleteConfirmationDialog"
import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Question, QuestionType } from "@/lib/types"

// Mock data for demonstration
const MOCK_SUBTOPICS = [
  { 
    id: "1", 
    name: "Epsilon-Delta Definition", 
    description: "Formal definition of limits using epsilon-delta notation",
    topicId: "1",
    createdAt: "2025-01-16"
  },
  { 
    id: "2", 
    name: "Limit Laws", 
    description: "Properties and rules for calculating limits",
    topicId: "1",
    createdAt: "2025-01-17"
  },
  { 
    id: "3", 
    name: "First Law of Motion", 
    description: "An object at rest stays at rest, and an object in motion stays in motion",
    topicId: "2",
    createdAt: "2025-02-11"
  },
  { 
    id: "4", 
    name: "Second Law of Motion", 
    description: "Force equals mass times acceleration (F = ma)",
    topicId: "2",
    createdAt: "2025-02-12"
  },
  { 
    id: "5", 
    name: "Character Analysis", 
    description: "In-depth study of Hamlet's character and motivations",
    topicId: "3",
    createdAt: "2025-03-06"
  }
]

const MOCK_QUESTIONS: Question[] = [
  {
    id: "1",
    title: "Understanding Limits",
    description: "Test your understanding of limits in calculus",
    content: "What is the limit of f(x) = (x^2 - 1)/(x - 1) as x approaches 1?",
    tags: ["calculus", "limits"],
    createdAt: "2025-01-20",
    type: QuestionType.MULTIPLE_CHOICE,
    totalPotentialMarks: 2,
    difficultyLevel: 0.6,
    subtopicId: "1",
    options: [
      { id: "1", content: "0", isCorrect: false },
      { id: "2", content: "1", isCorrect: false },
      { id: "3", content: "2", isCorrect: true },
      { id: "4", content: "Undefined", isCorrect: false }
    ]
  },
  {
    id: "2",
    title: "Limit Laws Application",
    description: "Apply limit laws to solve problems",
    content: "If lim(x→0) f(x) = 3 and lim(x→0) g(x) = 2, what is lim(x→0) [f(x) + g(x)]?",
    tags: ["calculus", "limit laws"],
    createdAt: "2025-01-22",
    type: QuestionType.MULTIPLE_CHOICE,
    totalPotentialMarks: 1,
    difficultyLevel: 0.3,
    subtopicId: "2",
    options: [
      { id: "1", content: "1", isCorrect: false },
      { id: "2", content: "5", isCorrect: true },
      { id: "3", content: "6", isCorrect: false },
      { id: "4", content: "0", isCorrect: false }
    ]
  },
  {
    id: "3",
    title: "Newton's First Law",
    description: "Understanding inertia",
    content: "An object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.",
    tags: ["physics", "newton"],
    createdAt: "2025-02-15",
    type: QuestionType.TRUE_FALSE,
    totalPotentialMarks: 1,
    difficultyLevel: 0.2,
    subtopicId: "3",
    options: [
      { id: "1", content: "True", isCorrect: true },
      { id: "2", content: "False", isCorrect: false }
    ]
  },
  {
    id: "4",
    title: "Force and Acceleration",
    description: "Understanding F=ma",
    content: "According to Newton's Second Law, if the mass of an object is doubled while the force remains constant, the acceleration will be halved.",
    tags: ["physics", "newton", "acceleration"],
    createdAt: "2025-02-18",
    type: QuestionType.TRUE_FALSE,
    totalPotentialMarks: 1,
    difficultyLevel: 0.4,
    subtopicId: "4",
    options: [
      { id: "1", content: "True", isCorrect: true },
      { id: "2", content: "False", isCorrect: false }
    ]
  }
]

export default function QuestionsPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS)
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(MOCK_QUESTIONS)
  const [subtopics, setSubtopics] = useState(MOCK_SUBTOPICS)
  const [isLoading, setIsLoading] = useState(false)
  
  // URL-synced state
  const [sortColumn, setSortColumn] = useState<string>("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [subtopicFilter, setSubtopicFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)
  
  // Apply all filters, sorting, and pagination
  const applyFilters = useCallback(() => {
    setIsLoading(true)
    
    let result = [...questions]
    
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase()
      result = result.filter(question => 
        question.title.toLowerCase().includes(lowerSearch) || 
        question.description?.toLowerCase().includes(lowerSearch) ||
        question.content.toLowerCase().includes(lowerSearch) ||
        question.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
      )
    }
    
    if (subtopicFilter) {
      result = result.filter(question => question.subtopicId === subtopicFilter)
    }
    
    if (typeFilter) {
      result = result.filter(question => question.type === typeFilter)
    }
    
    result.sort((a, b) => {
      let comparison = 0
      const valA = a[sortColumn as keyof Question]
      const valB = b[sortColumn as keyof Question]

      if (sortColumn === "subtopic") {
        const subtopicA = subtopics.find(s => s.id === a.subtopicId)?.name || ""
        const subtopicB = subtopics.find(s => s.id === b.subtopicId)?.name || ""
        comparison = subtopicA.localeCompare(subtopicB)
      } else if (typeof valA === "string" && typeof valB === "string") {
        comparison = valA.localeCompare(valB)
      } else if (typeof valA === "number" && typeof valB === "number") {
        comparison = valA - valB
      } else if (sortColumn === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return sortDirection === "asc" ? comparison : -comparison
    })
    
    setFilteredQuestions(result)
    setIsLoading(false)
  }, [questions, searchQuery, subtopicFilter, typeFilter, sortColumn, sortDirection, subtopics])

  // Initialize state from URL on first load
  useEffect(() => {
    if (!router.isReady) return
    
    const sortColumnFromUrl = router.query.sortColumn as string
    const sortDirectionFromUrl = router.query.sortDirection as "asc" | "desc"
    if (sortColumnFromUrl) setSortColumn(sortColumnFromUrl)
    if (sortDirectionFromUrl && ["asc", "desc"].includes(sortDirectionFromUrl)) setSortDirection(sortDirectionFromUrl)
    
    const pageFromUrl = router.query.page ? parseInt(router.query.page as string, 10) : 1
    if (!isNaN(pageFromUrl)) setCurrentPage(pageFromUrl)
    
    const searchFromUrl = router.query.search as string
    if (searchFromUrl) setSearchQuery(searchFromUrl)
    
    const subtopicFilterFromUrl = router.query.subtopic as string
    if (subtopicFilterFromUrl) setSubtopicFilter(subtopicFilterFromUrl)
    
    const typeFilterFromUrl = router.query.type as string
    if (typeFilterFromUrl) setTypeFilter(typeFilterFromUrl)
    
    applyFilters()
  }, [router.isReady, router.query, applyFilters])
  
  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters()
  }, [questions, searchQuery, subtopicFilter, typeFilter, sortColumn, sortDirection, applyFilters])
  
  const handleAddNew = () => {
    router.push({
      pathname: "/admin/topics/subtopics/questions/create",
      query: { subtopic: router.query.subtopic }
    })
  }
  
  const handleEdit = (id: string) => {
    router.push(`/admin/topics/subtopics/questions/edit/${id}`)
  }
  
  const handleDeleteClick = (id: string) => {
    setQuestionToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  const handleDeleteConfirm = () => {
    if (!questionToDelete) return
    setIsDeleting(true)
    setTimeout(() => {
      setQuestions(questions.filter(question => question.id !== questionToDelete))
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setQuestionToDelete(null)
    }, 1000)
  }
  
  const handleViewQuestion = (id: string) => {
    router.push(`/admin/topics/subtopics/questions/${id}`)
  }
  
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }
  
  const handleSubtopicFilterChange = (value: string) => {
    setSubtopicFilter(value)
    setCurrentPage(1)
    const query = { ...router.query, subtopic: value || undefined, page: "1" }
    if (!value) delete query.subtopic
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true })
  }
  
  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value)
    setCurrentPage(1)
    const query = { ...router.query, type: value || undefined, page: "1" }
    if (!value) delete query.type
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true })
  }
  
  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column)
    setSortDirection(direction)
    router.push({ 
      pathname: router.pathname, 
      query: { ...router.query, sortColumn: column, sortDirection: direction } 
    }, undefined, { shallow: true })
  }
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    router.push({ 
      pathname: router.pathname, 
      query: { ...router.query, page: page.toString() } 
    }, undefined, { shallow: true })
  }
  
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      applyFilters()
      setIsLoading(false)
    }, 500)
  }
  
  const getPaginatedData = () => {
    const itemsPerPage = 10
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredQuestions.slice(startIndex, startIndex + itemsPerPage)
  }
  
  const getSubtopicName = (subtopicId: string) => 
    subtopics.find(subtopic => subtopic.id === subtopicId)?.name || "Unknown"
  
  const filterOptions = [
    {
      id: "subtopic",
      label: "Subtopic",
      type: "select" as const,
      value: subtopicFilter,
      onChange: handleSubtopicFilterChange,
      placeholder: "Select subtopic",
      options: [
        { label: "All Subtopics", value: "" },
        ...subtopics.map(subtopic => ({ label: subtopic.name, value: subtopic.id }))
      ]
    },
    {
      id: "type",
      label: "Question Type",
      type: "select" as const,
      value: typeFilter,
      onChange: handleTypeFilterChange,
      placeholder: "Select type",
      options: [
        { label: "All Types", value: "" },
        { label: "Multiple Choice", value: QuestionType.MULTIPLE_CHOICE },
        { label: "True/False", value: QuestionType.TRUE_FALSE }
      ]
    }
  ]
  
  const columns = [
    { id: "id", header: "ID", cell: (question: Question) => <span className="text-muted-foreground text-sm">{question.id}</span>, sortable: true },
    { id: "title", header: "Title", cell: (question: Question) => <span className="font-medium">{question.title}</span>, sortable: true },
    { 
      id: "type", 
      header: "Type", 
      cell: (question: Question) => (
        <Badge variant={question.type === QuestionType.MULTIPLE_CHOICE ? "default" : "secondary"}>
          {question.type === QuestionType.MULTIPLE_CHOICE ? "Multiple Choice" : "True/False"}
        </Badge>
      ), 
      sortable: true 
    },
    { id: "subtopic", header: "Subtopic", cell: (question: Question) => <span>{getSubtopicName(question.subtopicId)}</span>, sortable: true },
    { 
      id: "difficultyLevel", 
      header: "Difficulty", 
      cell: (question: Question) => {
        const difficulty = question.difficultyLevel
        let color = "bg-green-500"
        if (difficulty > 0.3 && difficulty <= 0.6) color = "bg-yellow-500"
        if (difficulty > 0.6) color = "bg-red-500"
        
        return (
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
            <span>{(difficulty * 10).toFixed(1)}/10</span>
          </div>
        )
      }, 
      sortable: true 
    },
    { 
      id: "marks", 
      header: "Marks", 
      cell: (question: Question) => <span>{question.totalPotentialMarks}</span>, 
      sortable: true 
    },
    { 
      id: "tags", 
      header: "Tags", 
      cell: (question: Question) => (
        <div className="flex flex-wrap gap-1">
          {question.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
          ))}
          {question.tags.length > 3 && <Badge variant="outline" className="text-xs">+{question.tags.length - 3}</Badge>}
        </div>
      ), 
      sortable: false 
    },
    { id: "createdAt", header: "Created At", cell: (question: Question) => new Date(question.createdAt).toLocaleDateString(), sortable: true },
    {
      id: "actions",
      header: "",
      cell: (question: Question) => (
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
              <DropdownMenuItem onClick={() => handleViewQuestion(question.id)}>
                <Eye className="mr-2 h-4 w-4" />View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(question.id)}>
                <Edit className="mr-2 h-4 w-4" />Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteClick(question.id)} 
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ]
  
  const sortOptions = [
    { label: "Title (A-Z)", value: "title_asc" },
    { label: "Title (Z-A)", value: "title_desc" },
    { label: "Subtopic (A-Z)", value: "subtopic_asc" },
    { label: "Subtopic (Z-A)", value: "subtopic_desc" },
    { label: "Difficulty (Low to High)", value: "difficultyLevel_asc" },
    { label: "Difficulty (High to Low)", value: "difficultyLevel_desc" },
    { label: "Marks (Low to High)", value: "totalPotentialMarks_asc" },
    { label: "Marks (High to Low)", value: "totalPotentialMarks_desc" },
    { label: "Newest First", value: "createdAt_desc" },
    { label: "Oldest First", value: "createdAt_asc" }
  ]

  const handleSortChange = (value: string) => {
    const [column, direction] = value.split("_")
    handleSort(column, direction as "asc" | "desc")
  }

  const getCurrentSortValue = () => `${sortColumn}_${sortDirection}`
  
  return (
    <AdminLayout>
      <DataManagementLayout
        title="Questions"
        description="Manage all questions in the system"
        onAddNew={handleAddNew}
        addNewLabel="Add Question"
        searchPlaceholder="Search questions..."
        onSearch={handleSearch}
        sortOptions={sortOptions}
        onSortChange={handleSortChange}
        filterControls={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filterOptions.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <Label htmlFor={filter.id} className="text-sm font-medium">{filter.label}</Label>
                <Select value={filter.value} onValueChange={filter.onChange}>
                  <SelectTrigger id={filter.id}><SelectValue placeholder={filter.placeholder} /></SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
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
        defaultShowFilters={!!subtopicFilter || !!typeFilter}
      >
        <DataTable
          data={getPaginatedData()}
          columns={columns}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => handleViewQuestion(item.id)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages: Math.max(1, Math.ceil(filteredQuestions.length / 10)),
            onPageChange: handlePageChange
          }}
          emptyState={
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No questions found</p>
              <Button onClick={handleAddNew}>Add your first question</Button>
            </div>
          }
        />
      </DataManagementLayout>
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
      />
    </AdminLayout>
  )
}
