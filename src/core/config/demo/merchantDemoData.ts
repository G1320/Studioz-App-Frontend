/**
 * Demo/Mock data for merchant dashboard
 * Used for demonstration purposes when real data is not available
 */

import type { BillingCycle, CurrentFeesResponse } from '@shared/services/billing-service';

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
export const DEMO_DOCUMENTS: DemoDocument[] = [
  {
    id: '1',
    number: 'INV-2026-001',
    type: 'invoice',
    studioName: '1320',
    amount: 1250,
    date: '2026-04-10',
    dueDate: '2026-04-25',
    status: 'paid',
    customerName: 'רונן דהן'
  },
  {
    id: '2',
    number: 'INV-2026-002',
    type: 'invoice',
    studioName: '1320',
    amount: 840,
    date: '2026-04-08',
    dueDate: '2026-04-22',
    status: 'paid',
    customerName: 'שרי גולן'
  },
  {
    id: '3',
    number: 'INV-2026-003',
    type: 'invoice',
    studioName: '1320',
    amount: 2100,
    date: '2026-04-05',
    dueDate: '2026-04-20',
    status: 'paid',
    customerName: "להקת 'השכנים'"
  },
  {
    id: '4',
    number: 'INV-2026-004',
    type: 'invoice',
    studioName: '1320',
    amount: 450,
    date: '2026-04-03',
    dueDate: '2026-04-18',
    status: 'paid',
    customerName: 'גיא מרגלית'
  },
  {
    id: '5',
    number: 'INV-2026-005',
    type: 'invoice',
    studioName: '1320',
    amount: 1800,
    date: '2026-03-28',
    dueDate: '2026-04-12',
    status: 'paid',
    customerName: 'נועה קירל'
  },
  {
    id: '6',
    number: 'REC-2026-012',
    type: 'receipt',
    studioName: '1320',
    amount: 1200,
    date: '2026-04-01',
    dueDate: '2026-04-01',
    status: 'paid',
    customerName: 'אביב גפן'
  },
  {
    id: '7',
    number: 'CTR-2026-001',
    type: 'contract',
    studioName: '1320',
    amount: 0,
    date: '2026-03-20',
    dueDate: '2026-03-20',
    status: 'paid',
    customerName: 'הפקות בע"מ'
  },
  {
    id: '8',
    number: 'INV-2026-006',
    type: 'invoice',
    studioName: '1320',
    amount: 950,
    date: '2026-04-06',
    dueDate: '2026-04-21',
    status: 'paid',
    customerName: 'מיכל אברהם'
  },
  {
    id: '9',
    number: 'INV-2026-007',
    type: 'invoice',
    studioName: '1320',
    amount: 1600,
    date: '2026-04-11',
    dueDate: '2026-04-26',
    status: 'pending',
    customerName: 'אלון שפירא'
  },
  {
    id: '10',
    number: 'INV-2026-008',
    type: 'invoice',
    studioName: '1320',
    amount: 720,
    date: '2026-04-09',
    dueDate: '2026-04-24',
    status: 'pending',
    customerName: 'רוני בן דוד'
  },
  {
    id: '11',
    number: 'INV-2026-009',
    type: 'invoice',
    studioName: '1320',
    amount: 3200,
    date: '2026-03-15',
    dueDate: '2026-03-30',
    status: 'overdue',
    customerName: 'הפקות צליל בע"מ'
  },
  {
    id: '12',
    number: 'INV-2026-010',
    type: 'invoice',
    studioName: '1320',
    amount: 500,
    date: '2026-04-12',
    dueDate: '2026-04-27',
    status: 'draft',
    customerName: 'תומר הראל'
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
    totalTransactionAmount: 12450,
    totalFeeAmount: 560.25,
    feeCount: 18,
    feePercentage: 0.045,
    feeModel: 'tiered',
    tierBreakdown: [
      { tierIndex: 0, label: '5%', rate: 0.05, amountInBand: 5000, feeAmount: 250 },
      { tierIndex: 1, label: '4%', rate: 0.04, amountInBand: 7450, feeAmount: 298 },
    ],
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
    totalTransactionAmount: 9800,
    totalFeeAmount: 490,
    feeCount: 14,
    feePercentage: 0.05,
    feeModel: 'tiered',
    tierBreakdown: [
      { tierIndex: 0, label: '5%', rate: 0.05, amountInBand: 5000, feeAmount: 250 },
      { tierIndex: 1, label: '4%', rate: 0.04, amountInBand: 4800, feeAmount: 192 },
    ],
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
    totalTransactionAmount: 8200,
    totalFeeAmount: 410,
    feeCount: 11,
    feePercentage: 0.05,
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
    totalTransactionAmount: 11200,
    totalFeeAmount: 504,
    feeCount: 16,
    feePercentage: 0.045,
    feeModel: 'tiered',
    tierBreakdown: [
      { tierIndex: 0, label: '5%', rate: 0.05, amountInBand: 5000, feeAmount: 250 },
      { tierIndex: 1, label: '4%', rate: 0.04, amountInBand: 6200, feeAmount: 248 },
    ],
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
    totalTransactionAmount: 7500,
    totalFeeAmount: 375,
    feeCount: 10,
    feePercentage: 0.05,
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
  feePercentage: 0.045,
  totalFeeAmount: 312.75,
  totalTransactionAmount: 6950,
  count: 8,
  fees: [],
  feeTier: {
    tierIndex: 1,
    tierLabel: '4%',
    effectiveRate: 0.045,
    breakdown: [
      { tierIndex: 0, label: '5%', rate: 0.05, amountInBand: 5000, feeAmount: 250 },
      { tierIndex: 1, label: '4%', rate: 0.04, amountInBand: 1950, feeAmount: 78 },
    ]
  },
  nextTier: {
    thresholdAmount: 15000,
    currentAmount: 6950,
    amountToGo: 8050,
    nextRate: 0.035,
    nextLabel: '3.5%'
  },
  tiers: [
    { maxAmount: 5000, rate: 0.05, label: '5%' },
    { maxAmount: 15000, rate: 0.04, label: '4%' },
    { maxAmount: null, rate: 0.035, label: '3.5%' }
  ]
};
