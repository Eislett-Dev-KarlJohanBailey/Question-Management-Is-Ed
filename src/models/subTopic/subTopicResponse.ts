
import { SubTopicHintDetails } from "./subTopicHintDetails"

export interface SubTopicResponse {
  data: {
    id?: number
    name: string
    description: string
    hints: SubTopicHintDetails[]
    progress: number
  }[]
  amount: number
}