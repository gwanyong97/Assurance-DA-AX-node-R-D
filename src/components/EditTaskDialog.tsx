'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
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
import { Task, Status } from '@/lib/types';

interface FormState {
  etId: string;
  title: string;
  dueDate: string;
  status: Status;
  description: string;
}

const STATUS_OPTIONS: { value: Status; label: string; color: string }[] = [
  { value: 'To-Do', label: 'To-Do', color: 'text-slate-500' },
  { value: 'In Progress', label: 'In Progress', color: 'text-blue-500' },
  { value: 'Done', label: 'Done', color: 'text-emerald-500' },
];

interface Props {
  task: Task | null;
  onClose: () => void;
}

export default function EditTaskDialog({ task, onClose }: Props) {
  const { state, editTask, deleteTask } = useAppContext();
  const [form, setForm] = useState<FormState>({
    etId: '',
    title: '',
    dueDate: '',
    status: 'To-Do',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Populate form whenever a new task is loaded for editing
  useEffect(() => {
    if (task) {
      setForm({
        etId: task.etId,
        title: task.title,
        dueDate: task.dueDate,
        status: task.status,
        description: task.description ?? '',
      });
      setErrors({});
      setConfirmDelete(false);
    }
  }, [task]);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      editTask({
        ...task,
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      });
      setSubmitting(false);
      onClose();
    }, 300);
  };

  const handleDelete = () => {
    if (!task) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    deleteTask(task.id);
    onClose();
  };

  const selectedET = state.ets.find((e) => e.id === form.etId);

  return (
    <Dialog
      open={task !== null}
      onOpenChange={(open) => { if (!open) onClose(); }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            {selectedET && (
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: selectedET.color }}
              />
            )}
            업무 수정
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            업무 내용을 수정하거나 삭제할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex flex-col gap-4 mt-1">
          {/* ET Selector */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold">
              감사 참여팀 (ET) <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.etId || null}
              onValueChange={(v) => { setForm((f) => ({ ...f, etId: v ?? '' })); clearError('etId'); }}
            >
              <SelectTrigger className={`w-full text-sm ${errors.etId ? 'border-red-400' : ''}`}>
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
            <Label className="text-xs font-semibold">
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
                value={form.title}
                onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); clearError('title'); }}
                className={`text-sm ${selectedET ? 'pl-7' : ''} ${errors.title ? 'border-red-400' : ''}`}
              />
            </div>
            {errors.title && <p className="text-[11px] text-red-500">{errors.title}</p>}
          </div>

          {/* Due Date + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold">
                마감일 <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => { setForm((f) => ({ ...f, dueDate: e.target.value })); clearError('dueDate'); }}
                className={`text-sm ${errors.dueDate ? 'border-red-400' : ''}`}
              />
              {errors.dueDate && <p className="text-[11px] text-red-500">{errors.dueDate}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold">상태</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: (v ?? 'To-Do') as Status }))}
              >
                <SelectTrigger className="w-full text-sm">
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
            <Label className="text-xs font-semibold">
              메모 <span className="text-slate-400 font-normal">(선택)</span>
            </Label>
            <Input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="추가 업무 설명..."
              className="text-sm"
            />
          </div>

          <DialogFooter className="mt-2 flex-col sm:flex-row gap-2">
            {/* Delete button (left-aligned) */}
            <button
              type="button"
              onClick={handleDelete}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all mr-auto ${
                confirmDelete
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'text-red-500 hover:bg-red-50 border border-red-200'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {confirmDelete ? '정말 삭제' : '삭제'}
            </button>

            <Button type="button" variant="outline" className="text-sm" onClick={onClose}>
              취소
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="text-sm bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />저장 중...</>
              ) : '변경 저장'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
