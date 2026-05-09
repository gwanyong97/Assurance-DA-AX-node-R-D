'use client';

import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Circle, CalendarX } from 'lucide-react';
import { useAppContext } from '@/lib/store';
import { Task } from '@/lib/types';

const DOW_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function formatKoreanMonth(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

interface TaskChipProps {
  task: Task;
  color: string;
  onEdit: (task: Task) => void;
}

function TaskChip({ task, color, onEdit }: TaskChipProps) {
  const isDone = task.status === 'Done';
  const isUrgent = task.urgent && !isDone;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger day-cell selection
    onEdit(task);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && onEdit(task)}
      className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-[3px] rounded-sm truncate leading-tight cursor-pointer hover:brightness-90 active:scale-95 transition-all"
      style={{
        backgroundColor: isDone ? `${color}28` : isUrgent ? '#EF4444' : color,
        color: isDone ? color : '#fff',
        outline: 'none',
      }}
      title={`${task.title} — 클릭하여 수정`}
    >
      {isDone && <Circle className="w-2 h-2 shrink-0 opacity-60" strokeWidth={2.5} />}
      {isUrgent && <span className="shrink-0 leading-none">⭐</span>}
      <span className="truncate">{task.title}</span>
    </div>
  );
}

interface Props {
  onEditTask: (task: Task) => void;
}

export default function CalendarGrid({ onEditTask }: Props) {
  const { state, getTasksForDate, setSelectedDate } = useAppContext();
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const visibleTaskCount = days.reduce((acc, day) => {
    return acc + getTasksForDate(format(day, 'yyyy-MM-dd')).length;
  }, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* ── Calendar Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-900">
            {formatKoreanMonth(viewMonth)}
          </h2>
          <button
            onClick={() => setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="text-xs px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium"
          >
            오늘
          </button>
          {state.activeEtFilter && (
            <span className="text-[10px] text-slate-400 font-medium">
              {visibleTaskCount}건 표시 중
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMonth((m) => subMonths(m, 1))}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            aria-label="이전 달"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            aria-label="다음 달"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Day-of-week Header Row ───────────────────────────────────── */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {DOW_LABELS.map((label, i) => (
          <div
            key={label}
            className={`py-2 text-center text-[11px] font-semibold tracking-wide ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* ── Empty state when filter returns nothing ──────────────────── */}
      {state.activeEtFilter !== null && visibleTaskCount === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <CalendarX className="w-10 h-10" />
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-500">이 기간에 업무가 없습니다</p>
            <p className="text-xs mt-1">다른 ET를 선택하거나 새 업무를 추가해보세요.</p>
          </div>
        </div>
      ) : (
        /* ── Day Cells ──────────────────────────────────────────────── */
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const tasks = getTasksForDate(dateStr);
            const inMonth = isSameMonth(day, viewMonth);
            const isToday = isSameDay(day, today);
            const isSelected = state.selectedDate === dateStr;
            const isSunday = idx % 7 === 0;
            const isSaturday = idx % 7 === 6;
            const isLastRow = idx >= days.length - 7;
            const isLastCol = idx % 7 === 6;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={[
                  'min-h-[108px] p-2 flex flex-col gap-0.5 cursor-pointer transition-colors select-none',
                  !isLastRow ? 'border-b' : '',
                  !isLastCol ? 'border-r' : '',
                  'border-slate-100',
                  !inMonth ? 'bg-slate-50/60' : 'bg-white',
                  isSelected ? 'bg-blue-50 ring-2 ring-inset ring-blue-400' : '',
                  inMonth && !isSelected ? 'hover:bg-slate-50' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {/* Day number */}
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={[
                      'w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold',
                      isToday ? 'bg-blue-600 text-white shadow-sm' : '',
                      !isToday && inMonth && isSunday ? 'text-red-400' : '',
                      !isToday && inMonth && isSaturday ? 'text-blue-400' : '',
                      !isToday && inMonth && !isSunday && !isSaturday ? 'text-slate-700' : '',
                      !inMonth ? 'text-slate-300' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {format(day, 'd')}
                  </span>
                  {tasks.length > 0 && inMonth && (
                    <span className="text-[9px] text-slate-400 font-medium">
                      {tasks.length}건
                    </span>
                  )}
                </div>

                {/* Task chips */}
                <div className="flex flex-col gap-[3px] overflow-hidden">
                  {tasks.slice(0, 3).map((task) => {
                    const et = state.ets.find((e) => e.id === task.etId);
                    return et ? (
                      <TaskChip
                        key={task.id}
                        task={task}
                        color={et.color}
                        onEdit={onEditTask}
                      />
                    ) : null;
                  })}
                  {tasks.length > 3 && (
                    <p className="text-[10px] text-slate-400 font-medium pl-1">
                      +{tasks.length - 3}건 더보기
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
