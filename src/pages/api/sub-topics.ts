import type { NextApiRequest, NextApiResponse } from "next";
import { formatGetReqJson } from "@/services/utils";

type SubTopicResponse = {
  data?: Array<{
    id: string;
    name: string;
    description: string;
    topicId: string;
    createdAt: string;
  }>;
  amount?: number;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubTopicResponse>
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        return handleGet(req, res);
      case "POST":
        return handlePost(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<SubTopicResponse>
) {
  try {
    const { page_number = 1, page_size = 10, topic_id } = req.query;

    const params = formatGetReqJson({
      page_number: parseInt(page_number as string),
      page_size: parseInt(page_size as string),
      topicId: topic_id as string,
    });

    const queryString = new URLSearchParams(params).toString();
    const url = `${process.env.SERVER_BASE_URL}sub-topics${
      queryString ? `?${queryString}` : ""
    }`;
    console.log("URL", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization || "",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errorData.message || `HTTP error! status: ${response.status}`,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("GET /api/sub-topics error:", error);
    return res.status(500).json({ error: "Failed to fetch subtopics" });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<SubTopicResponse>
) {
  try {
    const { name, description, topicId } = req.body;

    if (!name || !description || !topicId) {
      return res.status(400).json({
        error: "Missing required fields: name, description, topicId",
      });
    }
    console.log("URL", `${process.env.SERVER_BASE_URL}sub-topics`);
    const response = await fetch(`${process.env.SERVER_BASE_URL}sub-topics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization || "",
      },
      body: JSON.stringify({
        name,
        description,
        topicId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errorData.message || `HTTP error! status: ${response.status}`,
      });
    }

    const data = await response.json();
    return res.status(201).json(data);
  } catch (error) {
    console.error("POST /api/sub-topics error:", error);
    return res.status(500).json({ error: "Failed to create subtopic" });
  }
}
