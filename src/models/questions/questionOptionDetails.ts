export interface QuestionOptionDetails {
  id? : number
  content : string // the actual option
  isCorrect : boolean 
  createdAt? : string
  questionId? : number
}