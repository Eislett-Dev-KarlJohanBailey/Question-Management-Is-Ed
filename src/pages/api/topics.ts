import {
  HTTP_REQUEST_INTERVAL,
  HTTP_REQUEST_LIMIT,
} from "@/constants/rateLimitParams";
import rateLimit from "@/services/rateLimit";
import { formatGetReqJson } from "@/services/utils";
import { NextApiRequest, NextApiResponse } from "next";

interface Error {
  error?: string;
}

// Get All Topics
async function GET(req: NextApiRequest, res: NextApiResponse) {
  // const isRateLimit = rateLimit(HTTP_REQUEST_LIMIT, HTTP_REQUEST_INTERVAL)
  // if( !(await isRateLimit(req , res) )){
  //   return res.status(429).json({ error: 'Too many requests, please try again later.' } );
  // }

  console.log("GET /api/topics");

  const query = req.query; // { page_number: '1', page_size: '5' }

  console.log("query", req.query);

  if (!query?.page_number) {
    return res.status(400).json({ error: "Page Number is required" });
  } else if (!query.page_size) {
    return res.status(400).json({ error: "Page Size is required" });
  }

  try {
    const route = "topics";
    const token = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    const nodeServer = process.env.SERVER_BASE_URL;

    const rawResponse = await fetch(
      `${nodeServer}${route}?${formatGetReqJson(query)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (!rawResponse.ok) {
      throw new Error("Failed to fetch topics");
    }

    const response = await rawResponse.json();
    // console.log("GET /api/topics (Response):", response);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Topics GET: " + error.message });
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  // const isRateLimit = rateLimit(HTTP_REQUEST_LIMIT, HTTP_REQUEST_INTERVAL)
  // if( !(await isRateLimit(req , res) )){
  //   return res.status(429).json({ error: 'Too many requests, please try again later.' } );
  // }

  console.log("POST /api/topics");

  const topicDetails = await req.body;

  console.log("body", req.body);

  if (!topicDetails?.name) {
    return res.status(400).json({ error: "Name is required" });
  } else if (!topicDetails.description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    const route = "topics";
    const token = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    const nodeServer = process.env.SERVER_BASE_URL;

    const rawResponse = await fetch(`${nodeServer}${route}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(topicDetails),
    });

    if (!rawResponse.ok) {
      throw new Error("Failed to create topic");
    }

    const response = await rawResponse.json();

    console.log("POST /api/topics (Response):", response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Topics POST: " + error.message });
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  console.log("PUT /api/topics");

  const topicDetails = await req.body;

  console.log("body", req.body);

  if (!topicDetails?.id) {
    return res.status(400).json({ error: "Topic ID is required" });
  }
  if (!topicDetails?.name) {
    return res.status(400).json({ error: "Name is required" });
  } else if (!topicDetails.description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    const route = `topics/${topicDetails.id}`;
    const token = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    const nodeServer = process.env.SERVER_BASE_URL;

    const rawResponse = await fetch(`${nodeServer}${route}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(topicDetails),
    });

    if (!rawResponse.ok) {
      throw new Error("Failed to update topic");
    }

    const response = await rawResponse.json();

    console.log("PUT /api/topics (Response):", response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Topics PUT: " + error.message });
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  console.log("DELETE topics");

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Topic ID is required" });
  }

  try {
    const route = `topics/${id}`;
    const token = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    const nodeServer = process.env.SERVER_BASE_URL;

    const rawResponse = await fetch(`${nodeServer}${route}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!rawResponse.ok) {
      throw new Error("Failed to delete topic");
    }

    const response = await rawResponse.json();

    console.log("DELETE /api/topics (Response):", response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Topics DELETE: " + error.message });
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") return await GET(req, res);
  else if (req.method === "POST") return await POST(req, res);
  else if (req.method === "PUT") return await PUT(req, res);
  else if (req.method === "DELETE") return await DELETE(req, res);
  else return res.status(500).json({ error: "Invalid request" });
}

export const config = {
  api: {
    responseLimit: false,
    bodyParser: true, // to parse data
  },
};

export default handler;
