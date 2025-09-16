import { useEffect, useState, useCallback, useContext } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SubtopicManagement } from "@/components/data/SubtopicManagement";
import { SubtopicFormData } from "@/components/data/SubtopicForm";
import { useRouter } from "next/router";
import { SubTopicDetails } from "@/models/subTopic/subTopicDetails";
import { TopicDetails } from "@/models/topics/topicDetails";
import {
  handleFetchSubTopics,
  handleCreateSubTopic,
  handleUpdateSubTopic,
  handleDeleteSubTopic,
} from "@/services/subtopics/subTopicsRequest";
import { handleFetchTopics } from "@/services/topics/topicsRequest";
import { useAuth } from "@/contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  getFilteredSubTopics,
  getSubTopicAmt,
  getSubTopicReqParams,
  getSubTopics,
  getSubTopicsIsLoading,
  getSubTopicTableDeleteData,
  getSubTopicTableFilters,
  getSubTopicsRefreshTrigger,
  setFilteredSubTopics,
  setSubTopicAmount,
  setSubTopicReqParams,
  setSubTopics,
  setSubTopicsIsLoading,
  setSubTopicTableDeleteData,
  setSubTopicTableFilters,
  triggerSubTopicsRefresh,
} from "@/store/subtopics.slice";
import { getTopics, setTopics } from "@/store/topics.slice";
import { DEFAULT_PAGE_NUMBER } from "@/constants/tablePageSizes";
import { toast } from "@/hooks/use-toast";
import { removeNulls } from "@/services/utils";

export default function SubtopicsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authContext = useContext(useAuth());

  const subtopicReqParams = useAppSelector(getSubTopicReqParams);
  const totalSubTopicAmt = useAppSelector(getSubTopicAmt);
  const filters = useAppSelector(getSubTopicTableFilters);
  const deleteData = useAppSelector(getSubTopicTableDeleteData);
  const isLoading = useAppSelector(getSubTopicsIsLoading);
  const refreshTrigger = useAppSelector(getSubTopicsRefreshTrigger);

  const subtopics = useAppSelector(getSubTopics);
  const filteredSubtopics = useAppSelector(getFilteredSubTopics);
  const topics = useAppSelector(getTopics);

  // Form drawer state
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSubtopic, setCurrentSubtopic] = useState<SubtopicFormData>({
    name: "",
    description: "",
    topicId: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Apply all filters, sorting, and pagination
  const applyFilters = useCallback(() => {
    dispatch(setSubTopicsIsLoading(true));

    let result = [...subtopics];

    if (subtopicReqParams?.name) {
      const lowerSearch = subtopicReqParams.name.toLowerCase();
      result = result.filter(
        (subtopic) =>
          subtopic.name.toLowerCase().includes(lowerSearch) ||
          subtopic.description.toLowerCase().includes(lowerSearch)
      );
    }

    if (subtopicReqParams?.topic_id) {
      result = result.filter(
        (subtopic) => subtopic.topicId === subtopicReqParams.topic_id
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      const valA = a[filters.sortColumn as keyof SubTopicDetails];
      const valB = b[filters.sortColumn as keyof SubTopicDetails];

      if (filters.sortColumn === "topic") {
        const topicA = topics.find((t) => t.id === a.topicId)?.name || "";
        const topicB = topics.find((t) => t.id === b.topicId)?.name || "";
        comparison = topicA.localeCompare(topicB);
      } else if (typeof valA === "string" && typeof valB === "string") {
        comparison = valA.localeCompare(valB);
      } else if (typeof valA === "number" && typeof valB === "number") {
        comparison = valA - valB;
      } else if (filters.sortColumn === "createdAt") {
        comparison =
          new Date(a.createdAt || "").getTime() -
          new Date(b.createdAt || "").getTime();
      }
      return filters.sortDirection === "asc" ? comparison : -comparison;
    });

    dispatch(setFilteredSubTopics(result));
    dispatch(setSubTopicsIsLoading(false));
  }, [
    subtopics,
    subtopicReqParams?.name,
    subtopicReqParams?.topic_id,
    filters.sortColumn,
    filters.sortDirection,
    topics,
    dispatch,
  ]);

  // Fetch topics once when auth token is available (for dropdown)
  useEffect(() => {
    if (!authContext?.token || topics.length > 0) return;

    const fetchTopics = async () => {
      try {
        console.log("🔄 TOPICS: Fetching all topics for dropdown...");
        const topicsResults = await handleFetchTopics(
          authContext.token,
          1, // page 1
          1000 // large page size to get all topics
        );

        if (topicsResults.data && topicsResults.data.length > 0) {
          console.log("✅ TOPICS: Fetched topics:", topicsResults.data.length);
          dispatch(setTopics(topicsResults.data));
        }
      } catch (error) {
        console.error("❌ TOPICS: Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, [authContext?.token, topics.length, dispatch]);

  // Fetch subtopics based on router params or normal fetch
  useEffect(() => {
    if (!authContext?.token || !router.isReady) return;

    const fetchSubtopics = async () => {
      try {
        // Get params from URL or use defaults
        const pageFromUrl = router.query.page
          ? parseInt(router.query.page as string, 10)
          : 1;
        const searchFromUrl = router.query.search as string;
        const topicFromUrl = router.query.topic as string;
        const sortColumnFromUrl = router.query.sortColumn as string;
        const sortDirectionFromUrl = router.query.sortDirection as
          | "asc"
          | "desc";

        // Set filters from URL
        if (sortColumnFromUrl) {
          dispatch(setSubTopicTableFilters({ sortColumn: sortColumnFromUrl }));
        }
        if (
          sortDirectionFromUrl &&
          ["asc", "desc"].includes(sortDirectionFromUrl)
        ) {
          dispatch(
            setSubTopicTableFilters({ sortDirection: sortDirectionFromUrl })
          );
        }

        // Set request params from URL
        const params = {
          page_number: !isNaN(pageFromUrl) ? pageFromUrl : 1,
          page_size: 10,
          name: searchFromUrl || undefined,
          topic_id: topicFromUrl || undefined,
        };

        console.log("🔄 SUBTOPICS: Fetching with params:", params);
        dispatch(setSubTopicsIsLoading(true));
        dispatch(setSubTopicReqParams(params));

        const subtopicsResults = await handleFetchSubTopics(
          authContext.token,
          params.page_number,
          params.page_size,
          params.topic_id,
          params.name
        );

        if ((subtopicsResults as { error: string })?.error) {
          console.log("❌ SUBTOPICS: Error response:", subtopicsResults.error);
          toast({
            title: (subtopicsResults as { error: string })?.error,
            style: { background: "red", color: "white" },
            duration: 3500,
          });
          dispatch(setSubTopics([]));
        } else {
          console.log(
            "✅ SUBTOPICS: Fetched subtopics:",
            subtopicsResults.data?.length || 0
          );
          dispatch(setSubTopics(subtopicsResults.data ?? []));
        }

        dispatch(setSubTopicAmount(subtopicsResults.amount ?? 0));
        dispatch(setSubTopicsIsLoading(false));
      } catch (error) {
        console.error("❌ SUBTOPICS: Error fetching subtopics:", error);
        dispatch(setSubTopicsIsLoading(false));
      }
    };

    fetchSubtopics();
  }, [
    authContext?.token,
    router.isReady,
    router.query,
    dispatch,
    refreshTrigger,
  ]);

  // Apply filters whenever dependencies change (only for sorting/filtering, not data fetching)
  useEffect(() => {
    if (subtopics.length > 0) {
      applyFilters();
    }
  }, [
    subtopics,
    subtopicReqParams?.name,
    subtopicReqParams?.topic_id,
    filters.sortColumn,
    filters.sortDirection,
    applyFilters,
  ]);

  const handleFormChange = (field: keyof SubtopicFormData, value: string) => {
    setCurrentSubtopic((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNew = () => {
    setCurrentSubtopic({
      name: "",
      description: "",
      topicId: (router.query.topic as string) || "",
    });
    setIsEditMode(false);
    setFormDrawerOpen(true);
  };

  const handleEdit = (id: string) => {
    const subtopicToEdit = subtopics.find((subtopic) => subtopic.id === id);
    if (subtopicToEdit) {
      const editData = {
        id: subtopicToEdit.id,
        name: subtopicToEdit.name,
        description: subtopicToEdit.description,
        topicId: subtopicToEdit.topicId,
        createdAt: subtopicToEdit.createdAt,
      };
      setCurrentSubtopic(editData);
      setIsEditMode(true);
      // Small delay to ensure dropdown closes before modal opens
      setTimeout(() => {
        setFormDrawerOpen(true);
      }, 100);
    }
  };

  const handleFormSubmit = async () => {
    if (!authContext?.token) {
      setIsSubmitting(false);
      return;
    }

    // Frontend validation
    if (!currentSubtopic.name.trim()) {
      toast({
        title: "Subtopic name is required",
        style: { background: "red", color: "white" },
        duration: 3500,
      });
      setIsSubmitting(false);
      return;
    }

    if (!currentSubtopic.description.trim()) {
      toast({
        title: "Subtopic description is required",
        style: { background: "red", color: "white" },
        duration: 3500,
      });
      setIsSubmitting(false);
      return;
    }

    if (!currentSubtopic.topicId) {
      toast({
        title: "Please select a topic",
        style: { background: "red", color: "white" },
        duration: 3500,
      });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && currentSubtopic.id) {
        // Update existing subtopic
        const response = await handleUpdateSubTopic(
          authContext.token,
          currentSubtopic as SubTopicDetails
        );
        // Show success message
        toast({
          title: "Subtopic updated successfully!",
          style: { background: "green", color: "white" },
          duration: 3500,
        });

        // Trigger refresh to fetch updated data
        dispatch(triggerSubTopicsRefresh());
        setFormDrawerOpen(false);
      } else {
        // Create new subtopic
        const response = await handleCreateSubTopic(
          authContext.token,
          currentSubtopic as SubTopicDetails
        );
        // Show success message
        toast({
          title: "Subtopic created successfully!",
          style: { background: "green", color: "white" },
          duration: 3500,
        });

        // Trigger refresh to fetch updated data
        dispatch(triggerSubTopicsRefresh());
        setFormDrawerOpen(false);
      }
    } catch (error) {
      console.error("Error submitting subtopic:", error);
      toast({
        title: "Error submitting subtopic",
        style: { background: "red", color: "white" },
        duration: 3500,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = useCallback(
    (id: string) => {
      dispatch(
        setSubTopicTableDeleteData({
          subtopicId: id,
          showDeleteDialog: true,
          isDeleting: false,
        })
      );
    },
    [dispatch]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteData.subtopicId) return;
    dispatch(
      setSubTopicTableDeleteData({
        subtopicId: deleteData.subtopicId,
        showDeleteDialog: true,
        isDeleting: true,
      })
    );

    const result = await handleDeleteSubTopic(
      authContext?.token,
      deleteData.subtopicId
    );

    if (!result.error) {
      // Show success message
      toast({
        title: "Subtopic deleted successfully!",
        style: { background: "green", color: "white" },
        duration: 3500,
      });

      // Trigger refresh to fetch updated data
      dispatch(triggerSubTopicsRefresh());
    }

    setTimeout(() => {
      dispatch(
        setSubTopicTableDeleteData({
          subtopicId: undefined,
          showDeleteDialog: false,
          isDeleting: false,
        })
      );
    }, 1000);
  }, [
    authContext?.token,
    deleteData.subtopicId,
    dispatch,
    subtopicReqParams?.page_number,
    subtopicReqParams?.page_size,
    subtopicReqParams?.topic_id,
    subtopicReqParams?.name,
  ]);

  const handleViewSubtopic = (id: string) => {
    router.push(`/admin/topics/subtopics/${id}`);
  };

  const handleSearch = (value: string) => {
    dispatch(setSubTopicReqParams({ name: value, page_number: 1 }));
  };

  const handleTopicFilterChange = (value: string) => {
    const topicId = value === "all" ? undefined : value;
    dispatch(setSubTopicReqParams({ topic_id: topicId, page_number: 1 }));
    const query = { ...router.query, topic: topicId || undefined, page: "1" };
    if (!topicId) delete query.topic;
    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  const handleSort = (column: string, direction: "asc" | "desc") => {
    dispatch(
      setSubTopicTableFilters({ sortColumn: column, sortDirection: direction })
    );
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          sortColumn: column,
          sortDirection: direction,
        },
      },
      undefined,
      { shallow: true }
    );
    setTimeout(() => {
      applyFilters();
    }, 100);
  };

  const handlePageChange = (page: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: page.toString() },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleRefresh = useCallback(async () => {
    if (!authContext?.token) return;

    try {
      console.log("🔄 REFRESH: Manual refresh triggered");
      dispatch(setSubTopicsIsLoading(true));

      // Fetch subtopics with current params
      const results = await handleFetchSubTopics(
        authContext.token,
        subtopicReqParams?.page_number,
        subtopicReqParams?.page_size,
        subtopicReqParams?.topic_id,
        subtopicReqParams?.name
      );

      if ((results as { error: string })?.error) {
        console.log("❌ REFRESH: Error response:", results.error);
        toast({
          title: (results as { error: string })?.error,
          style: { background: "red", color: "white" },
          duration: 3500,
        });
        dispatch(setSubTopics([]));
      } else {
        console.log(
          "✅ REFRESH: Refreshed subtopics:",
          results.data?.length || 0
        );
        dispatch(setSubTopics(results.data ?? []));
      }

      dispatch(setSubTopicAmount(results.amount ?? 0));
      dispatch(setSubTopicsIsLoading(false));
    } catch (error) {
      console.error("❌ REFRESH: Error refreshing subtopics:", error);
      dispatch(setSubTopicsIsLoading(false));
    }
  }, [
    authContext?.token,
    subtopicReqParams?.page_number,
    subtopicReqParams?.page_size,
    subtopicReqParams?.topic_id,
    subtopicReqParams?.name,
    dispatch,
  ]);

  return (
    <AdminLayout>
      <SubtopicManagement
        authToken={authContext?.token}
        formDrawerOpen={formDrawerOpen}
        setFormDrawerOpen={setFormDrawerOpen}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        currentSubtopic={currentSubtopic}
        setCurrentSubtopic={setCurrentSubtopic}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        onFormChange={handleFormChange}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onFormSubmit={handleFormSubmit}
        onDeleteClick={handleDeleteClick}
        onDeleteConfirm={handleDeleteConfirm}
        onViewSubtopic={handleViewSubtopic}
        onSearch={handleSearch}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onRefresh={handleRefresh}
        onTopicFilterChange={handleTopicFilterChange}
      />
    </AdminLayout>
  );
}
