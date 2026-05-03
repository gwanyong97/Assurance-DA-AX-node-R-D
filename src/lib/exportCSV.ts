import { ET, Task } from './types';

export function exportTasksToCSV(tasks: Task[], ets: ET[]): void {
  const etMap = new Map(ets.map((e) => [e.id, e.name]));

  const headers = ['ET명', '업무명', '마감일', '상태', '메모'];
  const rows = tasks
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .map((task) => [
      etMap.get(task.etId) ?? '',
      task.title,
      task.dueDate,
      task.status,
      task.description ?? '',
    ]);

  const escape = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
  const csvContent = [headers, ...rows]
    .map((row) => row.map(escape).join(','))
    .join('\r\n');

  // BOM prefix so Excel opens Korean text correctly
  const blob = new Blob(['﻿' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ET_업무현황_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
