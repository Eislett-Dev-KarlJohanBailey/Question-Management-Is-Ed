import { useEffect, useState, useCallback, useContext } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { TopicManagement } from "@/components/data/TopicManagement";
import { TopicFormData } from "@/components/data/TopicForm";
import { useRouter } from "next/router";
import { TopicDetails } from "@/models/topics/topicDetails";
import {
  handleFetchTopics,
  handleCreateTopic,
  handleUpdateTopic,
  handleDeleteTopic,
} from "@/services/topics/topicsRequest";
import { useAuth } from "@/contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  getFilteredTopics,
  getTopicAmt,
  getTopicReqParams,
  getTopics,
  getTopicsIsLoading,
  getTopicTableDeleteData,
  getTopicTableFilters,
  setFilteredTopics,
  setTopicAmount,
  setTopicReqParams,
  setTopics,
  setTopicsIsLoading,
  setTopicTableDeleteData,
  setTopicTableFilters,
} from "@/store/topics.slice";
import { DEFAULT_PAGE_NUMBER } from "@/constants/tablePageSizes";
import { toast } from "@/hooks/use-toast";
import { removeNulls } from "@/services/utils";

export default function TopicsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authContext = useContext(useAuth());

  const topicReqParams = useAppSelector(getTopicReqParams);
  const totalTopicAmt = useAppSelector(getTopicAmt);
  const filters = useAppSelector(getTopicTableFilters);
  const deleteData = useAppSelector(getTopicTableDeleteData);
  const isLoading = useAppSelector(getTopicsIsLoading);

  const topics = useAppSelector(getTopics);
  const filteredTopics = useAppSelector(getFilteredTopics);

  // Form drawer state
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<TopicFormData>({
    name: "",
    description: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Apply all filters, sorting, and pagination
  const applyFilters = useCallback(() => {
    console.log("Applying filters", filters);
    dispatch(setTopicsIsLoading(true));

    let result = [...topics];

    result.sort((a, b) => {
      let comparison = 0;
      const valA = a[filters.sortColumn as keyof TopicDetails];
      const valB = b[filters.sortColumn as keyof TopicDetails];

      if (typeof valA === "string" && typeof valB === "string") {
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

    console.log("Filtered Data", result);
    dispatch(setFilteredTopics(result));
    setTimeout(() => {
      dispatch(setTopicsIsLoading(false));
    }, 1000);
  }, [dispatch, filters, topics]);

  // Initialize state from URL on first load
  useEffect(() => {
    if (!router.isReady) return;

    const pageFromUrl = router.query.page
      ? parseInt(router.query.page as string, 10)
      : DEFAULT_PAGE_NUMBER;
    if (!isNaN(pageFromUrl))
      dispatch(setTopicReqParams({ page_number: pageFromUrl }));

    const searchFromUrl = router.query.search as string;

    const reqParams = {
      title:
        searchFromUrl && searchFromUrl?.length > 0 ? searchFromUrl : undefined,
      page_number: !isNaN(pageFromUrl) ? pageFromUrl : undefined,
    };
    removeNulls(reqParams);
    dispatch(setTopicReqParams(reqParams));

    const sortColumnFromUrl = router.query.sortColumn as string;
    const sortDirectionFromUrl = router.query.sortDirection as "asc" | "desc";

    const filterParams = {
      sortColumn: sortColumnFromUrl,
      sortDirection:
        sortDirectionFromUrl && ["asc", "desc"].includes(sortDirectionFromUrl)
          ? sortDirectionFromUrl
          : undefined,
    };
    dispatch(setTopicTableFilters(filterParams));
  }, [router.isReady, router.query, dispatch]);

  //GET LIST OF TOPICS
  useEffect(() => {
    console.log("Fetching topics");
    async function getTopics() {
      dispatch(setTopicsIsLoading(true));
      try {
        const results = await handleFetchTopics(
          authContext?.token,
          topicReqParams?.page_number,
          topicReqParams?.page_size
        );

        if ((results as { error: string })?.error) {
          toast({
            title: (results as { error: string })?.error,
            style: { background: "red", color: "white" },
            duration: 3500,
          });

          dispatch(setTopics([]));
        } else {
          dispatch(setTopics(results.data ?? []));
        }

        dispatch(setTopicAmount(results.amount ?? 0));
        dispatch(setTopicsIsLoading(false));
      } catch (error) {
        toast({
          title: "Error fetching topics",
          style: { background: "red", color: "white" },
          duration: 3500,
        });
      } finally {
        dispatch(setTopicsIsLoading(false));
      }
    }

    getTopics();
  }, [
    topicReqParams?.page_number,
    topicReqParams?.page_size,
    topicReqParams?.title,
    dispatch,
    authContext?.token,
  ]);

  const handleFormChange = (field: keyof TopicFormData, value: string) => {
    setCurrentTopic((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNew = () => {
    setCurrentTopic({
      name: "",
      description: "",
    });
    setIsEditMode(false);
    setFormDrawerOpen(true);
  };

  const handleEdit = (id: string) => {
    const topicToEdit = topics.find((topic) => topic.id === id);
    if (topicToEdit) {
      setCurrentTopic(topicToEdit);
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
    if (!currentTopic.name.trim()) {
      toast({
        title: "Topic name is required",
        style: { background: "red", color: "white" },
        duration: 3500,
      });
      setIsSubmitting(false);
      return;
    }

    if (!currentTopic.description.trim()) {
      toast({
        title: "Topic description is required",
        style: { background: "red", color: "white" },
        duration: 3500,
      });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && currentTopic.id) {
        // Update existing topic
        const response = await handleUpdateTopic(
          authContext.token,
          currentTopic as TopicDetails
        );
        // Show success message
        toast({
          title: "Topic updated successfully!",
          style: { background: "green", color: "white" },
          duration: 3500,
        });

        // Refresh the topics list
        const results = await handleFetchTopics(
          authContext.token,
          topicReqParams?.page_number,
          topicReqParams?.page_size
        );
        if (results.data) {
          dispatch(setTopics(results.data));
        }
        setFormDrawerOpen(false);
      } else {
        // Create new topic
        const response = await handleCreateTopic(
          authContext.token,
          currentTopic as TopicDetails
        );
        // Show success message
        toast({
          title: "Topic created successfully!",
          style: { background: "green", color: "white" },
          duration: 3500,
        });

        // Refresh the topics list
        const results = await handleFetchTopics(
          authContext.token,
          topicReqParams?.page_number,
          topicReqParams?.page_size
        );
        if (results.data) {
          dispatch(setTopics(results.data));
        }
        setFormDrawerOpen(false);
      }
    } catch (error) {
      console.error("Error submitting topic:", error);
      toast({
        title: "Error submitting topic",
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
        setTopicTableDeleteData({
          topicId: id,
          showDeleteDialog: true,
          isDeleting: false,
        })
      );
    },
    [dispatch]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteData.topicId) return;
    dispatch(
      setTopicTableDeleteData({
        topicId: deleteData.topicId,
        showDeleteDialog: true,
        isDeleting: true,
      })
    );

    const result = await handleDeleteTopic(
      authContext?.token,
      deleteData.topicId
    );

    if (!result.error) {
      // Show success message
      toast({
        title: "Topic deleted successfully!",
        style: { background: "green", color: "white" },
        duration: 3500,
      });

      // Refresh the topics list
      const results = await handleFetchTopics(
        authContext?.token,
        topicReqParams?.page_number,
        topicReqParams?.page_size
      );
      if (results.data) {
        dispatch(setTopics(results.data));
      }
    }

    setTimeout(() => {
      dispatch(
        setTopicTableDeleteData({
          topicId: undefined,
          showDeleteDialog: false,
          isDeleting: false,
        })
      );
    }, 1000);
  }, [
    authContext?.token,
    deleteData.topicId,
    dispatch,
    topicReqParams?.page_number,
    topicReqParams?.page_size,
  ]);

  const handleViewTopic = (id: string) => {
    router.push(`/admin/topics/${id}`);
  };

  const handleManageSubtopics = (id: string) => {
    router.push(`/admin/topics/subtopics?topic=${id}`);
  };

  const handleSearch = useCallback(
    (value: string) => {
      dispatch(setTopicReqParams({ title: value, page_number: 1 }));
    },
    [dispatch]
  );

  const handleSort = useCallback(
    (column: string, direction: "asc" | "desc") => {
      dispatch(
        setTopicTableFilters({
          sortColumn: column,
          sortDirection: direction,
        })
      );

      setTimeout(applyFilters, 800);
    },
    [dispatch, applyFilters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setTopicReqParams({ page_number: page }));
    },
    [dispatch]
  );

  const handleRefresh = useCallback(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <AdminLayout>
      <TopicManagement
        authToken={authContext?.token}
        formDrawerOpen={formDrawerOpen}
        setFormDrawerOpen={setFormDrawerOpen}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        currentTopic={currentTopic}
        setCurrentTopic={setCurrentTopic}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        onFormChange={handleFormChange}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onFormSubmit={handleFormSubmit}
        onDeleteClick={handleDeleteClick}
        onDeleteConfirm={handleDeleteConfirm}
        onViewTopic={handleViewTopic}
        onManageSubtopics={handleManageSubtopics}
        onSearch={handleSearch}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onRefresh={handleRefresh}
      />
    </AdminLayout>
  );
}
