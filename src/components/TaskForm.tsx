"use client";

import { useState } from "react";
import { Task, TaskInput, TaskStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskInput) => Promise<void>;
  initialData?: Task;
  mode: "create" | "edit";
}

export function TaskForm({ open, onClose, onSubmit, initialData, mode }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate ?? "");
  const [status, setStatus] = useState<TaskStatus>(initialData?.status ?? "todo");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!dueDate) {
      toast.error("Due date is required");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), dueDate, status });
      toast.success(mode === "create" ? "Task created" : "Task updated");
      onClose();
    } catch {
      toast.error("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  // Reset form when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[#111111] border-[#222222] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">
            {mode === "create" ? "New Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-zinc-300">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="bg-[#0a0a0a] border-[#222222] text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-zinc-300">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="bg-[#0a0a0a] border-[#222222] text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 resize-none"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-zinc-300">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-[#0a0a0a] border-[#222222] text-white focus-visible:ring-indigo-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-zinc-300">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger
                  id="status"
                  className="bg-[#0a0a0a] border-[#222222] text-white focus:ring-indigo-500"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] border-[#222222] text-white">
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#222222] text-zinc-300 hover:bg-[#222222]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-150"
            >
              {loading ? "Saving…" : mode === "create" ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
