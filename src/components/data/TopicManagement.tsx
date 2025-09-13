import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import { DataManagementLayout } from "@/components/layout/DataManagementLayout";
import { DataFormDrawer } from "@/components/data/DataFormDrawer";
import { DeleteConfirmationDialog } from "@/components/data/DeleteConfirmationDialog";
import { TopicTable } from "@/components/data/TopicTable";
import { TopicForm, TopicFormData } from "@/components/data/TopicForm";
import { TopicDetails } from "@/models/topics/topicDetails";
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
import {
  handleFetchTopics,
  handleCreateTopic,
  handleUpdateTopic,
  handleDeleteTopic,
} from "@/services/topics/topicsRequest";

interface TopicManagementProps {
  authToken?: string;
  formDrawerOpen: boolean;
  setFormDrawerOpen: (open: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  currentTopic: TopicFormData;
  setCurrentTopic: (topic: TopicFormData) => void;
  isEditMode: boolean;
  setIsEditMode: (edit: boolean) => void;
  onFormChange: (field: keyof TopicFormData, value: string) => void;
  onAddNew: () => void;
  onEdit: (id: string) => void;
  onFormSubmit: () => void;
  onDeleteClick: (id: string) => void;
  onDeleteConfirm: () => void;
  onViewTopic: (id: string) => void;
  onManageSubtopics: (id: string) => void;
  onSearch: (value: string) => void;
  onSort: (column: string, direction: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export function TopicManagement({
  authToken,
  formDrawerOpen,
  setFormDrawerOpen,
  isSubmitting,
  setIsSubmitting,
  currentTopic,
  setCurrentTopic,
  isEditMode,
  setIsEditMode,
  onFormChange,
  onAddNew,
  onEdit,
  onFormSubmit,
  onDeleteClick,
  onDeleteConfirm,
  onViewTopic,
  onManageSubtopics,
  onSearch,
  onSort,
  onPageChange,
  onRefresh,
}: TopicManagementProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const topicReqParams = useAppSelector(getTopicReqParams);
  const totalTopicAmt = useAppSelector(getTopicAmt);
  const filters = useAppSelector(getTopicTableFilters);
  const deleteData = useAppSelector(getTopicTableDeleteData);
  const isLoading = useAppSelector(getTopicsIsLoading);
  const topics = useAppSelector(getTopics);
  const filteredTopics = useAppSelector(getFilteredTopics);

  const getPaginatedData = useMemo(() => {
    if (filteredTopics?.length > 0) return filteredTopics;
    return topics;
  }, [filteredTopics, topics]);

  const sortOptions = useMemo(
    () => [
      { label: "Name (A-Z)", value: "name_asc" },
      { label: "Name (Z-A)", value: "name_desc" },
      { label: "ID (Ascending)", value: "id_asc" },
      { label: "ID (Descending)", value: "id_desc" },
      { label: "Newest First", value: "createdAt_desc" },
      { label: "Oldest First", value: "createdAt_asc" },
    ],
    []
  );

  const handleSortChange = useCallback(
    (value: string) => {
      const [column, direction] = value.split("_");
      onSort(column, direction as "asc" | "desc");
    },
    [onSort]
  );

  return (
    <>
      <DataManagementLayout
        title="Topics"
        description="Manage all topics in the system"
        onAddNew={onAddNew}
        addNewLabel="Add Topic"
        searchPlaceholder="Search topics..."
        onSearch={onSearch}
        sortOptions={sortOptions}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        onRefresh={onRefresh}
        className="px-2 sm:px-4"
        defaultSort={`${filters.sortColumn}_${filters.sortDirection}`}
        defaultShowFilters={false}
        secondaryActions={
          <Button
            variant="outline"
            onClick={() => router.push("/admin/topics/subtopics")}
            className="ml-2"
          >
            <List className="mr-2 h-4 w-4" />
            All Subtopics
          </Button>
        }
      >
        <TopicTable
          data={getPaginatedData}
          formDrawerOpen={formDrawerOpen}
          sortColumn={filters.sortColumn}
          sortDirection={filters.sortDirection}
          currentPage={topicReqParams?.page_number}
          totalPages={Math.max(
            1,
            Math.ceil(totalTopicAmt / topicReqParams.page_size)
          )}
          onSort={onSort}
          onPageChange={onPageChange}
          onView={onViewTopic}
          onEdit={onEdit}
          onManageSubtopics={onManageSubtopics}
          onDelete={onDeleteClick}
          onAddNew={onAddNew}
        />
      </DataManagementLayout>

      <DataFormDrawer
        title={isEditMode ? "Edit Topic" : "Add New Topic"}
        description={isEditMode ? "Update topic details" : "Create a new topic"}
        open={formDrawerOpen}
        onOpenChange={(open) => {
          setFormDrawerOpen(open);
          // Restore focus after modal closes
          if (!open) {
            setTimeout(() => {
              const activeElement = document.activeElement as HTMLElement;
              if (activeElement && activeElement.blur) {
                activeElement.blur();
              }
            }, 150);
          }
        }}
        onSubmit={onFormSubmit}
        isSubmitting={isSubmitting}
        submitLabel={isEditMode ? "Save Changes" : "Create Topic"}
        size="md"
      >
        <TopicForm
          currentTopic={currentTopic}
          isEditMode={isEditMode}
          onFormChange={onFormChange}
        />
      </DataFormDrawer>

      <DeleteConfirmationDialog
        open={deleteData.showDeleteDialog}
        onOpenChange={(show) =>
          dispatch(
            setTopicTableDeleteData({
              topicId: deleteData?.topicId,
              showDeleteDialog: show,
              isDeleting: deleteData.isDeleting,
            })
          )
        }
        onConfirm={onDeleteConfirm}
        isDeleting={deleteData.isDeleting}
        title="Delete Topic"
        description="Are you sure you want to delete this topic? This action cannot be undone and will remove all associated content."
      />
    </>
  );
}
