import { toast } from "@/hooks/use-toast";
import { QuestionDetails } from "@/models/questions/questionDetails";
import { QuestionReqParams } from "@/models/questions/questionReqParams";
import { formatGetReqJson, removeNulls } from "@/services/utils";

interface returnType {
    data?: QuestionDetails[];
    amount?: number;
    error?: string;
}  

async function handleFetchQuestionById(question_id?: number): Promise<QuestionDetails | {error? : string}> {

    try {
        
        
        const rawResponse = await fetch(`/api/questions/${question_id}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                
            }
        );

        return await rawResponse.json() as  QuestionDetails;
    }
    catch(e){
        toast({ title: 'Error fetching question', style: { background: 'red', color: 'white' }, duration: 3500 })
        console.log('Questions error', e);
        return {error : 'Failed to fetch question by id'}
    }
}

async function handleFetchQuestions(page_number: number, page_size: number, title?: string, sub_topic_id?: number): Promise<returnType> {

    try {
        const params: QuestionReqParams = { page_number, page_size, title: title, sub_topic_id: sub_topic_id }
        
        removeNulls(params);
        
        const rawResponse = await fetch(`/api/questions?${formatGetReqJson(params)}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                
            }
        );

        return await rawResponse.json() as {data : QuestionDetails[] , amount : number};
    }
    catch(e){
        toast({ title: 'Error fetching list of questions', style: { background: 'red', color: 'white' }, duration: 3500 })
        console.log('Questions error', e);
        return {error : 'Failed to fetch questions'}
    }
}

async function handleDeleteQuestion(question_id: number): Promise<{deleted : boolean , error? : string}> {

    try {
        
        
        const rawResponse = await fetch(`/api/questions/${question_id}`,
            {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                
            }
        );

        if(rawResponse.ok)
            return {deleted : true}

        return {deleted : false}
       
    }
    catch(e){
        toast({ title: 'Error deleting question', style: { background: 'red', color: 'white' }, duration: 3500 })
        console.log('Questions error', e);
        return {deleted: false , error : 'Failed to delete question'}
    }
}

export {handleFetchQuestionById, handleFetchQuestions, handleDeleteQuestion};