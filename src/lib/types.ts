
export enum QuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TRUE_FALSE = "TRUE_FALSE"
}

export interface Question {
  id: string
  title: string
  description?: string
  content: string
  tags: string[]
  createdAt: string
  type: QuestionType
  totalPotentialMarks: number
  difficultyLevel: number
  subtopicId: string
  options?: QuestionOption[]
}

export interface QuestionOption {
  id: string
  content: string
  isCorrect: boolean
}

export interface QuestionFormData {
  id?: string
  title: string
  description: string
  content: string
  tags: string[]
  type: QuestionType
  totalPotentialMarks: number
  difficultyLevel: number
  subtopicId: string
  options: QuestionOption[]
}
