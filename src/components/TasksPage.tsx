"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Task, TaskInput, TaskStatus } from "@/lib/types";
import { subscribeTasks, createTask, updateTask, deleteTask } from "@/lib/tasks";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { Dashboard } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, CheckSquare, ChevronDown, LogOut, User } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

type FilterStatus = TaskStatus | "all";

export function TasksPage() {
  const { user, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!user) return;
    setTasksLoading(true);
    const unsub = subscribeTasks(user.uid, filter, (t) => {
      setTasks(t);
      setTasksLoading(false);
    });
    return unsub;
  }, [user, filter]);

  const handleCreate = async (input: TaskInput) => {
    if (!user) return;
    await createTask(user.uid, input);
  };

  const handleEdit = async (input: TaskInput) => {
    if (!editTask) return;
    await updateTask(editTask.id, input);
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-[#222222] bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-indigo-400" />
            <span className="font-semibold text-white text-sm">Task Tracker</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-zinc-400 hover:text-white hover:bg-[#222222] transition-all duration-150 outline-none text-sm"
            >
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span className="hidden sm:inline text-xs">{user?.displayName?.split(" ")[0]}</span>
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#111111] border-[#222222] text-white">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-white">{user?.displayName}</p>
                <p className="text-xs text-zinc-500">{user?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-[#222222]" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-zinc-300 hover:bg-[#222222] focus:bg-[#222222]"
              >
                <LogOut className="h-4 w-4 mr-2 text-zinc-400" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Dashboard stats */}
        <Dashboard tasks={tasks} />

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Select value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
            <SelectTrigger className="w-40 bg-[#111111] border-[#222222] text-white focus:ring-indigo-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#111111] border-[#222222] text-white">
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-150"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Task
          </Button>
        </div>

        {/* Task list */}
        {tasksLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-[#111111] border border-[#222222] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <CheckSquare className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">
              {filter === "all"
                ? "No tasks yet. Create your first task to get started."
                : `No ${filter === "in-progress" ? "in-progress" : filter} tasks.`}
            </p>
            {filter === "all" && (
              <Button
                onClick={() => setCreateOpen(true)}
                variant="outline"
                className="mt-4 border-[#222222] text-zinc-300 hover:bg-[#222222]"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Create a task
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditTask}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create dialog */}
      <TaskForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        mode="create"
      />

      {/* Edit dialog */}
      {editTask && (
        <TaskForm
          open={!!editTask}
          onClose={() => setEditTask(null)}
          onSubmit={handleEdit}
          initialData={editTask}
          mode="edit"
        />
      )}
    </div>
  );
}
