'use client';

import { motion } from 'framer-motion';
import { BarChart3, Download } from 'lucide-react';
import { useAppContext } from '@/lib/store';
import { exportTasksToCSV } from '@/lib/exportCSV';

export default function EtProgressDashboard() {
  const { state, getMyETs } = useAppContext();
  const { tasks } = state;

  // Only show progress for ETs the current user is assigned to
  const myETs = getMyETs();

  const etProgress = myETs.map((et) => {
    const etTasks = tasks.filter((t) => t.etId === et.id);
    const done = etTasks.filter((t) => t.status === 'Done').length;
    const inProgress = etTasks.filter((t) => t.status === 'In Progress').length;
    const reviewClear = etTasks.filter((t) => t.status === 'Review Clear 필요').length;
    const total = etTasks.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { et, done, inProgress, reviewClear, todo: total - done - inProgress - reviewClear, total, pct };
  });

  return (
    <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-3">
      <div className="flex items-center gap-5">
        {/* Section label */}
        <div className="flex items-center gap-1.5 shrink-0">
          <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            진행 현황
          </span>
        </div>

        {/* Progress cards */}
        <div className="flex-1 grid grid-cols-5 gap-4">
          {etProgress.map(({ et, done, inProgress, reviewClear, todo, total, pct }, i) => (
            <div key={et.id} className="flex flex-col gap-1">
              {/* ET name + pct */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1 min-w-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: et.color }}
                  />
                  <span className="text-[10px] font-semibold text-slate-700 truncate">
                    {et.name}
                  </span>
                </div>
                <span
                  className="text-[11px] font-black shrink-0"
                  style={{ color: et.color }}
                >
                  {pct}%
                </span>
              </div>

              {/* Progress bar track */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: et.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.08 }}
                />
              </div>

              {/* Status pill counts */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full">
                  ✓ {done}
                </span>
                <span className="text-[9px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded-full">
                  ⏱ {inProgress}
                </span>
                {reviewClear > 0 && (
                  <span className="text-[9px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-full">
                    ⚠ {reviewClear}
                  </span>
                )}
                <span className="text-[9px] text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded-full">
                  ○ {todo}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Export button */}
        <button
          onClick={() => exportTasksToCSV(tasks, state.ets)}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50 text-[11px] font-semibold transition-all shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          CSV 내보내기
        </button>
      </div>
    </div>
  );
}
