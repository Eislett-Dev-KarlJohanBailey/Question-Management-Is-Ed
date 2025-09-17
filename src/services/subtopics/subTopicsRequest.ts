import { SubTopicDetails } from "@/models/subTopic/subTopicDetails";
import { SubTopicReqParams } from "@/models/subTopic/subTopicReqParams";
import { removeNulls } from "@/services/utils";
import { toast } from "@/hooks/use-toast";

export const handleFetchSubTopics = async (
  token?: string,
  page_number?: number,
  page_size?: number,
  topic_id?: string,
  name?: string
) => {
  try {
    const params = removeNulls({
      page_number,
      page_size,
      topic_id,
      name,
    });

    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();

    const response = await fetch(
      `/api/sub-topics${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching subtopics:", error);
    toast({
      title: "Error fetching subtopics",
      style: { background: "red", color: "white" },
      duration: 3500,
    });
    return { error: "Failed to fetch subtopics" };
  }
};

export const handleCreateSubTopic = async (
  token?: string,
  subTopicData?: SubTopicDetails
) => {
  try {
    const response = await fetch("/api/sub-topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subTopicData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error creating subtopic:", error);
    toast({
      title: "Error creating subtopic",
      style: { background: "red", color: "white" },
      duration: 3500,
    });
    return { error: "Failed to create subtopic" };
  }
};

export const handleUpdateSubTopic = async (
  token?: string,
  subTopicData?: SubTopicDetails
) => {
  try {
    if (!subTopicData?.id) {
      throw new Error("SubTopic ID is required for update");
    }

    const response = await fetch(`/api/sub-topics/${subTopicData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subTopicData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error updating subtopic:", error);
    toast({
      title: "Error updating subtopic",
      style: { background: "red", color: "white" },
      duration: 3500,
    });
    return { error: "Failed to update subtopic" };
  }
};

export const handleDeleteSubTopic = async (
  token?: string,
  subTopicId?: string
) => {
  try {
    if (!subTopicId) {
      throw new Error("SubTopic ID is required for deletion");
    }

    const response = await fetch(`/api/sub-topics/${subTopicId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error deleting subtopic:", error);
    toast({
      title: "Error deleting subtopic",
      style: { background: "red", color: "white" },
      duration: 3500,
    });
    return { error: "Failed to delete subtopic" };
  }
};
