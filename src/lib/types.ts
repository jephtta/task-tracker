export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string YYYY-MM-DD
  status: TaskStatus;
  createdAt: number; // unix timestamp ms
  updatedAt: number;
}

export type TaskInput = Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">;
