import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Topic form type
export interface TopicFormData {
  id?: string;
  name: string;
  description: string;
  createdAt?: string;
}

interface TopicFormProps {
  currentTopic: TopicFormData;
  isEditMode: boolean;
  onFormChange: (field: keyof TopicFormData, value: string) => void;
}

export function TopicForm({
  currentTopic,
  isEditMode,
  onFormChange,
}: TopicFormProps) {
  return (
    <div className="space-y-6">
      {isEditMode && currentTopic.id && (
        <div className="space-y-2">
          <Label htmlFor="id">ID</Label>
          <Input
            id="id"
            value={currentTopic.id}
            readOnly
            disabled
            className="bg-muted"
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Topic Name</Label>
        <Input
          id="name"
          value={currentTopic.name}
          onChange={(e) => onFormChange("name", e.target.value)}
          placeholder="Enter topic name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={currentTopic.description}
          onChange={(e) => onFormChange("description", e.target.value)}
          placeholder="Enter topic description"
          rows={4}
        />
      </div>
      {isEditMode && currentTopic.createdAt && (
        <div className="space-y-2">
          <Label htmlFor="createdAt">Created At</Label>
          <Input
            id="createdAt"
            value={new Date(currentTopic.createdAt).toLocaleDateString()}
            readOnly
            disabled
            className="bg-muted"
          />
        </div>
      )}
    </div>
  );
}
