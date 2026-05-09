'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import EtProgressDashboard from '@/components/EtProgressDashboard';
import EtWorkloadPanel from '@/components/EtWorkloadPanel';
import CalendarGrid from '@/components/CalendarGrid';
import TaskSidebar from '@/components/TaskSidebar';
import AddTaskDialog from '@/components/AddTaskDialog';
import EditTaskDialog from '@/components/EditTaskDialog';
import DeadlineNotifier from '@/components/DeadlineNotifier';
import { Task } from '@/lib/types';

export default function Home() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* ── Top chrome ───────────────────────────────────────────────── */}
      <Header />
      <EtProgressDashboard />
      <EtWorkloadPanel />

      {/* ── Main split view ──────────────────────────────────────────── */}
      <main className="flex flex-1 overflow-hidden">
        {/* Calendar pane */}
        <section className="flex-1 overflow-y-auto p-5">
          <CalendarGrid onEditTask={setEditingTask} />
        </section>

        {/* Sidebar pane */}
        <aside className="w-80 shrink-0 border-l border-slate-200 bg-white overflow-y-auto">
          <TaskSidebar />
        </aside>
      </main>

      {/* ── Dialogs & FAB ────────────────────────────────────────────── */}
      <AddTaskDialog />
      <EditTaskDialog task={editingTask} onClose={() => setEditingTask(null)} />
      <DeadlineNotifier />
    </div>
  );
}
