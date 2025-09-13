import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data/DataTable";
import { SubtopicActions } from "@/components/data/SubtopicActions";
import { SubTopicDetails } from "@/models/subTopic/subTopicDetails";
import { TopicDetails } from "@/models/topics/topicDetails";

interface SubtopicTableProps {
  data: SubTopicDetails[];
  formDrawerOpen: boolean;
  topics: TopicDetails[];
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  currentPage?: number;
  totalPages: number;
  onSort: (column: string, direction: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function SubtopicTable({
  data,
  formDrawerOpen,
  topics,
  sortColumn,
  sortDirection,
  currentPage,
  totalPages,
  onSort,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onAddNew,
}: SubtopicTableProps) {
  const getTopicName = (topicId: string) => {
    return (
      topics.find((topic: TopicDetails) => topic.id === topicId)?.name ||
      "Unknown"
    );
  };

  const columns = useMemo(
    () => [
      {
        id: "id",
        header: "ID",
        cell: (subtopic: SubTopicDetails) => (
          <span className="text-muted-foreground text-sm">{subtopic.id}</span>
        ),
        sortable: true,
      },
      {
        id: "name",
        header: "Subtopic Name",
        cell: (subtopic: SubTopicDetails) => (
          <span className="font-medium">{subtopic.name}</span>
        ),
        sortable: true,
      },
      {
        id: "topic",
        header: "Topic",
        cell: (subtopic: SubTopicDetails) => (
          <span>{getTopicName(subtopic.topicId)}</span>
        ),
        sortable: true,
      },
      {
        id: "description",
        header: "Description",
        cell: (subtopic: SubTopicDetails) => (
          <span className="truncate block max-w-[300px]">
            {subtopic.description}
          </span>
        ),
        sortable: false,
      },
      {
        id: "createdAt",
        header: "Created At",
        cell: (subtopic: SubTopicDetails) =>
          subtopic.createdAt
            ? new Date(subtopic.createdAt).toLocaleDateString()
            : "N/A",
        sortable: true,
      },
      {
        id: "actions",
        header: "",
        cell: (subtopic: SubTopicDetails) => (
          <SubtopicActions
            subtopic={subtopic}
            formDrawerOpen={formDrawerOpen}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [formDrawerOpen, onView, onEdit, onDelete, topics]
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id || ""}
      onRowClick={(item) => onView(item.id || "")}
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
          <p className="text-muted-foreground mb-4">No subtopics found</p>
          <Button onClick={onAddNew}>Add your first subtopic</Button>
        </div>
      }
    />
  );
}
