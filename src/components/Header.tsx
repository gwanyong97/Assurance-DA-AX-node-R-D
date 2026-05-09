'use client';

import { CalendarCheck2, ChevronDown, Users, Moon, Sun } from 'lucide-react';
import { useAppContext } from '@/lib/store';
import { MOCK_USERS } from '@/lib/mockData';
import { useTheme } from '@/lib/theme';
import { useState } from 'react';

export default function Header() {
  const { state, setEtFilter, setCurrentUser, getMyETs } = useAppContext();
  const { activeEtFilter, currentUser } = state;
  const { theme, toggle: toggleTheme } = useTheme();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const myETs = getMyETs();

  // Stats are scoped to current user's ETs only
  const myTasks = state.tasks.filter((t) =>
    currentUser.assignedEtIds.includes(t.etId)
  );
  const totalOpen = myTasks.filter((t) => t.status !== 'Done').length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueThisWeek = myTasks.filter((t) => {
    if (t.status === 'Done') return false;
    const diff = Math.ceil(
      (new Date(t.dueDate).getTime() - today.getTime()) / 86_400_000
    );
    return diff >= 0 && diff <= 7;
  }).length;

  // User initials for avatar
  const initials = currentUser.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="shrink-0 h-16 bg-white border-b border-slate-200 shadow-sm flex items-center px-6 gap-5 z-10">
      {/* ── Brand ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
          <CalendarCheck2 className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 leading-none">
            Unified ET Task Calendar
          </h1>
          <p className="text-[10px] text-slate-400 mt-0.5 leading-none">
            감사 참여팀 통합 업무 관리
          </p>
        </div>
      </div>

      <div className="h-6 w-px bg-slate-200 shrink-0" />

      {/* ── ET Filter Pills (scoped to current user's ETs) ──────────── */}
      <nav
        className="flex items-center gap-1.5 overflow-x-auto flex-1 scrollbar-hide"
        aria-label="ET 필터"
      >
        {/* "All my ETs" button */}
        <button
          onClick={() => setEtFilter(null)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
            activeEtFilter === null
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-800'
          }`}
        >
          <Users className="w-3 h-3" />
          내 전체 ET
        </button>

        {/* Only the ETs this user belongs to */}
        {myETs.map((et) => {
          const isActive = activeEtFilter === et.id;
          return (
            <button
              key={et.id}
              onClick={() => setEtFilter(isActive ? null : et.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border"
              style={{
                backgroundColor: isActive ? et.color : et.colorLight,
                color: isActive ? '#fff' : et.color,
                borderColor: et.color,
                boxShadow: isActive ? `0 1px 4px ${et.color}55` : 'none',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: isActive ? '#fff' : et.color }}
              />
              {et.name}
            </button>
          );
        })}

        {/* Membership proof badge */}
        <span className="ml-1 text-[10px] text-slate-400 whitespace-nowrap shrink-0">
          ({myETs.length}개 ET 담당)
        </span>
      </nav>

      {/* ── Stats (user-scoped) ──────────────────────────────────────── */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <p className="text-[10px] text-slate-400 leading-none">미완료 업무</p>
          <p className="text-sm font-bold text-slate-800 mt-0.5">{totalOpen}건</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 leading-none">이번 주 마감</p>
          <p className="text-sm font-bold text-red-500 mt-0.5">{dueThisWeek}건</p>
        </div>
      </div>

      <div className="h-6 w-px bg-slate-200 shrink-0" />

      {/* ── Theme Toggle ─────────────────────────────────────────────── */}
      <button
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        className="shrink-0 p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
      >
        {theme === 'dark'
          ? <Sun className="w-4 h-4" />
          : <Moon className="w-4 h-4" />
        }
      </button>

      <div className="h-6 w-px bg-slate-200 shrink-0" />

      {/* ── User Switcher ────────────────────────────────────────────── */}
      <div className="relative shrink-0">
        <button
          onClick={() => setUserDropdownOpen((v) => !v)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
          aria-expanded={userDropdownOpen}
          aria-haspopup="listbox"
        >
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-blue-700">{initials}</span>
          </div>
          {/* Name + role */}
          <div className="text-left">
            <p className="text-xs font-bold text-slate-900 leading-none">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-none">
              {currentUser.role}
            </p>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown */}
        {userDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setUserDropdownOpen(false)}
            />
            <div
              role="listbox"
              className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  사용자 전환 (데모)
                </p>
              </div>
              {MOCK_USERS.map((user) => {
                const isSelected = user.id === currentUser.id;
                const userETs = state.ets.filter((et) =>
                  user.assignedEtIds.includes(et.id)
                );
                const userInitials = user.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <button
                    key={user.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setCurrentUser(user);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold ${
                          isSelected ? 'text-white' : 'text-slate-600'
                        }`}
                      >
                        {userInitials}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900">
                          {user.name}
                        </p>
                        {isSelected && (
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                            현재
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {user.role}
                      </p>
                      {/* ET membership dots */}
                      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                        {userETs.map((et) => (
                          <span
                            key={et.id}
                            className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: et.colorLight,
                              color: et.color,
                            }}
                          >
                            {et.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
