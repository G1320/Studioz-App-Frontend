/**
 * MerchantDocumentsPage Component
 *
 * A specialized view for studio owners to manage documents, primarily invoices.
 * Includes advanced filtering, status tracking, and easy download actions.
 * Syncs filter state with URL params for shareable/bookmarkable views.
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import {
  FileText,
  Download,
  Search,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpDown,
  FileCheck,
  FileClock,
  ExternalLink
} from 'lucide-react';

import { useUserContext } from '@core/contexts';
import { useStudios, useMerchantDocuments } from '@shared/hooks';
import { MerchantDocument, DocStatus, httpService } from '@shared/services';
import { NewInvoiceModal, DocumentActionsDropdown, QuickChargeModal } from '../components';
import { DateRangePicker, type DateRange } from '../../merchant-stats/components';
import '../styles/_merchant-documents.scss';

// --- Sub-components ---

const StatusBadge = React.memo(({ status, t }: { status: DocStatus; t: (key: string) => string }) => {
  const configs = {
    paid: { color: 'status-badge--paid', icon: CheckCircle2 },
    pending: { color: 'status-badge--pending', icon: Clock },
    overdue: { color: 'status-badge--overdue', icon: AlertCircle },
    draft: { color: 'status-badge--draft', icon: FileText }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`status-badge ${config.color}`}>
      <Icon size={12} />
      <span>{t(`status.${status}`)}</span>
    </div>
  );
});

// Memoized table row to prevent unnecessary re-renders
const DocumentRow = React.memo(
  ({
    doc,
    onDownload,
    onView,
    onSendEmail,
    onDuplicate,
    onVoid,
    onPrint,
    t
  }: {
    doc: MerchantDocument;
    onDownload: (doc: MerchantDocument) => void;
    onView: (doc: MerchantDocument) => void;
    onSendEmail: (doc: MerchantDocument) => void;
    onDuplicate: (doc: MerchantDocument) => void;
    onVoid: (doc: MerchantDocument) => void;
    onPrint: (doc: MerchantDocument) => void;
    t: (key: string) => string;
  }) => (
    <motion.tr
      key={doc.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
      <td className="documents-table__td documents-table__td--date">
        <div className="documents-table__date-info">
          <span className="documents-table__date">{doc.date}</span>
          <span className="documents-table__due-date">
            {t('table.dueDate')} {doc.dueDate}
          </span>
        </div>
      </td>
      <td className="documents-table__td documents-table__td--amount">
        <span className="documents-table__amount">₪{doc.amount.toLocaleString()}</span>
      </td>
      <td className="documents-table__td documents-table__td--status">
        <StatusBadge status={doc.status} t={t} />
      </td>
      <td className="documents-table__td documents-table__td--actions">
        <div className="documents-table__actions">
          <button
            className="documents-table__action-btn"
            title={t('actions.download')}
            onClick={() => onDownload(doc)}
            disabled={!doc.documentUrl}
          >
            <Download size={18} />
          </button>
          <button
            className="documents-table__action-btn"
            title={t('actions.view')}
            onClick={() => onView(doc)}
            disabled={!doc.documentUrl}
          >
            <ExternalLink size={18} />
          </button>
          <DocumentActionsDropdown
            document={doc}
            onView={onView}
            onDownload={onDownload}
            onSendEmail={onSendEmail}
            onDuplicate={onDuplicate}
            onVoid={onVoid}
            onPrint={onPrint}
          />
        </div>
      </td>
    </motion.tr>
  )
);

const MerchantDocumentsPage: React.FC = () => {
  const { t, i18n } = useTranslation('merchantDocs');
  const { user } = useUserContext();
  const { data: studios = [] } = useStudios();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params or defaults
  const getInitialDateRange = (): DateRange => {
    const startParam = searchParams.get('startDate');
    const endParam = searchParams.get('endDate');
    const labelParam = searchParams.get('dateLabel');

    if (startParam && endParam) {
      return {
        startDate: dayjs(startParam).toDate(),
        endDate: dayjs(endParam).toDate(),
        label: labelParam || t('filters.customRange')
      };
    }
    return {
      startDate: dayjs().subtract(30, 'day').toDate(),
      endDate: dayjs().toDate(),
      label: t('filters.last30Days', '30 הימים האחרונים')
    };
  };

  // Filter states - initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedStudio, setSelectedStudio] = useState(searchParams.get('studio') || 'all');
  const [selectedStatus, setSelectedStatus] = useState<DocStatus | 'all'>(
    (searchParams.get('status') as DocStatus | 'all') || 'all'
  );
  const [sortBy, setSortBy] = useState<keyof MerchantDocument>(
    (searchParams.get('sortBy') as keyof MerchantDocument) || 'date'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  );
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [dateRange, setDateRange] = useState<DateRange>(getInitialDateRange);

  // Sync state to URL params (preserving parent params like 'tab')
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);

        // Clear document-specific params first, then set new values
        const docParams = [
          'search',
          'studio',
          'status',
          'sortBy',
          'sortOrder',
          'page',
          'startDate',
          'endDate',
          'dateLabel'
        ];
        docParams.forEach((p) => params.delete(p));

        if (search) params.set('search', search);
        if (selectedStudio !== 'all') params.set('studio', selectedStudio);
        if (selectedStatus !== 'all') params.set('status', selectedStatus);
        if (sortBy !== 'date') params.set('sortBy', sortBy);
        if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
        if (page > 1) params.set('page', String(page));

        // Always include date range
        params.set('startDate', dayjs(dateRange.startDate).format('YYYY-MM-DD'));
        params.set('endDate', dayjs(dateRange.endDate).format('YYYY-MM-DD'));
        if (dateRange.label !== '30 הימים האחרונים') {
          params.set('dateLabel', dateRange.label);
        }

        return params;
      },
      { replace: true }
    );
  }, [search, selectedStudio, selectedStatus, sortBy, sortOrder, page, dateRange, setSearchParams]);

  // Modal states
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isQuickChargeOpen, setIsQuickChargeOpen] = useState(false);

  // Fetch documents using new hook
  const {
    data: documentsData,
    isLoading,
    refetch
  } = useMerchantDocuments({
    status: selectedStatus,
    studioId: selectedStudio,
    search,
    page,
    limit: 50,
    startDate: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
    endDate: dayjs(dateRange.endDate).format('YYYY-MM-DD')
  });

  // Get user's studios
  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return studios.filter((studio) => studio.createdBy === user._id);
  }, [studios, user?._id]);

  // Helper to extract localized string from multilingual object
  const getLocalizedName = useCallback(
    (name: string | { en?: string; he?: string } | undefined): string => {
      if (!name) return '';
      if (typeof name === 'string') return name;
      return name[i18n.language as 'en' | 'he'] || name.he || name.en || '';
    },
    [i18n.language]
  );

  // Studio options for filter
  const studioOptions = useMemo(() => {
    return [
      { value: 'all', label: t('filters.allStudios') },
      ...userStudios.map((s) => ({ value: s._id, label: getLocalizedName(s.name) }))
    ];
  }, [userStudios, getLocalizedName, t]);

  // Status options for filter
  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('status.all') },
      { value: 'paid', label: t('status.paid') },
      { value: 'pending', label: t('status.pending') },
      { value: 'overdue', label: t('status.overdue') },
      { value: 'draft', label: t('status.draft') }
    ],
    [t]
  );

  // Sort documents locally (filtering is done by API/hook)
  const sortedDocs = useMemo(() => {
    if (!documentsData?.documents) return [];

    return [...documentsData.documents].sort((a, b) => {
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
  }, [documentsData?.documents, sortBy, sortOrder]);

  const stats = documentsData?.stats || {
    totalRevenue: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    totalDocs: 0
  };

  const toggleSort = useCallback(
    (key: keyof MerchantDocument) => {
      if (sortBy === key) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(key);
        setSortOrder('desc');
      }
    },
    [sortBy, sortOrder]
  );

  // Document actions
  const handleViewDocument = useCallback((doc: MerchantDocument) => {
    if (doc.documentUrl) {
      window.open(doc.documentUrl, '_blank');
    }
  }, []);

  const handleDownloadDocument = useCallback((doc: MerchantDocument) => {
    if (doc.documentUrl) {
      const link = document.createElement('a');
      link.href = doc.documentUrl;
      link.download = `${doc.number}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  const handlePrintDocument = useCallback((doc: MerchantDocument) => {
    if (doc.documentUrl) {
      const printWindow = window.open(doc.documentUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  }, []);

  const handleSendEmail = useCallback(
    async (doc: MerchantDocument) => {
      if (!doc.customerEmail) {
        alert(t('alerts.noEmail'));
        return;
      }
      try {
        await httpService.post('/emails/send-document', {
          documentId: doc.id,
          email: doc.customerEmail,
          documentUrl: doc.documentUrl,
          documentNumber: doc.number
        });
        alert(t('alerts.emailSent'));
      } catch (error) {
        console.error('Failed to send email:', error);
        alert(t('alerts.emailError'));
      }
    },
    [t]
  );

  const handleDuplicateDocument = useCallback(() => {
    // Open new invoice modal (could be pre-filled with data from this document in future)
    setIsNewInvoiceOpen(true);
  }, []);

  const handleVoidDocument = useCallback(
    async (doc: MerchantDocument) => {
      if (!confirm(t('alerts.cancelConfirm'))) return;

      try {
        await httpService.post(`/invoices/void/${doc.externalId}`);
        refetch();
        alert(t('alerts.cancelSuccess'));
      } catch (error) {
        console.error('Failed to void document:', error);
        alert(t('alerts.cancelError'));
      }
    },
    [refetch, t]
  );

  const handleLoadMore = useCallback(() => {
    if (documentsData?.pagination && page < documentsData.pagination.pages) {
      setPage(page + 1);
    }
  }, [documentsData?.pagination, page]);

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
    setPage(1);
  }, []);

  // Export monthly report
  const handleExportMonthlyReport = useCallback(() => {
    const rows: string[][] = [];
    const dateLabel = dateRange.label;

    rows.push([t('report.title')]);
    rows.push([t('report.period'), dateLabel]);
    rows.push([t('report.generatedAt'), dayjs().format('DD/MM/YYYY HH:mm')]);
    rows.push([]);

    rows.push([t('report.summary')]);
    rows.push([t('report.totalRevenue'), `₪${stats.totalRevenue.toLocaleString()}`]);
    rows.push([t('report.pendingAmount'), `₪${stats.pendingAmount.toLocaleString()}`]);
    rows.push([t('report.overdueAmount'), `₪${stats.overdueAmount.toLocaleString()}`]);
    rows.push([t('report.totalDocs'), String(stats.totalDocs)]);
    rows.push([]);

    rows.push([t('report.documents')]);
    rows.push([
      t('report.columns.number'),
      t('report.columns.customer'),
      t('report.columns.studio'),
      t('report.columns.date'),
      t('report.columns.amount'),
      t('report.columns.status')
    ]);
    sortedDocs.forEach((doc) => {
      rows.push([
        doc.number,
        doc.customerName,
        doc.studioName,
        doc.date,
        `₪${doc.amount.toLocaleString()}`,
        t(`status.${doc.status}`)
      ]);
    });

    const csvContent = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monthly_report_${dayjs().format('YYYY-MM')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [dateRange.label, stats, sortedDocs, t]);

  // Handle new invoice success
  const handleNewInvoiceSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  // Handle quick charge success
  const handleQuickChargeSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="merchant-documents">
      {/* Header */}
      <div className="merchant-documents__header">
        <div className="merchant-documents__title-row">
          <FileText size={28} className="merchant-documents__icon" />
          <h1 className="merchant-documents__title">{t('title')}</h1>
        </div>

        <div className="merchant-documents__actions">
          <button
            className="merchant-documents__btn merchant-documents__btn--secondary"
            onClick={handleExportMonthlyReport}
          >
            <Download size={18} />
            {t('actions.exportReport')}
          </button>
          <button
            className="merchant-documents__btn merchant-documents__btn--accent"
            onClick={() => setIsQuickChargeOpen(true)}
          >
            {t('actions.quickCharge', 'סליקה מהירה')}
          </button>
          <button
            className="merchant-documents__btn merchant-documents__btn--primary"
            onClick={() => setIsNewInvoiceOpen(true)}
          >
            {t('actions.newInvoice')}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="merchant-documents__stats">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary">
            <FileCheck size={20} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">₪{stats.totalRevenue.toLocaleString()}</div>
            <div className="stat-card__label">{t('stats.totalRevenue')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--warning">
            <FileClock size={20} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">₪{stats.pendingAmount.toLocaleString()}</div>
            <div className="stat-card__label">{t('stats.pendingAmount')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--danger">
            <AlertCircle size={20} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">₪{stats.overdueAmount.toLocaleString()}</div>
            <div className="stat-card__label">{t('stats.overdueAmount')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--neutral">
            <FileText size={20} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.totalDocs}</div>
            <div className="stat-card__label">{t('stats.totalDocs')}</div>
          </div>
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
              placeholder={t('filters.search')}
              className="filter-input__field"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Studio Filter */}
          <div className="filter-select">
            <select
              className="filter-select__field"
              value={selectedStudio}
              onChange={(e) => {
                setSelectedStudio(e.target.value);
                setPage(1);
              }}
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
              onChange={(e) => {
                setSelectedStatus(e.target.value as DocStatus | 'all');
                setPage(1);
              }}
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="filter-select__icon" size={16} />
          </div>

          {/* Date Range */}
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
        </div>
      </div>

      {/* Documents Table */}
      <div className="merchant-documents__table-container">
        <div className="merchant-documents__table-scroll">
          <table className="documents-table">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th className="documents-table__th" onClick={() => toggleSort('number')}>
                  <div className="documents-table__th-content">
                    {t('table.document')}
                    <ArrowUpDown size={12} className={sortBy === 'number' ? 'active' : ''} />
                  </div>
                </th>
                <th className="documents-table__th" onClick={() => toggleSort('customerName')}>
                  <div className="documents-table__th-content">
                    {t('table.customer')}
                    <ArrowUpDown size={12} className={sortBy === 'customerName' ? 'active' : ''} />
                  </div>
                </th>
                <th className="documents-table__th documents-table__th--date" onClick={() => toggleSort('date')}>
                  <div className="documents-table__th-content">
                    {t('table.date')}
                    <ArrowUpDown size={12} className={sortBy === 'date' ? 'active' : ''} />
                  </div>
                </th>
                <th className="documents-table__th documents-table__th--amount" onClick={() => toggleSort('amount')}>
                  <div className="documents-table__th-content">
                    {t('table.amount')}
                    <ArrowUpDown size={12} className={sortBy === 'amount' ? 'active' : ''} />
                  </div>
                </th>
                <th className="documents-table__th documents-table__th--status">{t('table.status')}</th>
                <th className="documents-table__th documents-table__th--actions">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="documents-table__loading">
                    <div>
                      <div className="documents-table__spinner" />
                      <span>{t('loading')}</span>
                    </div>
                  </td>
                </tr>
              ) : sortedDocs.length > 0 ? (
                <AnimatePresence mode="sync">
                  {sortedDocs.map((doc) => (
                    <DocumentRow
                      key={doc.id}
                      doc={doc}
                      onDownload={handleDownloadDocument}
                      onView={handleViewDocument}
                      onSendEmail={handleSendEmail}
                      onDuplicate={handleDuplicateDocument}
                      onVoid={handleVoidDocument}
                      onPrint={handlePrintDocument}
                      t={t}
                    />
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={6} className="documents-table__empty">
                    {t('table.noResults')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Load More */}
      {documentsData?.pagination && page < documentsData.pagination.pages && (
        <div className="merchant-documents__load-more">
          <button className="merchant-documents__load-more-btn" onClick={handleLoadMore}>
            {t('loadMore')} ({documentsData.pagination.total - sortedDocs.length} {t('remaining')})
          </button>
        </div>
      )}

      {/* New Invoice Modal */}
      <NewInvoiceModal
        open={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        onSuccess={handleNewInvoiceSuccess}
        studioName={getLocalizedName(userStudios[0]?.name)}
        vendorId={user?._id}
      />

      {/* Quick Charge Modal */}
      <QuickChargeModal
        open={isQuickChargeOpen}
        onClose={() => setIsQuickChargeOpen(false)}
        onSuccess={handleQuickChargeSuccess}
        studioName={getLocalizedName(userStudios[0]?.name)}
      />
    </div>
  );
};

export default MerchantDocumentsPage;
