'use client';

import { parseISO, differenceInCalendarDays, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CircleDashed,
  Timer,
  CheckCircle2,
  CalendarClock,
  CalendarDays,
  Inbox,
  SearchX,
  Star,
  AlertCircle,
} from 'lucide-react';
import { useAppContext } from '@/lib/store';
import { MOCK_USERS } from '@/lib/mockData';
import { Status, Task } from '@/lib/types';

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const today = new Date();
today.setHours(0, 0, 0, 0);

function getDDay(dueDate: string): {
  label: string;
  variant: 'overdue' | 'today' | 'soon' | 'normal';
} {
  const diff = differenceInCalendarDays(parseISO(dueDate), today);
  if (diff < 0) return { label: `D+${Math.abs(diff)}`, variant: 'overdue' };
  if (diff === 0) return { label: 'D-Day', variant: 'today' };
  if (diff <= 3) return { label: `D-${diff}`, variant: 'soon' };
  return { label: `D-${diff}`, variant: 'normal' };
}

const DDAY_STYLES: Record<string, string> = {
  overdue: 'bg-red-100 text-red-700 ring-1 ring-red-200',
  today: 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
  soon: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  normal: 'bg-slate-100 text-slate-600',
};

function StatusIcon({ status }: { status: Status }) {
  if (status === 'Done') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
  if (status === 'In Progress') return <Timer className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
  if (status === 'Review Clear 필요') return <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
  return <CircleDashed className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
}

/* Blinking urgency indicator for overdue tasks */
function UrgentPulse() {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
    </span>
  );
}

interface TaskCardProps {
  task: Task;
  index: number;
}

function TaskCard({ task, index }: TaskCardProps) {
  const { getETById, state } = useAppContext();
  const et = getETById(task.etId);
  const { label, variant } = getDDay(task.dueDate);
  const isOverdue = variant === 'overdue';
  const isUrgent = task.urgent === true;
  const isTeamView = state.activeEtFilter !== null;
  const assignee = isTeamView && task.assigneeId
    ? MOCK_USERS.find((u) => u.id === task.assigneeId)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04, ease: 'easeOut' }}
      className={`rounded-lg border bg-white px-3 py-2.5 hover:shadow-sm transition-all ${
        isUrgent
          ? 'border-red-300 bg-red-50/40'
          : isOverdue
          ? 'border-red-200 bg-red-50/30'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start gap-2">
        {isUrgent && <Star className="w-3 h-3 text-red-500 fill-red-500 shrink-0 mt-0.5" />}
        {!isUrgent && isOverdue && <UrgentPulse />}
        <div className="mt-0.5 shrink-0">
          <StatusIcon status={task.status} />
        </div>
        <p className="flex-1 text-xs font-semibold text-slate-800 leading-snug line-clamp-2">
          {task.title}
        </p>
        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${DDAY_STYLES[variant]}`}>
          {label}
        </span>
      </div>

      {/* Bottom row */}
      <div className="flex items-center gap-1.5 mt-2 pl-5">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: et?.color ?? '#cbd5e1' }}
        />
        <span className="text-[10px] font-medium truncate" style={{ color: et?.color ?? '#94a3b8' }}>
          {et?.name ?? '–'}
        </span>
        {assignee && (
          <span className="flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[9px] font-semibold shrink-0">
            <span className="w-3 h-3 rounded-full bg-slate-400 text-white flex items-center justify-center text-[7px] font-bold">
              {assignee.name[0]}
            </span>
            {assignee.name}
          </span>
        )}
        <span className="ml-auto text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
          <CalendarDays className="w-2.5 h-2.5" />
          {format(parseISO(task.dueDate), 'M/d')}
        </span>
      </div>

      {/* Time budget bar */}
      {task.timeBudget != null && task.timeBudget > 0 && (() => {
        const spent = task.timeSpent ?? 0;
        const pct = Math.round((spent / task.timeBudget) * 100);
        const barColor =
          pct > 100 ? 'bg-red-400' : pct >= 80 ? 'bg-amber-400' : 'bg-emerald-400';
        const textColor =
          pct > 100 ? 'text-red-500' : pct >= 80 ? 'text-amber-500' : 'text-emerald-600';
        return (
          <div className="mt-2 pl-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-slate-400 font-medium">투입 시간</span>
              <span className={`text-[9px] font-bold ${textColor}`}>
                {spent}h / {task.timeBudget}h
                {pct > 100 && <span className="ml-1 text-red-400">초과</span>}
              </span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
        );
      })()}
    </motion.div>
  );
}

/* ── Empty states ────────────────────────────────────────────────────────── */

function EmptyUpcoming() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-3 py-14 text-slate-400"
    >
      <Inbox className="w-9 h-9" />
      <div className="text-center">
        <p className="text-xs font-semibold text-slate-500">다가오는 업무 없음</p>
        <p className="text-[11px] mt-1">향후 30일 내 미완료 업무가 없습니다.</p>
      </div>
    </motion.div>
  );
}

function EmptyDay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-2 py-6 text-slate-400"
    >
      <SearchX className="w-7 h-7" />
      <p className="text-xs">이 날에 등록된 업무가 없습니다.</p>
    </motion.div>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────────────────── */

export default function TaskSidebar() {
  const { state, getUpcomingTasks, getTasksForDate, getTasksFiltered } = useAppContext();
  const { selectedDate, activeEtFilter } = state;

  const upcomingTasks = getUpcomingTasks(30);
  // Urgent tasks pinned to top, rest keep dueDate order
  const sortedUpcoming = [
    ...upcomingTasks.filter((t) => t.urgent),
    ...upcomingTasks.filter((t) => !t.urgent),
  ];

  const selectedDayTasks = selectedDate
    ? [...getTasksForDate(selectedDate)].sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0))
    : [];

  const allMyTasks = getTasksFiltered();
  const reviewClearCount = allMyTasks.filter((t) => t.status === 'Review Clear 필요').length;

  // Key changes force AnimatePresence to re-animate the list on filter change
  const listKey = activeEtFilter ?? 'all';

  return (
    <div className="flex flex-col h-full">
      {/* ── Selected Day Panel ──────────────────────────────────────── */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-slate-200 overflow-hidden"
          >
            <div className="p-4 bg-blue-50/70">
              <div className="flex items-center gap-2 mb-3">
                <CalendarClock className="w-4 h-4 text-blue-600 shrink-0" />
                <h2 className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  {format(parseISO(selectedDate), 'M월 d일')} 업무
                </h2>
                <span className="ml-auto text-[10px] bg-blue-100 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
                  {selectedDayTasks.length}건
                </span>
              </div>
              {selectedDayTasks.length === 0 ? (
                <EmptyDay />
              ) : (
                <div className="flex flex-col gap-2">
                  {selectedDayTasks.map((task, i) => (
                    <TaskCard key={task.id} task={task} index={i} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Upcoming Tasks ──────────────────────────────────────────── */}
      <div className="flex-1 p-4 overflow-y-auto min-h-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-slate-500" />
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Upcoming Tasks
            </h2>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">
            {upcomingTasks.length}건
          </span>
        </div>

        {/* Review Clear 필요 banner */}
        {reviewClearCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 mb-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[11px] font-semibold text-amber-700">
              Review Clear 필요 {reviewClearCount}건
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {sortedUpcoming.length === 0 ? (
            <EmptyUpcoming key="empty" />
          ) : (
            <motion.div
              key={listKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-2"
            >
              {sortedUpcoming.map((task, i) => (
                <TaskCard key={task.id} task={task} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
