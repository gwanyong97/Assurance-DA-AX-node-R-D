export type Status = 'To-Do' | 'In Progress' | 'Done' | 'Review Clear 필요';

export interface ET {
  id: string;
  name: string;
  color: string;       // hex e.g. '#3B82F6'
  colorLight: string;  // light bg e.g. '#EFF6FF'
}

export interface Task {
  id: string;
  etId: string;
  assigneeId?: string;  // user.id; undefined = unassigned
  title: string;
  dueDate: string;     // 'YYYY-MM-DD'
  status: Status;
  description?: string;
  urgent?: boolean;
  timeBudget?: number;
  timeSpent?: number;
  comment?: string;     // KM/PM 코멘트
  pending?: string;     // Pending 사항 (담당자 메모)
}

export interface User {
  id: string;
  name: string;
  role: string;           // e.g. '2년차 감사인'
  assignedEtIds: string[]; // the ETs this user is a member of
}

export interface AppState {
  ets: ET[];
  tasks: Task[];
  users: User[];               // all team members (persisted)
  currentUser: User;           // drives the "my ETs" base filter
  activeEtFilter: string | null; // secondary filter within current user's ETs
  selectedDate: string | null;
}

export type AppAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'EDIT_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'ADD_ET'; payload: ET }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'SET_CURRENT_USER'; payload: User }       // resets activeEtFilter
  | { type: 'SET_ET_FILTER'; payload: string | null }
  | { type: 'SET_SELECTED_DATE'; payload: string | null };
