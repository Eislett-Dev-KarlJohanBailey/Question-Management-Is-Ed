import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopicDetails } from "@/models/topics/topicDetails";

// Subtopic form type
export interface SubtopicFormData {
  id?: string;
  name: string;
  description: string;
  topicId: string;
  createdAt?: string;
}

interface SubtopicFormProps {
  currentSubtopic: SubtopicFormData;
  isEditMode: boolean;
  topics: TopicDetails[];
  onFormChange: (field: keyof SubtopicFormData, value: string) => void;
}

export function SubtopicForm({
  currentSubtopic,
  isEditMode,
  topics,
  onFormChange,
}: SubtopicFormProps) {
  return (
    <div className="space-y-6">
      {isEditMode && currentSubtopic.id && (
        <div className="space-y-2">
          <Label htmlFor="id">ID</Label>
          <Input
            id="id"
            value={currentSubtopic.id}
            readOnly
            disabled
            className="bg-muted"
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Subtopic Name</Label>
        <Input
          id="name"
          value={currentSubtopic.name}
          onChange={(e) => onFormChange("name", e.target.value)}
          placeholder="Enter subtopic name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <Select
          value={currentSubtopic.topicId}
          onValueChange={(value) => onFormChange("topicId", value)}
        >
          <SelectTrigger id="topic">
            <SelectValue placeholder="Select topic" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {topics.length === 0 ? (
              <div className="px-2 py-1 text-sm text-muted-foreground">
                No topics available
              </div>
            ) : (
              topics.map((topic: TopicDetails) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={currentSubtopic.description}
          onChange={(e) => onFormChange("description", e.target.value)}
          placeholder="Enter subtopic description"
          rows={4}
        />
      </div>
      {isEditMode && currentSubtopic.createdAt && (
        <div className="space-y-2">
          <Label htmlFor="createdAt">Created At</Label>
          <Input
            id="createdAt"
            value={new Date(currentSubtopic.createdAt).toLocaleDateString()}
            readOnly
            disabled
            className="bg-muted"
          />
        </div>
      )}
    </div>
  );
}
