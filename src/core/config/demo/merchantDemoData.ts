/**
 * Demo/Mock data for merchant dashboard
 * Used for demonstration purposes when real data is not available.
 * Only shown to the demo account (DEMO_USER_ID); all other users see real API data.
 */

import type { BillingCycle, CurrentFeesResponse } from '@shared/services/billing-service';

export const DEMO_USER_ID = '6645d783a319b216a0277e85';

export interface DemoClient {
  id: string;
  name: string;
  role: string;
  totalSpent: number;
  lastVisit: string;
  avatarUrl?: string;
}

export interface DemoDocument {
  id: string;
  number: string;
  type: 'invoice' | 'credit_note' | 'receipt' | 'contract';
  studioName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  customerName: string;
}

export interface DemoChartData {
  monthly: number[];
  weekly: number[];
  daily: number[];
}

// Demo clients for merchant stats page
export const DEMO_CLIENTS: DemoClient[] = [
  {
    id: '1',
    name: 'רונן דהן',
    role: 'מפיק מוזיקלי',
    totalSpent: 12450,
    lastVisit: 'אתמול',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    name: 'שרי גולן',
    role: 'זמרת יוצרת',
    totalSpent: 8320,
    lastVisit: 'לפני יומיים',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '3',
    name: "להקת 'השכנים'",
    role: 'הרכב רוק',
    totalSpent: 5600,
    lastVisit: '15/03/2026'
  },
  {
    id: '4',
    name: 'גיא מרגלית',
    role: 'פודקאסטר',
    totalSpent: 4100,
    lastVisit: '10/03/2026',
    avatarUrl: 'https://randomuser.me/api/portraits/men/86.jpg'
  },
  {
    id: '5',
    name: 'נועה קירל',
    role: 'אמנית',
    totalSpent: 3200,
    lastVisit: '05/03/2026',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

// Demo documents for merchant documents page (dates in recent window so they appear in default 30-day filter)
// Screenshot clock is fixed at 2026-09-22 — keep invoice dates within the prior 30 days.
export const DEMO_DOCUMENTS: DemoDocument[] = [
  {
    id: '1',
    number: 'INV-2026-0922',
    type: 'invoice',
    studioName: 'Tempo Studios',
    amount: 3200,
    date: '2026-09-22',
    dueDate: '2026-10-06',
    status: 'pending',
    customerName: 'יעל כהן'
  },
  {
    id: '2',
    number: 'INV-2026-0920',
    type: 'invoice',
    studioName: 'Tempo Studios',
    amount: 2800,
    date: '2026-09-20',
    dueDate: '2026-09-30',
    status: 'paid',
    customerName: 'דניאל לוי'
  },
  {
    id: '3',
    number: 'INV-2026-0918',
    type: 'invoice',
    studioName: 'Tempo Studios',
    amount: 1600,
    date: '2026-09-18',
    dueDate: '2026-09-28',
    status: 'paid',
    customerName: 'נועה ברג'
  },
  {
    id: '4',
    number: 'INV-2026-0915',
    type: 'invoice',
    studioName: 'Tempo Studios',
    amount: 950,
    date: '2026-09-15',
    dueDate: '2026-09-25',
    status: 'pending',
    customerName: 'איתן שרעבי'
  },
  {
    id: '5',
    number: 'INV-2026-0912',
    type: 'invoice',
    studioName: 'Tempo Studios',
    amount: 2100,
    date: '2026-09-12',
    dueDate: '2026-09-22',
    status: 'paid',
    customerName: 'שירה אלון'
  },
  {
    id: '6',
    number: 'REC-2026-0910',
    type: 'receipt',
    studioName: 'Tempo Studios',
    amount: 1200,
    date: '2026-09-10',
    dueDate: '2026-09-10',
    status: 'paid',
    customerName: 'אביב גפן'
  },
  {
    id: '7',
    number: 'INV-2026-0908',
    type: 'invoice',
    studioName: 'Tempo Studios',
    amount: 720,
    date: '2026-09-08',
    dueDate: '2026-09-18',
    status: 'overdue',
    customerName: 'הפקות צליל בע״מ'
  },
  {
    id: '8',
    number: 'INV-2026-0905',
    type: 'invoice',
    studioName: 'Tempo Studios',
    amount: 1450,
    date: '2026-09-05',
    dueDate: '2026-09-19',
    status: 'paid',
    customerName: 'אמיר חדד'
  },
  {
    id: '9',
    number: 'INV-2026-0903',
    type: 'invoice',
    studioName: 'Tempo Studios',
    amount: 840,
    date: '2026-09-03',
    dueDate: '2026-09-17',
    status: 'paid',
    customerName: 'מיכל אברהם'
  },
  {
    id: '10',
    number: 'INV-2026-0901',
    type: 'invoice',
    studioName: 'Tempo Studios',
    amount: 1800,
    date: '2026-09-01',
    dueDate: '2026-09-15',
    status: 'paid',
    customerName: "להקת 'השכנים'"
  },
  {
    id: '11',
    number: 'INV-2026-0828',
    type: 'invoice',
    studioName: 'Tempo Studios',
    amount: 500,
    date: '2026-08-28',
    dueDate: '2026-09-11',
    status: 'draft',
    customerName: 'תומר הראל'
  },
  {
    id: '12',
    number: 'INV-2026-0825',
    type: 'invoice',
    studioName: 'Tempo Studios',
    amount: 1250,
    date: '2026-08-25',
    dueDate: '2026-09-08',
    status: 'paid',
    customerName: 'רונן דהן'
  }
];

// Demo revenue chart data (values are percentages, multiplied by 150 for display as currency)
export const DEMO_CHART_DATA: DemoChartData = {
  monthly: [65, 45, 75, 55, 85, 70, 95, 80, 60, 75, 90, 100],
  weekly: [40, 65, 50, 85, 60, 90, 75],
  daily: [30, 45, 35, 60, 40, 75, 50, 65, 55, 80, 70, 95, 60, 85, 75, 90, 65, 80, 70, 85, 60, 75, 55, 70]
};

// Document status options for filtering
export const DOCUMENT_STATUS_OPTIONS = [
  { value: 'all', labelEn: 'All Statuses', labelHe: 'כל הסטטוסים' },
  { value: 'paid', labelEn: 'Paid', labelHe: 'שולם' },
  { value: 'pending', labelEn: 'Pending', labelHe: 'ממתין' },
  { value: 'overdue', labelEn: 'Overdue', labelHe: 'באיחור' },
  { value: 'draft', labelEn: 'Draft', labelHe: 'טיוטה' }
] as const;

// ─── Billing Demo Data ──────────────────────────────────────────

export const DEMO_BILLING_HISTORY: BillingCycle[] = [
  {
    _id: 'demo-cycle-1',
    vendorId: 'demo-vendor',
    period: '2026-03',
    totalTransactionAmount: 22400,
    totalFeeAmount: 2016,
    feeCount: 18,
    feePercentage: 0.09,
    feeModel: 'flat',
    status: 'paid',
    chargedAt: '2026-04-01T08:00:00.000Z',
    retryCount: 0,
    createdAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-04-01T08:00:00.000Z'
  },
  {
    _id: 'demo-cycle-2',
    vendorId: 'demo-vendor',
    period: '2026-02',
    totalTransactionAmount: 18300,
    totalFeeAmount: 1647,
    feeCount: 14,
    feePercentage: 0.09,
    feeModel: 'flat',
    status: 'paid',
    chargedAt: '2026-03-01T08:00:00.000Z',
    retryCount: 0,
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-01T08:00:00.000Z'
  },
  {
    _id: 'demo-cycle-3',
    vendorId: 'demo-vendor',
    period: '2026-01',
    totalTransactionAmount: 12400,
    totalFeeAmount: 1116,
    feeCount: 11,
    feePercentage: 0.09,
    feeModel: 'flat',
    status: 'paid',
    chargedAt: '2026-02-01T08:00:00.000Z',
    retryCount: 0,
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-02-01T08:00:00.000Z'
  },
  {
    _id: 'demo-cycle-4',
    vendorId: 'demo-vendor',
    period: '2025-12',
    totalTransactionAmount: 45000,
    totalFeeAmount: 4050,
    feeCount: 16,
    feePercentage: 0.09,
    feeModel: 'flat',
    status: 'paid',
    chargedAt: '2026-01-01T08:00:00.000Z',
    retryCount: 0,
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: '2026-01-01T08:00:00.000Z'
  },
  {
    _id: 'demo-cycle-5',
    vendorId: 'demo-vendor',
    period: '2025-11',
    totalTransactionAmount: 9800,
    totalFeeAmount: 882,
    feeCount: 10,
    feePercentage: 0.09,
    feeModel: 'flat',
    status: 'paid',
    chargedAt: '2025-12-01T08:00:00.000Z',
    retryCount: 0,
    createdAt: '2025-12-01T08:00:00.000Z',
    updatedAt: '2025-12-01T08:00:00.000Z'
  }
];

export const DEMO_CURRENT_FEES: CurrentFeesResponse = {
  period: '2026-04',
  feePercentage: 0.09,
  totalFeeAmount: 625.5,
  totalTransactionAmount: 6950,
  count: 8,
  fees: []
};
