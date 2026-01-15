/**
 * MerchantDocumentsPage Component
 *
 * A specialized view for studio owners to manage documents, primarily invoices.
 * Includes advanced filtering, status tracking, and easy download actions.
 */
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Search,
  Calendar as CalendarIcon,
  ChevronDown,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpDown,
  FileCheck,
  FileClock,
  ExternalLink
} from 'lucide-react';

import { useUserContext } from '@core/contexts';
import { useStudios } from '@shared/hooks';
import '../styles/_merchant-documents.scss';

// --- Types ---

type DocStatus = 'paid' | 'pending' | 'overdue' | 'draft';

interface Document {
  id: string;
  number: string;
  type: 'invoice' | 'credit_note' | 'receipt' | 'contract';
  studioName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: DocStatus;
  customerName: string;
}

// --- Mock Data ---

const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    type: 'invoice',
    studioName: 'אולפני רזוננס',
    amount: 1250,
    date: '2024-03-15',
    dueDate: '2024-03-30',
    status: 'paid',
    customerName: 'עידו לוי'
  },
  {
    id: '2',
    number: 'INV-2024-002',
    type: 'invoice',
    studioName: 'פולס סטודיו',
    amount: 840,
    date: '2024-03-10',
    dueDate: '2024-03-25',
    status: 'paid',
    customerName: 'שרה כהן'
  },
  {
    id: '3',
    number: 'INV-2024-003',
    type: 'invoice',
    studioName: 'אולפני רזוננס',
    amount: 2100,
    date: '2024-03-20',
    dueDate: '2024-04-05',
    status: 'pending',
    customerName: 'להקת "העננים"'
  },
  {
    id: '4',
    number: 'INV-2024-004',
    type: 'invoice',
    studioName: 'קרימזון ביט',
    amount: 450,
    date: '2024-03-18',
    dueDate: '2024-04-02',
    status: 'pending',
    customerName: 'יוסי מזרחי'
  },
  {
    id: '5',
    number: 'INV-2024-005',
    type: 'invoice',
    studioName: 'אולפני רזוננס',
    amount: 1800,
    date: '2024-02-28',
    dueDate: '2024-03-14',
    status: 'overdue',
    customerName: 'פרויקט גמר - דנה'
  },
  {
    id: '6',
    number: 'REC-2024-012',
    type: 'receipt',
    studioName: 'פולס סטודיו',
    amount: 1200,
    date: '2024-03-12',
    dueDate: '2024-03-12',
    status: 'paid',
    customerName: 'אביב גפן'
  },
  {
    id: '7',
    number: 'CTR-2024-001',
    type: 'contract',
    studioName: 'אולפני רזוננס',
    amount: 0,
    date: '2024-01-15',
    dueDate: '2024-01-15',
    status: 'paid',
    customerName: 'הפקות בע"מ'
  },
  {
    id: '8',
    number: 'INV-2024-006',
    type: 'invoice',
    studioName: 'קרימזון ביט',
    amount: 950,
    date: '2024-03-22',
    dueDate: '2024-04-06',
    status: 'draft',
    customerName: 'מיכל אברהם'
  }
];

const STATUSES: { value: DocStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'כל הסטטוסים' },
  { value: 'paid', label: 'שולם' },
  { value: 'pending', label: 'ממתין' },
  { value: 'overdue', label: 'באיחור' },
  { value: 'draft', label: 'טיוטה' }
];

// --- Sub-components ---

const StatusBadge = ({ status }: { status: DocStatus }) => {
  const configs = {
    paid: { color: 'status-badge--paid', icon: CheckCircle2, label: 'שולם' },
    pending: { color: 'status-badge--pending', icon: Clock, label: 'ממתין' },
    overdue: { color: 'status-badge--overdue', icon: AlertCircle, label: 'באיחור' },
    draft: { color: 'status-badge--draft', icon: FileText, label: 'טיוטה' }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`status-badge ${config.color}`}>
      <Icon size={12} />
      <span>{config.label}</span>
    </div>
  );
};

const MerchantDocumentsPage: React.FC = () => {
  const { i18n } = useTranslation('merchantDocs');
  const { user } = useUserContext();
  const { data: studios = [] } = useStudios();

  const [search, setSearch] = useState('');
  const [selectedStudio, setSelectedStudio] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<DocStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<keyof Document>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Get user's studios
  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return studios.filter((studio) => studio.createdBy === user._id);
  }, [studios, user?._id]);

  // Helper to extract localized string from multilingual object
  const getLocalizedName = (name: string | { en?: string; he?: string } | undefined): string => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[i18n.language as 'en' | 'he'] || name.he || name.en || '';
  };

  // Studio options for filter
  const studioOptions = useMemo(() => {
    return [
      { value: 'all', label: 'כל האולפנים' },
      ...userStudios.map((s) => ({ value: s._id, label: getLocalizedName(s.name) }))
    ];
  }, [userStudios, i18n.language]);

  // Filter and sort documents
  const filteredDocs = useMemo(() => {
    return MOCK_DOCUMENTS.filter((doc) => {
      const matchesSearch =
        doc.number.toLowerCase().includes(search.toLowerCase()) ||
        doc.customerName.toLowerCase().includes(search.toLowerCase());
      const matchesStudio = selectedStudio === 'all' || doc.studioName === selectedStudio;
      const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
      return matchesSearch && matchesStudio && matchesStatus;
    }).sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [search, selectedStudio, selectedStatus, sortBy, sortOrder]);

  // Calculate stats
  const stats = useMemo(() => {
    const paidDocs = MOCK_DOCUMENTS.filter((d) => d.status === 'paid');
    const pendingDocs = MOCK_DOCUMENTS.filter((d) => d.status === 'pending');
    const overdueDocs = MOCK_DOCUMENTS.filter((d) => d.status === 'overdue');

    return {
      totalRevenue: paidDocs.reduce((sum, d) => sum + d.amount, 0),
      pendingAmount: pendingDocs.reduce((sum, d) => sum + d.amount, 0),
      overdueAmount: overdueDocs.reduce((sum, d) => sum + d.amount, 0),
      totalDocs: MOCK_DOCUMENTS.length
    };
  }, []);

  const toggleSort = (key: keyof Document) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="merchant-documents">
      {/* Header */}
      <div className="merchant-documents__header">
        <div className="merchant-documents__title-section">
          <div className="merchant-documents__title-row">
            <FileText size={28} className="merchant-documents__icon" />
            <h1 className="merchant-documents__title">ניהול מסמכים</h1>
          </div>
          <p className="merchant-documents__subtitle">נהל את החשבוניות, הקבלות והחוזים של האולפנים שלך במקום אחד.</p>
        </div>

        <div className="merchant-documents__actions">
          <button className="merchant-documents__btn merchant-documents__btn--secondary">
            <Download size={18} />
            ייצוא דוח חודשי
          </button>
          <button className="merchant-documents__btn merchant-documents__btn--primary">חשבונית חדשה</button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="merchant-documents__stats">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary">
            <FileCheck size={20} />
          </div>
          <div className="stat-card__value">₪{stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-card__label">סה"כ הכנסות (חודש)</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--warning">
            <FileClock size={20} />
          </div>
          <div className="stat-card__value">₪{stats.pendingAmount.toLocaleString()}</div>
          <div className="stat-card__label">ממתין לתשלום</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--danger">
            <AlertCircle size={20} />
          </div>
          <div className="stat-card__value">₪{stats.overdueAmount.toLocaleString()}</div>
          <div className="stat-card__label">באיחור</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--neutral">
            <FileText size={20} />
          </div>
          <div className="stat-card__value">{stats.totalDocs}</div>
          <div className="stat-card__label">מסמכים שהופקו</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="merchant-documents__filters">
        <div className="merchant-documents__filters-grid">
          {/* Search */}
          <div className="filter-input">
            <Search className="filter-input__icon" size={18} />
            <input
              type="text"
              placeholder="חפש לפי מספר או לקוח..."
              className="filter-input__field"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Studio Filter */}
          <div className="filter-select">
            <select
              className="filter-select__field"
              value={selectedStudio}
              onChange={(e) => setSelectedStudio(e.target.value)}
            >
              {studioOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="filter-select__icon" size={16} />
          </div>

          {/* Status Filter */}
          <div className="filter-select">
            <select
              className="filter-select__field"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as DocStatus | 'all')}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="filter-select__icon" size={16} />
          </div>

          {/* Date Range */}
          <button className="filter-date-btn">
            <span className="filter-date-btn__content">
              <CalendarIcon size={16} />
              30 הימים האחרונים
            </span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="merchant-documents__table-container">
        <div className="merchant-documents__table-scroll">
          <table className="documents-table">
            <thead>
              <tr>
                <th className="documents-table__th" onClick={() => toggleSort('number')}>
                  <div className="documents-table__th-content">
                    מסמך
                    <ArrowUpDown size={12} className={sortBy === 'number' ? 'active' : ''} />
                  </div>
                </th>
                <th className="documents-table__th" onClick={() => toggleSort('customerName')}>
                  <div className="documents-table__th-content">
                    לקוח
                    <ArrowUpDown size={12} className={sortBy === 'customerName' ? 'active' : ''} />
                  </div>
                </th>
                <th className="documents-table__th" onClick={() => toggleSort('date')}>
                  <div className="documents-table__th-content">
                    תאריך
                    <ArrowUpDown size={12} className={sortBy === 'date' ? 'active' : ''} />
                  </div>
                </th>
                <th className="documents-table__th documents-table__th--amount" onClick={() => toggleSort('amount')}>
                  <div className="documents-table__th-content">
                    סכום
                    <ArrowUpDown size={12} className={sortBy === 'amount' ? 'active' : ''} />
                  </div>
                </th>
                <th className="documents-table__th">סטטוס</th>
                <th className="documents-table__th documents-table__th--actions">פעולות</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                      className="documents-table__row"
                    >
                      <td className="documents-table__td">
                        <div className="documents-table__doc-info">
                          <span className="documents-table__doc-number">{doc.number}</span>
                          <span className="documents-table__doc-studio">{doc.studioName}</span>
                        </div>
                      </td>
                      <td className="documents-table__td">
                        <span className="documents-table__customer">{doc.customerName}</span>
                      </td>
                      <td className="documents-table__td">
                        <div className="documents-table__date-info">
                          <span className="documents-table__date">{doc.date}</span>
                          <span className="documents-table__due-date">לתשלום עד: {doc.dueDate}</span>
                        </div>
                      </td>
                      <td className="documents-table__td documents-table__td--amount">
                        <span className="documents-table__amount">₪{doc.amount.toLocaleString()}</span>
                      </td>
                      <td className="documents-table__td">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="documents-table__td documents-table__td--actions">
                        <div className="documents-table__actions">
                          <button className="documents-table__action-btn" title="הורדה">
                            <Download size={18} />
                          </button>
                          <button className="documents-table__action-btn" title="צפייה">
                            <ExternalLink size={18} />
                          </button>
                          <button className="documents-table__action-btn" title="עוד">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="documents-table__empty">
                      לא נמצאו מסמכים התואמים את החיפוש
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Load More */}
      <div className="merchant-documents__load-more">
        <button className="merchant-documents__load-more-btn">טען מסמכים נוספים</button>
      </div>
    </div>
  );
};

export default MerchantDocumentsPage;
