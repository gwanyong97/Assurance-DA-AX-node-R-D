'use client';

import { useState } from 'react';
import { Plus, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppContext } from '@/lib/store';
import { Status } from '@/lib/types';

interface FormState {
  etId: string;
  title: string;
  dueDate: string;
  status: Status;
  description: string;
  urgent: boolean;
}

const BLANK_FORM: FormState = {
  etId: '',
  title: '',
  dueDate: '',
  status: 'To-Do',
  description: '',
  urgent: false,
};

const STATUS_OPTIONS: { value: Status; label: string; color: string }[] = [
  { value: 'To-Do', label: 'To-Do', color: 'text-slate-500' },
  { value: 'In Progress', label: 'In Progress', color: 'text-blue-500' },
  { value: 'Done', label: 'Done', color: 'text-emerald-500' },
  { value: 'Review Clear 필요', label: 'Review Clear 필요', color: 'text-amber-500' },
];

export default function AddTaskDialog() {
  const { state, addTask } = useAppContext();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(BLANK_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const clearError = (field: keyof FormState) =>
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.etId) next.etId = 'ET를 선택해 주세요.';
    if (!form.title.trim()) next.title = '업무명을 입력해 주세요.';
    if (!form.dueDate) next.dueDate = '마감일을 선택해 주세요.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      addTask({ ...form, title: form.title.trim(), description: form.description.trim() });
      setSubmitting(false);
      setOpen(false);
      setForm(BLANK_FORM);
      setErrors({});
    }, 300);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(BLANK_FORM);
    setErrors({});
  };

  const selectedET = state.ets.find((e) => e.id === form.etId);

  return (
    <>
      {/* Floating action button — outside Dialog so it doesn't need asChild */}
      <button
        aria-label="새 업무 추가"
        onClick={() => setOpen(true)}
        className="fixed bottom-7 right-7 z-50 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-full px-5 py-3 shadow-lg shadow-blue-500/30 transition-all"
      >
        <Plus className="w-4 h-4" />
        새 업무 추가
      </button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">새 감사 업무 추가</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              참여팀(ET)을 선택하고 업무 내용을 입력하세요.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
            {/* ET Selector */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="et-select" className="text-xs font-semibold">
                감사 참여팀 (ET) <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.etId || null}
                onValueChange={(v) => {
                  setForm((f) => ({ ...f, etId: v ?? '' }));
                  clearError('etId');
                }}
              >
                <SelectTrigger
                  id="et-select"
                  className={`w-full text-sm ${errors.etId ? 'border-red-400' : ''}`}
                >
                  <SelectValue placeholder="ET 선택..." />
                </SelectTrigger>
                <SelectContent>
                  {state.ets.map((et) => (
                    <SelectItem key={et.id} value={et.id}>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 inline-block"
                        style={{ backgroundColor: et.color }}
                      />
                      {et.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.etId && <p className="text-[11px] text-red-500">{errors.etId}</p>}
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-title" className="text-xs font-semibold">
                업무명 <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                {selectedET && (
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none"
                    style={{ backgroundColor: selectedET.color }}
                  />
                )}
                <Input
                  id="task-title"
                  value={form.title}
                  onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); clearError('title'); }}
                  placeholder="예: 은행조회서 발송"
                  className={`text-sm ${selectedET ? 'pl-7' : ''} ${errors.title ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.title && <p className="text-[11px] text-red-500">{errors.title}</p>}
            </div>

            {/* Due Date + Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="due-date" className="text-xs font-semibold">
                  마감일 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="due-date"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => { setForm((f) => ({ ...f, dueDate: e.target.value })); clearError('dueDate'); }}
                  className={`text-sm ${errors.dueDate ? 'border-red-400' : ''}`}
                />
                {errors.dueDate && <p className="text-[11px] text-red-500">{errors.dueDate}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="status-select" className="text-xs font-semibold">상태</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: (v ?? 'To-Do') as Status }))}
                >
                  <SelectTrigger id="status-select" className="w-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className={`font-medium ${opt.color}`}>{opt.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                메모 <span className="text-slate-400 font-normal">(선택)</span>
              </Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="추가 업무 설명..."
                className="text-sm"
              />
            </div>

            {/* Urgent toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={form.urgent}
                onClick={() => setForm((f) => ({ ...f, urgent: !f.urgent }))}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-semibold transition-all ${
                  form.urgent
                    ? 'bg-red-50 border-red-300 text-red-600'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <Star
                  className={`w-3.5 h-3.5 transition-all ${
                    form.urgent ? 'fill-red-500 text-red-500' : 'text-slate-400'
                  }`}
                />
                긴급 업무로 표시
              </button>
              {form.urgent && (
                <span className="text-[11px] text-red-500 font-medium">
                  캘린더에 빨간색, 사이드바 상단에 고정됩니다
                </span>
              )}
            </div>

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" className="text-sm" onClick={handleClose}>
                취소
              </Button>
              <Button type="submit" disabled={submitting} className="text-sm bg-blue-600 hover:bg-blue-700">
                {submitting ? (
                  <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />추가 중...</>
                ) : '업무 추가'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
