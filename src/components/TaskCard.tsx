"use client";

import { Task, TaskStatus } from "@/lib/types";
import { isOverdue } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Calendar, AlertCircle } from "lucide-react";
import { format, parseISO } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: "To Do", className: "bg-zinc-800 text-zinc-300 border-zinc-700" },
  "in-progress": { label: "In Progress", className: "bg-indigo-900/40 text-indigo-300 border-indigo-700" },
  done: { label: "Done", className: "bg-emerald-900/40 text-emerald-300 border-emerald-700" },
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task);
  const statusConfig = STATUS_CONFIG[task.status];

  return (
    <div
      className={`bg-[#111111] border rounded-lg p-4 transition-all duration-150 hover:border-zinc-600 ${
        overdue ? "border-red-800/60" : "border-[#222222]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-medium text-sm leading-snug ${
                task.status === "done" ? "line-through text-zinc-500" : "text-white"
              }`}
            >
              {task.title}
            </h3>
            {overdue && (
              <span className="flex items-center gap-1 text-xs text-red-400">
                <AlertCircle className="h-3 w-3" />
                Overdue
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <Badge variant="outline" className={`text-xs ${statusConfig.className}`}>
              {statusConfig.label}
            </Badge>
            <span
              className={`flex items-center gap-1 text-xs ${
                overdue ? "text-red-400" : "text-zinc-500"
              }`}
            >
              <Calendar className="h-3 w-3" />
              {format(parseISO(task.dueDate), "MMM d, yyyy")}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-white hover:bg-[#222222] flex-shrink-0 transition-all duration-150 outline-none"
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#111111] border-[#222222] text-white"
          >
            <DropdownMenuItem
              onClick={() => onEdit(task)}
              className="cursor-pointer hover:bg-[#222222] focus:bg-[#222222]"
            >
              <Pencil className="h-4 w-4 mr-2 text-zinc-400" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(task.id)}
              className="cursor-pointer text-red-400 hover:bg-[#222222] focus:bg-[#222222] hover:text-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
