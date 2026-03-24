import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { Task, TaskInput, TaskStatus } from "./types";

const COLLECTION = "tasks";

export function subscribeTasks(
  userId: string,
  statusFilter: TaskStatus | "all",
  callback: (tasks: Task[]) => void
): Unsubscribe {
  const tasksRef = collection(db, COLLECTION);

  let q;
  if (statusFilter !== "all") {
    q = query(
      tasksRef,
      where("userId", "==", userId),
      where("status", "==", statusFilter),
      orderBy("dueDate", "asc")
    );
  } else {
    q = query(
      tasksRef,
      where("userId", "==", userId),
      orderBy("dueDate", "asc")
    );
  }

  return onSnapshot(q, (snapshot) => {
    const tasks: Task[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Task, "id">),
    }));
    callback(tasks);
  });
}

export async function createTask(userId: string, input: TaskInput): Promise<string> {
  const now = Date.now();
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    userId,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateTask(taskId: string, updates: Partial<TaskInput>): Promise<void> {
  const taskRef = doc(db, COLLECTION, taskId);
  await updateDoc(taskRef, { ...updates, updatedAt: Date.now() });
}

export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, taskId));
}
