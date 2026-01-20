/**
 * Demo/Mock data for merchant dashboard
 * Used for demonstration purposes when real data is not available
 */

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
    lastVisit: '15/01/2026'
  },
  {
    id: '4',
    name: 'גיא מרגלית',
    role: 'פודקאסטר',
    totalSpent: 4100,
    lastVisit: '10/01/2026',
    avatarUrl: 'https://randomuser.me/api/portraits/men/86.jpg'
  },
  {
    id: '5',
    name: 'נועה קירל',
    role: 'אמנית',
    totalSpent: 3200,
    lastVisit: '05/01/2026',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

// Demo documents for merchant documents page
export const DEMO_DOCUMENTS: DemoDocument[] = [
  {
    id: '1',
    number: 'INV-2026-001',
    type: 'invoice',
    studioName: '1320',
    amount: 1250,
    date: '2026-01-15',
    dueDate: '2026-01-30',
    status: 'paid',
    customerName: 'עידו לוי'
  },
  {
    id: '2',
    number: 'INV-2026-002',
    type: 'invoice',
    studioName: '1320',
    amount: 840,
    date: '2026-01-10',
    dueDate: '2026-01-25',
    status: 'paid',
    customerName: 'שרה כהן'
  },
  {
    id: '3',
    number: 'INV-2026-003',
    type: 'invoice',
    studioName: '1320',
    amount: 2100,
    date: '2026-01-18',
    dueDate: '2026-02-05',
    status: 'paid',
    customerName: 'להקת "העננים"'
  },
  {
    id: '4',
    number: 'INV-2026-004',
    type: 'invoice',
    studioName: '1320',
    amount: 450,
    date: '2026-01-16',
    dueDate: '2026-02-02',
    status: 'paid',
    customerName: 'יוסי מזרחי'
  },
  {
    id: '5',
    number: 'INV-2026-005',
    type: 'invoice',
    studioName: '1320',
    amount: 1800,
    date: '2025-12-28',
    dueDate: '2026-01-14',
    status: 'paid',
    customerName: 'פרויקט גמר - דנה'
  },
  {
    id: '6',
    number: 'REC-2026-012',
    type: 'receipt',
    studioName: '1320',
    amount: 1200,
    date: '2026-01-12',
    dueDate: '2026-01-12',
    status: 'paid',
    customerName: 'אביב גפן'
  },
  {
    id: '7',
    number: 'CTR-2026-001',
    type: 'contract',
    studioName: '1320',
    amount: 0,
    date: '2026-01-05',
    dueDate: '2026-01-05',
    status: 'paid',
    customerName: 'הפקות בע"מ'
  },
  {
    id: '8',
    number: 'INV-2026-006',
    type: 'invoice',
    studioName: '1320',
    amount: 950,
    date: '2026-01-19',
    dueDate: '2026-02-06',
    status: 'paid',
    customerName: 'מיכל אברהם'
  }
];

// Demo revenue chart data (values are percentages, multiplied by 150 for display as currency)
export const DEMO_CHART_DATA: DemoChartData = {
  monthly: [65, 45, 75, 55, 85, 70, 95, 80, 60, 75, 90, 100], // 12 months
  weekly: [40, 65, 50, 85, 60, 90, 75], // 7 days
  daily: [30, 45, 35, 60, 40, 75, 50, 65, 55, 80, 70, 95, 60, 85, 75, 90, 65, 80, 70, 85, 60, 75, 55, 70] // 24 hours
};

// Document status options for filtering
export const DOCUMENT_STATUS_OPTIONS = [
  { value: 'all', labelEn: 'All Statuses', labelHe: 'כל הסטטוסים' },
  { value: 'paid', labelEn: 'Paid', labelHe: 'שולם' },
  { value: 'pending', labelEn: 'Pending', labelHe: 'ממתין' },
  { value: 'overdue', labelEn: 'Overdue', labelHe: 'באיחור' },
  { value: 'draft', labelEn: 'Draft', labelHe: 'טיוטה' }
] as const;
