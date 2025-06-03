
import { QuestionDetails } from "@/models/questions/questionDetails";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuestionDetails | { error: string }>,
) {
  const { questionId } = req.query
  const method = req.method


  console.log(`${method} /api/questions/${questionId} (App Router)`);

  if (req.method != 'GET' && req.method != 'DELETE')
    return res.status(500).json({ error: 'Invalid request' });
  else if (!questionId || isNaN(Number(questionId))) {
    return res.status(200).json({ error: 'Invalid question id' });
  }



  try {
    const route = 'questions';
    const token = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    const nodeServer = process.env.SERVER_BASE_URL;

    const rawResponse = await fetch(
      `${nodeServer}${route}/${questionId}`,
      {
        method: method === 'GET' ? 'GET' : 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": token
        },
      }
    );

    if (!rawResponse.ok) {
      throw new Error('Failed to fetch questions');
    }

    const response = await rawResponse.json()

    // console.log('GET /api/questions (Response):', response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: `Failed to operate on question #${questionId} : ` + error.message });
  }
}