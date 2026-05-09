'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { AppAction, AppState, ET, Task, User } from './types';
import { INITIAL_ETS, INITIAL_TASKS, DEFAULT_USER } from './mockData';

// ── localStorage persistence ──────────────────────────────────────────────────

const STORAGE_KEY = 'et-calendar-state';
const STORAGE_VERSION = 3; // bump when data shape changes to bust stale cache

function loadPersistedState(): Pick<AppState, 'ets' | 'tasks' | 'currentUser'> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== STORAGE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function buildInitialState(): AppState {
  const persisted = loadPersistedState();
  return {
    ets: persisted?.ets ?? INITIAL_ETS,
    tasks: persisted?.tasks ?? INITIAL_TASKS,
    currentUser: persisted?.currentUser ?? DEFAULT_USER,
    activeEtFilter: null,
    selectedDate: null,
  };
}

// ── Reducer ───────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload.id),
      };

    case 'ADD_ET':
      return { ...state, ets: [...state.ets, action.payload] };

    case 'SET_CURRENT_USER':
      // Switching users resets the active ET filter so stale selections don't
      // persist across users who may not share the same ET assignments.
      return {
        ...state,
        currentUser: action.payload,
        activeEtFilter: null,
        selectedDate: null,
      };

    case 'SET_ET_FILTER':
      return { ...state, activeEtFilter: action.payload };

    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };

    default:
      return state;
  }
}


// ── Context ───────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  // Task actions
  addTask: (task: Omit<Task, 'id'>) => void;
  editTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  // ET actions
  addET: (et: Omit<ET, 'id'>) => void;
  // User actions
  setCurrentUser: (user: User) => void;
  // Filter / navigation
  setEtFilter: (etId: string | null) => void;
  setSelectedDate: (date: string | null) => void;
  // Selectors — each one first gates on currentUser.assignedEtIds, then the
  // optional activeEtFilter, so the "unified view" is always user-scoped.
  getTasksForDate: (date: string) => Task[];
  getTasksFiltered: () => Task[];
  getUpcomingTasks: (limitDays?: number) => Task[];
  getETById: (etId: string) => ET | undefined;
  /** ETs the current user is a member of */
  getMyETs: () => ET[];
}

const AppContext = createContext<AppContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, buildInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: STORAGE_VERSION, ets: state.ets, tasks: state.tasks, currentUser: state.currentUser })
      );
    } catch {
      // storage quota exceeded — silently ignore
    }
  }, [state.ets, state.tasks, state.currentUser]);

  // ── Task actions ────────────────────────────────────────────────────────────

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    dispatch({ type: 'ADD_TASK', payload: { ...task, id: `task-${Date.now()}` } });
  }, []);

  const editTask = useCallback((task: Task) => {
    dispatch({ type: 'EDIT_TASK', payload: task });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { id } });
  }, []);

  // ── ET actions ──────────────────────────────────────────────────────────────

  const addET = useCallback((et: Omit<ET, 'id'>) => {
    dispatch({ type: 'ADD_ET', payload: { ...et, id: `et-${Date.now()}` } });
  }, []);

  // ── User actions ────────────────────────────────────────────────────────────

  const setCurrentUser = useCallback((user: User) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
  }, []);

  // ── Filter / navigation ─────────────────────────────────────────────────────

  const setEtFilter = useCallback((etId: string | null) => {
    dispatch({ type: 'SET_ET_FILTER', payload: etId });
  }, []);

  const setSelectedDate = useCallback((date: string | null) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date });
  }, []);

  // ── Selectors ───────────────────────────────────────────────────────────────

  const getETById = useCallback(
    (etId: string) => state.ets.find((et) => et.id === etId),
    [state.ets]
  );

  /** ETs the current user is assigned to, preserving original ET order. */
  const getMyETs = useCallback(
    () =>
      state.ets.filter((et) =>
        state.currentUser.assignedEtIds.includes(et.id)
      ),
    [state.ets, state.currentUser.assignedEtIds]
  );

  /**
   * Tasks for a specific date.
   * Team view (activeEtFilter set): ALL tasks for that ET, regardless of assignee.
   * Personal view: only tasks assigned to currentUser within their ETs.
   */
  const getTasksForDate = useCallback(
    (date: string): Task[] => {
      if (state.activeEtFilter) {
        return state.tasks.filter(
          (t) => t.dueDate === date && t.etId === state.activeEtFilter
        );
      }
      const myEtIds = state.currentUser.assignedEtIds;
      return state.tasks.filter(
        (t) =>
          t.dueDate === date &&
          myEtIds.includes(t.etId) &&
          (!t.assigneeId || t.assigneeId === state.currentUser.id)
      );
    },
    [state.tasks, state.activeEtFilter, state.currentUser]
  );

  /**
   * All tasks visible to the current user, sorted by dueDate.
   * Team view: all tasks for the filtered ET.
   * Personal view: only currentUser's assigned tasks across their ETs.
   */
  const getTasksFiltered = useCallback((): Task[] => {
    if (state.activeEtFilter) {
      return state.tasks
        .filter((t) => t.etId === state.activeEtFilter)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    }
    const myEtIds = state.currentUser.assignedEtIds;
    return state.tasks
      .filter(
        (t) =>
          myEtIds.includes(t.etId) &&
          (!t.assigneeId || t.assigneeId === state.currentUser.id)
      )
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [state.tasks, state.activeEtFilter, state.currentUser]);

  /**
   * Non-Done tasks due within `limitDays` calendar days from today.
   * Team view: all upcoming tasks for the filtered ET.
   * Personal view: only currentUser's upcoming tasks.
   */
  const getUpcomingTasks = useCallback(
    (limitDays = 30): Task[] => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const limit = new Date(now);
      limit.setDate(now.getDate() + limitDays);

      return state.tasks
        .filter((t) => {
          if (t.status === 'Done') return false;
          const due = new Date(t.dueDate);
          if (due < now || due > limit) return false;
          if (state.activeEtFilter) return t.etId === state.activeEtFilter;
          const myEtIds = state.currentUser.assignedEtIds;
          return (
            myEtIds.includes(t.etId) &&
            (!t.assigneeId || t.assigneeId === state.currentUser.id)
          );
        })
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    },
    [state.tasks, state.activeEtFilter, state.currentUser]
  );

  return (
    <AppContext.Provider
      value={{
        state,
        addTask,
        editTask,
        deleteTask,
        addET,
        setCurrentUser,
        setEtFilter,
        setSelectedDate,
        getTasksForDate,
        getTasksFiltered,
        getUpcomingTasks,
        getETById,
        getMyETs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>');
  return ctx;
}
