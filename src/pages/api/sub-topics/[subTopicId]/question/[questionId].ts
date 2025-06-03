
import { QuestionDetails } from "@/models/questions/questionDetails";
import type { NextApiRequest, NextApiResponse } from "next";

//linkQuestionToSubTopic
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuestionDetails|{error : string}>,
) {
    const {subTopicId, questionId } = req.query
    
    
    console.log(`POST /api/sub-topic/${subTopicId}/question/${questionId} (App Router)`);

    if(!questionId || isNaN(Number(questionId)) ){
        return res.status(200).json({error : 'Invalid question id'});
    }


  
    try {
      const route = `sub-topic/${subTopicId}/question/${questionId}`;
      const token = req.headers.authorization;
      const apiKey = process.env.API_KEY;
      const nodeServer = process.env.SERVER_BASE_URL;
  
      const rawResponse = await fetch(
        `${nodeServer}${route}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization" : token
          },
        }
      );
  
      if (!rawResponse.ok) {
        throw new Error('Failed to link question to subtopic');
      }
  
      const response = await rawResponse.json()
  
      // console.log('GET /api/questions (Response):', response);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: 'Link Question: ' + error.message });
    }
}