'use client';

import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useAppContext } from '@/lib/store';

const ROLES = ['A1', 'A2', 'SA1', 'SA2', 'SM1', 'PM', 'EP'];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddUserDialog({ open, onClose }: Props) {
  const { state, addUser } = useAppContext();
  const [name, setName] = useState('');
  const [role, setRole] = useState('A1');
  const [selectedEtIds, setSelectedEtIds] = useState<string[]>([]);

  if (!open) return null;

  const toggleEt = (etId: string) => {
    setSelectedEtIds((prev) =>
      prev.includes(etId) ? prev.filter((id) => id !== etId) : [...prev, etId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addUser({ name: name.trim(), role, assignedEtIds: selectedEtIds });
    setName('');
    setRole('A1');
    setSelectedEtIds([]);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto w-[480px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">새 팀원 추가</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder:text-slate-400"
                  required
                  autoFocus
                />
              </div>
              <div className="w-28">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                  직급
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                소속 ET 선택{' '}
                <span className="text-slate-400 font-normal">({selectedEtIds.length}개 선택됨)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 rounded-lg border border-slate-100 dark:border-slate-800">
                {state.ets.map((et) => {
                  const selected = selectedEtIds.includes(et.id);
                  return (
                    <button
                      key={et.id}
                      type="button"
                      onClick={() => toggleEt(et.id)}
                      className="text-xs font-medium px-2.5 py-1 rounded-full border transition-all"
                      style={{
                        backgroundColor: selected ? et.color : et.colorLight,
                        color: selected ? '#fff' : et.color,
                        borderColor: et.color,
                      }}
                    >
                      {et.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="px-4 py-1.5 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                팀원 추가
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
