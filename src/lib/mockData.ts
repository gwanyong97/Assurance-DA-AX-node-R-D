import { ET, Task, User } from './types';

export const INITIAL_ETS: ET[] = [
  {
    id: 'et-1',
    name: 'A전자 기말감사',
    color: '#3B82F6',
    colorLight: '#EFF6FF',
  },
  {
    id: 'et-2',
    name: 'B건설 반기검토',
    color: '#F43F5E',
    colorLight: '#FFF1F2',
  },
  {
    id: 'et-3',
    name: 'C화학 PA',
    color: '#10B981',
    colorLight: '#ECFDF5',
  },
  {
    id: 'et-4',
    name: 'D물산 내부회계',
    color: '#8B5CF6',
    colorLight: '#F5F3FF',
  },
  {
    id: 'et-5',
    name: 'E바이오 IPO컨토',
    color: '#F59E0B',
    colorLight: '#FFFBEB',
  },
];

export const INITIAL_TASKS: Task[] = [
  // ── A전자 기말감사 (blue) ─────────────────────────────────────────
  {
    id: 'task-01',
    etId: 'et-1',
    title: '현금및현금성자산 명세서 작성',
    dueDate: '2026-05-02',
    status: 'Done',
    description: '기말 현금 잔액 명세서 작성 및 은행 잔액증명서 대사',
    timeBudget: 8,
    timeSpent: 7,
  },
  {
    id: 'task-02',
    etId: 'et-1',
    title: '은행조회서 발송',
    dueDate: '2026-05-07',
    status: 'Done',
    description: '주거래 은행 5개사 대상 조회서 발송 및 회신 관리',
    timeBudget: 4,
    timeSpent: 5,
  },
  {
    id: 'task-03',
    etId: 'et-1',
    title: '매출채권 차이조정',
    dueDate: '2026-05-14',
    status: 'In Progress',
    urgent: true,
    description: '외부조회 회신 결과와 장부 잔액 간 차이 원인 분석',
    timeBudget: 12,
    timeSpent: 6,
  },
  {
    id: 'task-04',
    etId: 'et-1',
    title: '재고실사 참여',
    dueDate: '2026-05-19',
    status: 'To-Do',
    description: '수원 물류센터 실사 참여 및 실사조서 작성',
    timeBudget: 8,
    timeSpent: 0,
  },
  {
    id: 'task-05',
    etId: 'et-1',
    title: 'IFRS 15 수익인식 검토',
    dueDate: '2026-05-26',
    status: 'To-Do',
    description: '반도체 장기공급계약 수행의무 식별 및 거래가격 배분 적정성 검토',
    timeBudget: 16,
    timeSpent: 0,
  },

  // ── B건설 반기검토 (rose) ─────────────────────────────────────────
  {
    id: 'task-06',
    etId: 'et-2',
    title: '공사수익 인식 검토',
    dueDate: '2026-05-06',
    status: 'Done',
    description: '진행기준 적용 현장별 공사진행률 산정 적정성 검토',
    timeBudget: 6,
    timeSpent: 6,
  },
  {
    id: 'task-07',
    etId: 'et-2',
    title: '특수관계자 거래 대조',
    dueDate: '2026-05-09',
    status: 'In Progress',
    urgent: true,
    description: '계열사 간 내부거래 내역 식별 및 시장가격 비교 분석',
    timeBudget: 8,
    timeSpent: 4,
  },
  {
    id: 'task-08',
    etId: 'et-2',
    title: '미완성주택 재고자산 실사',
    dueDate: '2026-05-15',
    status: 'To-Do',
    description: '인천 송도 현장 미완성주택 현장 확인 및 원가 집계 대사',
    timeBudget: 10,
    timeSpent: 0,
  },
  {
    id: 'task-09',
    etId: 'et-2',
    title: 'PF 우발채무 검토',
    dueDate: '2026-05-21',
    status: 'To-Do',
    description: '프로젝트파이낸싱 보증 현황 파악 및 충당부채 설정 적정성 검토',
  },
  {
    id: 'task-10',
    etId: 'et-2',
    title: '준공공사 정산 검토',
    dueDate: '2026-05-28',
    status: 'To-Do',
    description: '당기 준공 현장 최종 정산내역 검토 및 손익 귀속 적정성 확인',
  },

  // ── C화학 PA (emerald) ────────────────────────────────────────────
  {
    id: 'task-11',
    etId: 'et-3',
    title: '영업권 손상 검토',
    dueDate: '2026-05-08',
    status: 'Done',
    description: '인수 사업부 현금창출단위 손상 징후 파악 및 회수가능액 산정 검토',
    timeBudget: 10,
    timeSpent: 9,
  },
  {
    id: 'task-12',
    etId: 'et-3',
    title: '취득원가 배분 (PPA) 작업',
    dueDate: '2026-05-13',
    status: 'In Progress',
    description: '유·무형자산 공정가치 평가 외부 전문가 보고서 검토',
    timeBudget: 16,
    timeSpent: 10,
  },
  {
    id: 'task-13',
    etId: 'et-3',
    title: '재고자산 평가 조정',
    dueDate: '2026-05-20',
    status: 'To-Do',
    description: '원재료·재공품·제품 단계별 저가법 평가 적정성 검토',
    timeBudget: 12,
    timeSpent: 0,
  },
  {
    id: 'task-14',
    etId: 'et-3',
    title: '환경부채 검토',
    dueDate: '2026-05-27',
    status: 'To-Do',
    description: '토양오염 복구 충당부채 추정 기초가정 합리성 검토',
  },

  // ── D물산 내부회계 (violet) ───────────────────────────────────────
  {
    id: 'task-15',
    etId: 'et-4',
    title: 'ITGC 통제 테스트',
    dueDate: '2026-05-05',
    status: 'Done',
    description: 'ERP 접근통제·변경관리·운영통제 설계 및 운영 효과성 평가',
    timeBudget: 6,
    timeSpent: 7,
  },
  {
    id: 'task-16',
    etId: 'et-4',
    title: '재무보고 프로세스 평가',
    dueDate: '2026-05-12',
    status: 'In Progress',
    urgent: true,
    description: '결산·공시 프로세스 내 핵심통제 운영현황 평가',
    timeBudget: 12,
    timeSpent: 5,
  },
  {
    id: 'task-17',
    etId: 'et-4',
    title: 'IT 시스템 접근권한 검토',
    dueDate: '2026-05-22',
    status: 'To-Do',
    description: '퇴직자·직무변경자 접근권한 적시 회수 여부 확인',
    timeBudget: 8,
    timeSpent: 0,
  },
  {
    id: 'task-18',
    etId: 'et-4',
    title: '내부회계관리제도 운영현황 평가',
    dueDate: '2026-05-29',
    status: 'To-Do',
    description: '중요 업무프로세스별 통제 운영 증빙 검토 및 미비점 집계',
  },

  // ── E바이오 IPO컨토 (amber) ───────────────────────────────────────
  {
    id: 'task-19',
    etId: 'et-5',
    title: '매출 Cut-off 테스트',
    dueDate: '2026-05-03',
    status: 'Done',
    description: '기말 전후 출하기록·세금계산서 발행일 대사를 통한 기간귀속 검증',
    timeBudget: 4,
    timeSpent: 3,
  },
  {
    id: 'task-20',
    etId: 'et-5',
    title: '조세공과금 검토',
    dueDate: '2026-05-10',
    status: 'Review Clear 필요',
    description: '이연법인세 계산 적정성 및 세무조정 항목 검토',
    timeBudget: 8,
    timeSpent: 8,
  },
  {
    id: 'task-21',
    etId: 'et-5',
    title: 'R&D 비용 자본화 검토',
    dueDate: '2026-05-16',
    status: 'To-Do',
    description: '임상 2·3상 개발비 자본화 요건 충족 여부 및 상각 방법 적정성 검토',
    timeBudget: 10,
    timeSpent: 2,
  },
  {
    id: 'task-22',
    etId: 'et-5',
    title: '임상시험비 회계처리 검토',
    dueDate: '2026-05-23',
    status: 'To-Do',
    description: 'CRO 계약 기반 임상비용 발생주의 적용 및 선급금 정산 검토',
    timeBudget: 6,
    timeSpent: 0,
  },
  {
    id: 'task-23',
    etId: 'et-5',
    title: '주식기준보상 검토',
    dueDate: '2026-05-30',
    status: 'To-Do',
    description: '스톡옵션 공정가치 산정 모형(Black-Scholes) 및 가득조건 검토',
  },
];

// ── Mock Users ────────────────────────────────────────────────────────────────
//
// Each user is assigned to a subset of ETs.  Tasks belong to the ET, not the
// user — two members of the same ET see identical tasks for that ET, but each
// user's "unified view" is scoped to their own assignment list.

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Gwany',
    role: 'A2',
    // A전자 기말감사 · C화학 PA · E바이오 IPO컨토  (3 ETs, 14 tasks)
    assignedEtIds: ['et-1', 'et-3', 'et-5'],
  },
  {
    id: 'user-2',
    name: '김지수',
    role: 'SA1',
    // A전자 기말감사 · B건설 반기검토 · D물산 내부회계  (3 ETs, 14 tasks)
    assignedEtIds: ['et-1', 'et-2', 'et-4'],
  },
  {
    id: 'user-3',
    name: '박서연',
    role: 'SM1',
    // B건설 · C화학 · D물산 · E바이오  (4 ETs, 18 tasks)
    assignedEtIds: ['et-2', 'et-3', 'et-4', 'et-5'],
  },
];

export const DEFAULT_USER = MOCK_USERS[0];
