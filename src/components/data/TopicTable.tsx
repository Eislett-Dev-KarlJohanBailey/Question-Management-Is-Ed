import { useMemo } from "react";
import { DataTable } from "@/components/data/DataTable";
import { TopicActions } from "@/components/data/TopicActions";
import { TopicDetails } from "@/models/topics/topicDetails";

interface TopicTableProps {
  data: TopicDetails[];
  formDrawerOpen: boolean;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  currentPage?: number;
  totalPages: number;
  onSort: (column: string, direction: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onManageSubtopics: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function TopicTable({
  data,
  formDrawerOpen,
  sortColumn,
  sortDirection,
  currentPage,
  totalPages,
  onSort,
  onPageChange,
  onView,
  onEdit,
  onManageSubtopics,
  onDelete,
  onAddNew,
}: TopicTableProps) {
  const columns = useMemo(
    () => [
      {
        id: "id",
        header: "ID",
        cell: (topic: TopicDetails) => (
          <span className="text-muted-foreground text-sm">{topic.id}</span>
        ),
        sortable: true,
      },
      {
        id: "name",
        header: "Topic Name",
        cell: (topic: TopicDetails) => (
          <span className="font-medium">{topic.name}</span>
        ),
        sortable: true,
      },
      {
        id: "description",
        header: "Description",
        cell: (topic: TopicDetails) => (
          <span className="truncate block max-w-[300px]">
            {topic.description}
          </span>
        ),
        sortable: false,
      },
      {
        id: "createdAt",
        header: "Created At",
        cell: (topic: TopicDetails) =>
          topic.createdAt
            ? new Date(topic.createdAt).toLocaleDateString()
            : "-",
        sortable: true,
      },
      {
        id: "actions",
        header: "",
        cell: (topic: TopicDetails) => (
          <TopicActions
            topic={topic}
            formDrawerOpen={formDrawerOpen}
            onView={onView}
            onEdit={onEdit}
            onManageSubtopics={onManageSubtopics}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [formDrawerOpen, onView, onEdit, onManageSubtopics, onDelete]
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      keyExtractor={(item) => `${item.id}`}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
      pagination={{
        currentPage,
        totalPages,
        onPageChange,
      }}
      emptyState={
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4">No topics found</p>
          <button onClick={onAddNew}>Add your first topic</button>
        </div>
      }
    />
  );
}
