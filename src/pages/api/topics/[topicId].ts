import {
  HTTP_REQUEST_INTERVAL,
  HTTP_REQUEST_LIMIT,
} from "@/constants/rateLimitParams";
import rateLimit from "@/services/rateLimit";
import { NextApiRequest, NextApiResponse } from "next";

interface Error {
  error?: string;
}

// Get Single Topic
async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log("GET /api/topics/[topicId]");

  const { topicId } = req.query;

  if (!topicId) {
    return res.status(400).json({ error: "Topic ID is required" });
  }

  try {
    const route = `topics/${topicId}`;
    const token = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    const nodeServer = process.env.SERVER_BASE_URL;

    const rawResponse = await fetch(`${nodeServer}${route}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!rawResponse.ok) {
      throw new Error("Failed to fetch topic");
    }

    const response = await rawResponse.json();

    console.log("GET /api/topics/[topicId] (Response):", response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Topic GET: " + error.message });
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  console.log("PUT topics/[topicId]");

  const { topicId } = req.query;
  const topicDetails = await req.body;

  if (!topicId) {
    return res.status(400).json({ error: "Topic ID is required" });
  }

  if (!topicDetails?.name) {
    return res.status(400).json({ error: "Name is required" });
  } else if (!topicDetails.description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    const route = `topics/${topicId}`;
    const token = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    const nodeServer = process.env.SERVER_BASE_URL;
    //strip out subtopics array from topicDetails
    const { subTopics, ...rest } = topicDetails;

    console.log("route", `${nodeServer}${route}`);
    console.log("rest", rest);
    const rawResponse = await fetch(`${nodeServer}${route}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(rest),
    });

    if (!rawResponse.ok) {
      throw new Error("Failed to update topic");
    }

    const response = await rawResponse.json();

    console.log("PUT /api/topics/[topicId] (Response):", response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Topic PUT: " + error.message });
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  console.log("DELETE /api/topics/[topicId]");

  const { topicId } = req.query;

  if (!topicId) {
    return res.status(400).json({ error: "Topic ID is required" });
  }

  try {
    const route = `topics/${topicId}`;
    const token = req.headers.authorization;
    const apiKey = process.env.API_KEY;
    const nodeServer = process.env.SERVER_BASE_URL;
    console.log("route", `${nodeServer}${route}`);
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

    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ error: "Topic DELETE: " + error.message });
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") return await GET(req, res);
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
