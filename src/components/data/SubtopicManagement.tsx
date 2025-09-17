import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataManagementLayout } from "@/components/layout/DataManagementLayout";
import { DataFormDrawer } from "@/components/data/DataFormDrawer";
import { DeleteConfirmationDialog } from "@/components/data/DeleteConfirmationDialog";
import { SubtopicTable } from "@/components/data/SubtopicTable";
import { SubtopicForm, SubtopicFormData } from "@/components/data/SubtopicForm";
import { SubTopicDetails } from "@/models/subTopic/subTopicDetails";
import { TopicDetails } from "@/models/topics/topicDetails";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  getFilteredSubTopics,
  getSubTopicAmt,
  getSubTopicReqParams,
  getSubTopics,
  getSubTopicsIsLoading,
  getSubTopicTableDeleteData,
  getSubTopicTableFilters,
  setFilteredSubTopics,
  setSubTopicAmount,
  setSubTopicReqParams,
  setSubTopics,
  setSubTopicsIsLoading,
  setSubTopicTableDeleteData,
  setSubTopicTableFilters,
} from "@/store/subtopics.slice";
import { getTopics } from "@/store/topics.slice";

interface SubtopicManagementProps {
  authToken?: string;
  formDrawerOpen: boolean;
  setFormDrawerOpen: (open: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  currentSubtopic: SubtopicFormData;
  setCurrentSubtopic: (subtopic: SubtopicFormData) => void;
  isEditMode: boolean;
  setIsEditMode: (edit: boolean) => void;
  onFormChange: (field: keyof SubtopicFormData, value: string) => void;
  onAddNew: () => void;
  onEdit: (id: string) => void;
  onFormSubmit: () => void;
  onDeleteClick: (id: string) => void;
  onDeleteConfirm: () => void;
  onViewSubtopic: (id: string) => void;
  onSearch: (value: string) => void;
  onSort: (column: string, direction: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onTopicFilterChange: (value: string) => void;
}

export function SubtopicManagement({
  authToken,
  formDrawerOpen,
  setFormDrawerOpen,
  isSubmitting,
  setIsSubmitting,
  currentSubtopic,
  setCurrentSubtopic,
  isEditMode,
  setIsEditMode,
  onFormChange,
  onAddNew,
  onEdit,
  onFormSubmit,
  onDeleteClick,
  onDeleteConfirm,
  onViewSubtopic,
  onSearch,
  onSort,
  onPageChange,
  onRefresh,
  onTopicFilterChange,
}: SubtopicManagementProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const subtopicReqParams = useAppSelector(getSubTopicReqParams);
  const totalSubTopicAmt = useAppSelector(getSubTopicAmt);
  const filters = useAppSelector(getSubTopicTableFilters);
  const deleteData = useAppSelector(getSubTopicTableDeleteData);
  const isLoading = useAppSelector(getSubTopicsIsLoading);
  const subtopics = useAppSelector(getSubTopics);
  const filteredSubtopics = useAppSelector(getFilteredSubTopics);
  const topics = useAppSelector(getTopics);

  const getPaginatedData = useMemo(() => {
    return filteredSubtopics.length > 0 ? filteredSubtopics : subtopics;
  }, [filteredSubtopics, subtopics]);

  const sortOptions = useMemo(
    () => [
      { label: "Name (A-Z)", value: "name_asc" },
      { label: "Name (Z-A)", value: "name_desc" },
      { label: "Topic (A-Z)", value: "topic_asc" },
      { label: "Topic (Z-A)", value: "topic_desc" },
      { label: "ID (Ascending)", value: "id_asc" },
      { label: "ID (Descending)", value: "id_desc" },
      { label: "Newest First", value: "createdAt_desc" },
      { label: "Oldest First", value: "createdAt_asc" },
    ],
    []
  );

  const filterOptions = useMemo(
    () => [
      {
        id: "topic",
        label: "Topic",
        type: "select" as const,
        value: subtopicReqParams?.topic_id ? subtopicReqParams.topic_id : "all",
        onChange: onTopicFilterChange,
        placeholder: "Select topic",
        options: [
          { label: "All Topics", value: "all" },
          ...topics.map((topic: TopicDetails) => ({
            label: topic.name,
            value: topic.id,
          })),
        ],
      },
    ],
    [subtopicReqParams?.topic_id, onTopicFilterChange, topics]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      const [column, direction] = value.split("_");
      onSort(column, direction as "asc" | "desc");
    },
    [onSort]
  );

  const getCurrentSortValue = () =>
    `${filters.sortColumn}_${filters.sortDirection}`;

  return (
    <>
      <DataManagementLayout
        title="Subtopics"
        description="Manage all subtopics in the system"
        onAddNew={onAddNew}
        addNewLabel="Add Subtopic"
        searchPlaceholder="Search subtopics..."
        onSearch={onSearch}
        sortOptions={sortOptions}
        onSortChange={handleSortChange}
        filterControls={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filterOptions.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <Label htmlFor={filter.id} className="text-sm font-medium">
                  {filter.label}
                </Label>
                <Select value={filter.value} onValueChange={filter.onChange}>
                  <SelectTrigger id={filter.id}>
                    <SelectValue placeholder={filter.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        }
        isLoading={isLoading}
        onRefresh={onRefresh}
        className="px-2 sm:px-4"
        defaultSort={getCurrentSortValue()}
        defaultShowFilters={!!subtopicReqParams?.topic_id}
      >
        <SubtopicTable
          data={getPaginatedData}
          formDrawerOpen={formDrawerOpen}
          topics={topics}
          sortColumn={filters.sortColumn}
          sortDirection={filters.sortDirection}
          currentPage={subtopicReqParams?.page_number || 1}
          totalPages={Math.max(
            1,
            Math.ceil(totalSubTopicAmt / (subtopicReqParams?.page_size || 10))
          )}
          onSort={onSort}
          onPageChange={onPageChange}
          onView={onViewSubtopic}
          onEdit={onEdit}
          onDelete={onDeleteClick}
          onAddNew={onAddNew}
        />
      </DataManagementLayout>

      <DataFormDrawer
        title={isEditMode ? "Edit Subtopic" : "Add New Subtopic"}
        description={
          isEditMode ? "Update subtopic details" : "Create a new subtopic"
        }
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
        submitLabel={isEditMode ? "Save Changes" : "Create Subtopic"}
        size="md"
      >
        <SubtopicForm
          currentSubtopic={currentSubtopic}
          isEditMode={isEditMode}
          topics={topics}
          onFormChange={onFormChange}
        />
      </DataFormDrawer>

      <DeleteConfirmationDialog
        open={deleteData.showDeleteDialog}
        onOpenChange={(open) => {
          if (!open) {
            dispatch(
              setSubTopicTableDeleteData({
                subtopicId: undefined,
                showDeleteDialog: false,
                isDeleting: false,
              })
            );
          }
        }}
        onConfirm={onDeleteConfirm}
        isDeleting={deleteData.isDeleting}
        title="Delete Subtopic"
        description="Are you sure you want to delete this subtopic? This action cannot be undone."
      />
    </>
  );
}
