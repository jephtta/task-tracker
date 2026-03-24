"use client";

import { Task, TaskStatus } from "@/lib/types";
import { isOverdue } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";

const STATUS_ICONS: Record<TaskStatus, React.ReactNode> = {
  todo: <Circle className="h-5 w-5 text-zinc-400" />,
  "in-progress": <Clock className="h-5 w-5 text-indigo-400" />,
  done: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export function Dashboard({ tasks }: DashboardProps) {
  const counts: Record<TaskStatus, number> = {
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };
  const overdueCount = tasks.filter(isOverdue).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {(["todo", "in-progress", "done"] as TaskStatus[]).map((status) => (
        <div
          key={status}
          className="bg-[#111111] border border-[#222222] rounded-lg p-4 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            {STATUS_ICONS[status]}
            <span className="text-2xl font-bold text-white">{counts[status]}</span>
          </div>
          <p className="text-xs text-zinc-500">{STATUS_LABELS[status]}</p>
        </div>
      ))}
      <div className="bg-[#111111] border border-red-800/40 rounded-lg p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <span className={`text-2xl font-bold ${overdueCount > 0 ? "text-red-400" : "text-white"}`}>
            {overdueCount}
          </span>
        </div>
        <p className="text-xs text-zinc-500">Overdue</p>
      </div>
    </div>
  );
}
