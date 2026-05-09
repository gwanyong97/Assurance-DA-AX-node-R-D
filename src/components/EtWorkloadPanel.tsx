'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Users2, Clock } from 'lucide-react';
import { useAppContext } from '@/lib/store';
import { MOCK_USERS } from '@/lib/mockData';

export default function EtWorkloadPanel() {
  const { state, getETById } = useAppContext();
  const { activeEtFilter, tasks } = state;

  const et = activeEtFilter ? getETById(activeEtFilter) : null;
  const members = activeEtFilter
    ? MOCK_USERS.filter((u) => u.assignedEtIds.includes(activeEtFilter))
    : [];

  const workloads = members.map((member) => {
    const mt = tasks.filter(
      (t) => t.etId === activeEtFilter && t.assigneeId === member.id
    );
    const todo       = mt.filter((t) => t.status === 'To-Do').length;
    const inProgress = mt.filter((t) => t.status === 'In Progress').length;
    const reviewClear = mt.filter((t) => t.status === 'Review Clear 필요').length;
    const done       = mt.filter((t) => t.status === 'Done').length;
    const remainBudget = mt.reduce(
      (s, t) => s + Math.max(0, (t.timeBudget ?? 0) - (t.timeSpent ?? 0)),
      0
    );
    const openCount = todo + inProgress + reviewClear;
    const overload  = openCount >= 3 || remainBudget > 20;
    return { member, todo, inProgress, reviewClear, done, remainBudget, openCount, overload };
  });

  return (
    <AnimatePresence>
      {activeEtFilter && (
        <motion.div
          key={activeEtFilter}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 bg-white border-b border-slate-200 px-6 py-3 overflow-hidden"
        >
          <div className="flex items-center gap-5">
            {/* Label */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Users2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                팀원 부하 현황
              </span>
            </div>

            {/* Member cards */}
            <div className="flex items-center gap-3">
              {workloads.map(({ member, todo, inProgress, reviewClear, done, remainBudget, overload }, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-colors ${
                    overload
                      ? 'border-red-200 bg-red-50/50'
                      : 'border-slate-100 bg-slate-50/50'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                    style={{ backgroundColor: et?.color }}
                  >
                    {member.name[0]}
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-800 truncate">
                        {member.name}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium shrink-0">
                        {member.role}
                      </span>
                      {overload && (
                        <span className="text-[9px] font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded-full shrink-0">
                          과부하
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {inProgress > 0 && (
                        <span className="text-[9px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                          ⏱ {inProgress}
                        </span>
                      )}
                      {reviewClear > 0 && (
                        <span className="text-[9px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                          ⚠ {reviewClear}
                        </span>
                      )}
                      <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                        ○ {todo}
                      </span>
                      <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        ✓ {done}
                      </span>
                      {remainBudget > 0 && (
                        <span className="flex items-center gap-0.5 text-[9px] text-slate-400 font-medium ml-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          잔여 {remainBudget}h
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
