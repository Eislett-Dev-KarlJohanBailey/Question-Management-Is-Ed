import { SubTopicHintDetails } from "../subTopic/subTopicHintDetails"

export interface QuestionSubTopicDetails {
    id : number 
    name : string 
    description : string 
    createdAt : string 
    hints : SubTopicHintDetails[]
    progress : number   
}