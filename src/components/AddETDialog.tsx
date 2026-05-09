'use client';

import { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import { useAppContext } from '@/lib/store';

const COLOR_PRESETS = [
  { color: '#3B82F6', colorLight: '#EFF6FF' },
  { color: '#F43F5E', colorLight: '#FFF1F2' },
  { color: '#10B981', colorLight: '#ECFDF5' },
  { color: '#8B5CF6', colorLight: '#F5F3FF' },
  { color: '#F59E0B', colorLight: '#FFFBEB' },
  { color: '#06B6D4', colorLight: '#ECFEFF' },
  { color: '#EC4899', colorLight: '#FDF2F8' },
  { color: '#84CC16', colorLight: '#F7FEE7' },
  { color: '#6366F1', colorLight: '#EEF2FF' },
  { color: '#F97316', colorLight: '#FFF7ED' },
  { color: '#14B8A6', colorLight: '#F0FDFA' },
  { color: '#DC2626', colorLight: '#FEF2F2' },
  { color: '#0EA5E9', colorLight: '#F0F9FF' },
  { color: '#7C3AED', colorLight: '#F3F0FF' },
  { color: '#D97706', colorLight: '#FEFCE8' },
  { color: '#059669', colorLight: '#ECFDF5' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddETDialog({ open, onClose }: Props) {
  const { addET } = useAppContext();
  const [name, setName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(COLOR_PRESETS[0]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addET({ name: name.trim(), color: selectedPreset.color, colorLight: selectedPreset.colorLight });
    setName('');
    setSelectedPreset(COLOR_PRESETS[0]);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">새 ET 추가</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                ET 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: M사 기말감사"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder:text-slate-400"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                ET 색상
              </label>
              <div className="grid grid-cols-8 gap-1.5">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    className="w-7 h-7 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: preset.color,
                      borderColor: selectedPreset.color === preset.color ? '#1e293b' : 'transparent',
                      transform: selectedPreset.color === preset.color ? 'scale(1.25)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] text-slate-400">미리보기:</span>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: selectedPreset.colorLight, color: selectedPreset.color }}
                >
                  {name || 'ET 이름'}
                </span>
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
                ET 추가
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
