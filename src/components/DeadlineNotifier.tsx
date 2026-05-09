'use client';

import { useEffect, useRef } from 'react';
import { useAppContext } from '@/lib/store';

const NOTIFIED_KEY = 'et-notified';

function getNotifiedSet(today: string): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (parsed.date !== today) return new Set();
    return new Set(parsed.ids as string[]);
  } catch {
    return new Set();
  }
}

function saveNotifiedSet(ids: Set<string>, today: string) {
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify({ date: today, ids: [...ids] }));
}

export default function DeadlineNotifier() {
  const { getTasksFiltered, getETById } = useAppContext();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    if (!('Notification' in window)) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);

    const fire = () => {
      const tasks = getTasksFiltered();
      const notifiedSet = getNotifiedSet(todayStr);
      let updated = false;

      tasks.forEach((task) => {
        if (task.status === 'Done') return;
        const due = new Date(task.dueDate);
        const diff = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
        if (diff !== 0 && diff !== 1) return;

        const key = `${task.id}-${diff === 0 ? 'dday' : 'd1'}`;
        if (notifiedSet.has(key)) return;

        const label = diff === 0 ? 'D-Day' : 'D-1';
        const etName = getETById(task.etId)?.name ?? '';
        new Notification(`[${label}] ${task.title}`, {
          body: `${etName} · 마감일: ${task.dueDate}`,
          icon: '/favicon.ico',
          tag: key,
        });

        notifiedSet.add(key);
        updated = true;
      });

      if (updated) saveNotifiedSet(notifiedSet, todayStr);
    };

    if (Notification.permission === 'granted') {
      fire();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') fire();
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
