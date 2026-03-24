"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LoginPage } from "@/components/LoginPage";
import { TasksPage } from "@/components/TasksPage";
import { CheckSquare } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <CheckSquare className="h-8 w-8 text-indigo-400 animate-pulse" />
          <p className="text-zinc-500 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <TasksPage />;
}
