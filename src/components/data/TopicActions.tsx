import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Trash, List } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TopicDetails } from "@/models/topics/topicDetails";

interface TopicActionsProps {
  topic: TopicDetails;
  formDrawerOpen: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onManageSubtopics: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TopicActions({
  topic,
  formDrawerOpen,
  onView,
  onEdit,
  onManageSubtopics,
  onDelete,
}: TopicActionsProps) {
  return (
    <div className="flex justify-end">
      <DropdownMenu key={`${topic.id}-${formDrawerOpen}`}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onView(topic.id);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEdit(topic.id);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onManageSubtopics(topic.id);
            }}
          >
            <List className="mr-2 h-4 w-4" />
            Manage Subtopics
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDelete(topic.id);
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
