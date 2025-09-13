import { toast } from "@/hooks/use-toast";
import { TopicDetails } from "@/models/topics/topicDetails";
import { TopicReqParams } from "@/models/topics/topicReqParams";
import { formatGetReqJson, removeNulls } from "@/services/utils";

interface TopicsReturnType {
  data?: TopicDetails[];
  amount?: number;
  error?: string;
}

interface TopicReturnType {
  data?: TopicDetails;
  error?: string;
}

async function handleFetchTopics(
  token: string,
  page_number: number,
  page_size: number
): Promise<TopicsReturnType> {
  try {
    const params: TopicReqParams = { page_number, page_size };

    removeNulls(params);

    const rawResponse = await fetch(`/api/topics?${formatGetReqJson(params)}`, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!rawResponse.ok) {
      throw new Error("Failed to fetch topics");
    }

    return (await rawResponse.json()) as {
      data: TopicDetails[];
      amount: number;
    };
  } catch (e) {
    toast({
      title: "Error fetching list of topics",
      style: { background: "red", color: "white" },
      duration: 3500,
    });
    console.log("Topics error", e);
    return { error: "Failed to fetch topics" };
  }
}

async function handleCreateTopic(
  token: string,
  topicData: TopicDetails
): Promise<TopicReturnType> {
  try {
    const rawResponse = await fetch(`/api/topics`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(topicData),
    });

    if (!rawResponse.ok) {
      throw new Error("Failed to create topic");
    }

    return (await rawResponse.json()) as { data: TopicDetails };
  } catch (e) {
    toast({
      title: "Error creating topic",
      style: { background: "red", color: "white" },
      duration: 3500,
    });
    console.log("Create topic error", e);
    return { error: "Failed to create topic" };
  }
}

async function handleUpdateTopic(
  token: string,
  topicData: TopicDetails
): Promise<TopicReturnType> {
  try {
    const rawResponse = await fetch(`/api/topics/${topicData.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(topicData),
    });

    if (!rawResponse.ok) {
      throw new Error("Failed to update topic");
    }

    return (await rawResponse.json()) as { data: TopicDetails };
  } catch (e) {
    toast({
      title: "Error updating topic",
      style: { background: "red", color: "white" },
      duration: 3500,
    });
    console.log("Update topic error", e);
    return { error: "Failed to update topic" };
  }
}

async function handleDeleteTopic(
  token: string,
  topicId: string
): Promise<{ error?: string }> {
  try {
    const rawResponse = await fetch(`/api/topics/${topicId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!rawResponse.ok) {
      throw new Error("Failed to delete topic");
    }

    return await rawResponse.json();
  } catch (e) {
    toast({
      title: "Error deleting topic",
      style: { background: "red", color: "white" },
      duration: 3500,
    });
    console.log("Delete topic error", e);
    return { error: "Failed to delete topic" };
  }
}

export {
  handleFetchTopics,
  handleCreateTopic,
  handleUpdateTopic,
  handleDeleteTopic,
};
