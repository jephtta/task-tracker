import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { parseISO, isPast, isToday } from "date-fns"
import type { Task } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isOverdue(task: Task): boolean {
  if (task.status === "done") return false;
  const parsed = parseISO(task.dueDate);
  return isPast(parsed) && !isToday(parsed);
}
