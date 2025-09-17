import type { NextApiRequest, NextApiResponse } from "next";

type SubTopicResponse = {
  data?: {
    id: string;
    name: string;
    description: string;
    topicId: string;
    createdAt: string;
  };
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubTopicResponse>
) {
  const { method } = req;
  const { subTopicId } = req.query;

  if (!subTopicId || typeof subTopicId !== "string") {
    return res.status(400).json({ error: "Invalid subtopic ID" });
  }

  try {
    switch (method) {
      case "GET":
        return handleGet(req, res, subTopicId);
      case "PUT":
        return handlePut(req, res, subTopicId);
      case "DELETE":
        return handleDelete(req, res, subTopicId);
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<SubTopicResponse>,
  subTopicId: string
) {
  try {
    const response = await fetch(
      `${process.env.SERVER_BASE_URL}sub-topics/${subTopicId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization || "",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errorData.message || `HTTP error! status: ${response.status}`,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("GET /api/sub-topics/[subTopicId] error:", error);
    return res.status(500).json({ error: "Failed to fetch subtopic" });
  }
}

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<SubTopicResponse>,
  subTopicId: string
) {
  try {
    const { name, description, topicId } = req.body;

    if (!name || !description || !topicId) {
      return res.status(400).json({
        error: "Missing required fields: name, description, topicId",
      });
    }

    const response = await fetch(
      `${process.env.SERVER_BASE_URL}sub-topics/${subTopicId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization || "",
        },
        body: JSON.stringify({
          name,
          description,
          topicId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errorData.message || `HTTP error! status: ${response.status}`,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("PUT /api/sub-topics/[subTopicId] error:", error);
    return res.status(500).json({ error: "Failed to update subtopic" });
  }
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse<SubTopicResponse>,
  subTopicId: string
) {
  try {
    const response = await fetch(
      `${process.env.SERVER_BASE_URL}sub-topics/${subTopicId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization || "",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errorData.message || `HTTP error! status: ${response.status}`,
      });
    }

    return res.status(200).json({});
  } catch (error) {
    console.error("DELETE /api/sub-topics/[subTopicId] error:", error);
    return res.status(500).json({ error: "Failed to delete subtopic" });
  }
}
